import { banco, gravar, novoId, type UsuarioGuardado } from "@/mock/dados";
import type { Category } from "@/types/category";
import type {
  DashboardSummary,
  Transaction,
  TransactionType,
} from "@/types/transaction";
import type { WalletMember, WalletRole } from "@/types/wallet";

/**
 * Servidor falso: intercepta o `fetch` do navegador e responde as rotas do
 * virta a partir do banco em localStorage.
 *
 * A interceptação é no `fetch` e não em cada service de propósito. O app faz
 * rede em quatro lugares diferentes — `lib/http.ts`, `lib/api.ts`, o download
 * do extrato e a assinatura de eventos — e remendar os quatro significaria
 * alterar código que os alunos vão ler. Assim, nenhum componente, service ou
 * contexto muda: só quem responde é outro.
 */

/** Espera curta: sem ela, nenhum estado de carregamento aparece na tela. */
const ATRASO_MS = 350;
const esperar = () => new Promise<void>((ok) => setTimeout(ok, ATRASO_MS));

function json(corpo: unknown, status = 200): Response {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const erro = (mensagem: string, status: number) => json({ error: mensagem }, status);

function corpoDe<T>(init?: RequestInit): T {
  try {
    return JSON.parse(String(init?.body ?? "{}")) as T;
  } catch {
    return {} as T;
  }
}

function perfilDe(u: UsuarioGuardado) {
  return { id: u.id, name: u.name, email: u.email, photo: u.photo, createdAt: u.createdAt };
}

/** Token da requisição em curso, lido do cabeçalho Authorization. */
let tokenAtual: string | null = null;

/** Lê o token de `Authorization: Bearer ...`, venha ele de onde vier. */
function tokenDe(entrada: RequestInfo | URL, init?: RequestInit): string | null {
  const cabecalhos = new Headers(
    init?.headers ?? (entrada instanceof Request ? entrada.headers : undefined),
  );
  const auth = cabecalhos.get("Authorization");
  return auth ? auth.replace(/^Bearer\s+/i, "") : null;
}

/**
 * O usuário da sessão, tirado do token que veio na requisição. O token é
 * `falso-<id>-<timestamp>`, montado no login. Sem token reconhecível cai no
 * primeiro do banco (a Maria da semente), que é o caso de quem ainda não
 * entrou.
 */
function usuarioLogado(): UsuarioGuardado {
  const b = banco();
  const id = Number(tokenAtual?.split("-")[1]);
  return b.usuarios.find((u) => u.id === id) ?? b.usuarios[0];
}

// --- transações e resumo ------------------------------------------------

function transacoesDa(walletId: number): Transaction[] {
  const b = banco();
  if (!b.transacoes[walletId]) b.transacoes[walletId] = [];
  return b.transacoes[walletId];
}

function resumo(walletId: number, busca: URLSearchParams): DashboardSummary {
  const inicio = busca.get("startDate");
  const fim = busca.get("endDate");
  const tipo = busca.get("type") as TransactionType | null;
  const categorias = busca.getAll("categoryIds").map(Number);

  const filtradas = transacoesDa(walletId).filter((t) => {
    if (inicio && fim && (t.date < inicio || t.date > fim)) return false;
    if (tipo && t.type !== tipo) return false;
    if (categorias.length && (t.categoryId === null || !categorias.includes(t.categoryId)))
      return false;
    return true;
  });

  const somaPor = (tipoAlvo: TransactionType) =>
    filtradas.filter((t) => t.type === tipoAlvo).reduce((s, t) => s + t.amount, 0);

  const porCategoria = new Map<number, { nome: string; cor: string | null; total: number }>();
  for (const t of filtradas) {
    if (t.categoryId === null) continue;
    const atual = porCategoria.get(t.categoryId) ?? {
      nome: t.categoryName ?? "",
      cor: t.categoryColor,
      total: 0,
    };
    atual.total += t.amount;
    porCategoria.set(t.categoryId, atual);
  }

  const porMes = new Map<string, { income: number; expense: number }>();
  for (const t of filtradas) {
    const m = t.date.slice(0, 7);
    const atual = porMes.get(m) ?? { income: 0, expense: 0 };
    if (t.type === "INCOME") atual.income += t.amount;
    else atual.expense += t.amount;
    porMes.set(m, atual);
  }

  return {
    totalIncome: somaPor("INCOME"),
    totalExpense: somaPor("EXPENSE"),
    balance: somaPor("INCOME") - somaPor("EXPENSE"),
    transactionCount: filtradas.length,
    byCategory: [...porCategoria.entries()].map(([categoryId, v]) => ({
      categoryId,
      categoryName: v.nome,
      categoryColor: v.cor,
      total: v.total,
    })),
    byMonth: [...porMes.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, v]) => ({ month, ...v })),
  };
}

// --- rotas ---------------------------------------------------------------

async function responder(metodo: string, caminho: string, busca: URLSearchParams, init?: RequestInit): Promise<Response | null> {
  const b = banco();
  const partes = caminho.split("/").filter(Boolean);

  // ----- autenticação -----
  if (caminho === "/auth/login" && metodo === "POST") {
    const { email, password } = corpoDe<{ email: string; password: string }>(init);
    const u = b.usuarios.find((x) => x.email.toLowerCase() === String(email).toLowerCase());
    if (!u || u.password !== password) return erro("auth.errors.invalid_credentials", 401);
    return json({ token: `falso-${u.id}-${Date.now()}`, id: u.id, name: u.name, email: u.email });
  }

  if (caminho === "/auth/register" && metodo === "POST") {
    const { name, email, password } = corpoDe<{ name: string; email: string; password: string }>(init);
    if (b.usuarios.some((x) => x.email.toLowerCase() === String(email).toLowerCase()))
      return erro("auth.errors.email_taken", 409);
    b.usuarios.push({
      id: novoId(),
      name,
      email,
      password,
      photo: null,
      createdAt: new Date().toISOString(),
    });
    gravar();
    return json({}, 201);
  }

  if (caminho === "/auth/google" && metodo === "POST") {
    return erro("Login com Google não está disponível nesta versão de aula.", 400);
  }

  if (caminho === "/auth/forgot-password" && metodo === "POST") {
    return json({ message: "Se o e-mail existir, enviaremos um link." });
  }

  if (caminho === "/auth/reset-password" && metodo === "POST") {
    return json({});
  }

  // ----- usuário -----
  if (caminho === "/api/v1/users/me") {
    const u = usuarioLogado();
    if (metodo === "GET") return json(perfilDe(u));
    if (metodo === "PUT") {
      const { name } = corpoDe<{ name: string }>(init);
      u.name = name;
      gravar();
      return json(perfilDe(u));
    }
  }

  if (caminho === "/api/v1/users/me/password" && metodo === "PATCH") {
    const { currentPassword, newPassword } = corpoDe<{ currentPassword: string; newPassword: string }>(init);
    const u = usuarioLogado();
    if (u.password !== currentPassword) return erro("A senha atual está incorreta.", 400);
    u.password = newPassword;
    gravar();
    return new Response(null, { status: 204 });
  }

  // ----- categorias -----
  if (caminho === "/api/v1/categories") {
    if (metodo === "GET") {
      const tipo = busca.get("type") as TransactionType | null;
      return json(tipo ? b.categorias.filter((c) => c.type === tipo) : b.categorias);
    }
    if (metodo === "POST") {
      const entrada = corpoDe<{ name: string; type: TransactionType; color?: string; icon?: string }>(init);
      const nova: Category = {
        id: novoId(),
        name: entrada.name,
        type: entrada.type,
        color: entrada.color ?? null,
        icon: entrada.icon ?? null,
      };
      b.categorias.push(nova);
      gravar();
      return json(nova, 201);
    }
  }

  if (partes[0] === "api" && partes[2] === "categories" && partes[3]) {
    const id = Number(partes[3]);
    const i = b.categorias.findIndex((c) => c.id === id);
    if (i < 0) return erro("Categoria não encontrada.", 404);
    if (metodo === "PUT") {
      const entrada = corpoDe<{ name: string; type: TransactionType; color?: string }>(init);
      b.categorias[i] = { ...b.categorias[i], ...entrada, color: entrada.color ?? null };
      gravar();
      return json(b.categorias[i]);
    }
    if (metodo === "DELETE") {
      b.categorias.splice(i, 1);
      gravar();
      return new Response(null, { status: 204 });
    }
  }

  // ----- carteiras -----
  if (caminho === "/api/v1/wallets") {
    if (metodo === "GET") return json(b.carteiras);
    if (metodo === "POST") {
      const entrada = corpoDe<{ name: string; description?: string }>(init);
      const u = usuarioLogado();
      const nova = {
        id: novoId(),
        name: entrada.name,
        description: entrada.description ?? null,
        createdAt: new Date().toISOString(),
        role: "OWNER" as WalletRole,
        ownerName: u.name,
      };
      b.carteiras.push(nova);
      b.membros[nova.id] = [
        { userId: u.id, name: u.name, email: u.email, role: "OWNER", joinedAt: nova.createdAt },
      ];
      b.transacoes[nova.id] = [];
      gravar();
      return json(nova, 201);
    }
  }

  if (partes[0] === "api" && partes[2] === "wallets" && partes[3]) {
    const walletId = Number(partes[3]);
    const carteira = b.carteiras.find((c) => c.id === walletId);
    const resto = partes.slice(4);

    if (!carteira) return erro("Carteira não encontrada.", 404);

    // /wallets/:id
    if (resto.length === 0) {
      if (metodo === "GET") return json(carteira);
      if (metodo === "PUT") {
        const entrada = corpoDe<{ name: string; description?: string }>(init);
        Object.assign(carteira, { ...entrada, description: entrada.description ?? null });
        gravar();
        return json(carteira);
      }
      if (metodo === "DELETE") {
        b.carteiras = b.carteiras.filter((c) => c.id !== walletId);
        delete b.transacoes[walletId];
        delete b.membros[walletId];
        gravar();
        return new Response(null, { status: 204 });
      }
    }

    // /wallets/:id/members
    if (resto[0] === "members") {
      const membros: WalletMember[] = b.membros[walletId] ?? (b.membros[walletId] = []);
      if (!resto[1]) {
        if (metodo === "GET") return json(membros);
        if (metodo === "POST") {
          const { email, role } = corpoDe<{ email: string; role: WalletRole }>(init);
          const existente = b.usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase());
          const membro: WalletMember = {
            userId: existente?.id ?? novoId(),
            name: existente?.name ?? email.split("@")[0],
            email,
            role,
            joinedAt: new Date().toISOString(),
          };
          membros.push(membro);
          gravar();
          return json({ member: membro, created: !existente }, 201);
        }
      } else {
        const userId = Number(resto[1]);
        const i = membros.findIndex((m) => m.userId === userId);
        if (i < 0) return erro("Membro não encontrado.", 404);
        if (metodo === "PATCH") {
          membros[i].role = corpoDe<{ role: WalletRole }>(init).role;
          gravar();
          return json(membros[i]);
        }
        if (metodo === "DELETE") {
          membros.splice(i, 1);
          gravar();
          return new Response(null, { status: 204 });
        }
      }
    }

    // /wallets/:id/summary
    if (resto[0] === "summary" && metodo === "GET") return json(resumo(walletId, busca));

    // /wallets/:id/reports/statement  (CSV)
    if (resto[0] === "reports" && resto[1] === "statement") {
      const linhas = [
        "data;descricao;categoria;tipo;valor",
        ...transacoesDa(walletId).map((t) =>
          [t.date, t.description ?? "", t.categoryName ?? "", t.type, t.amount.toFixed(2)].join(";"),
        ),
      ];
      return new Response(linhas.join("\n"), {
        status: 200,
        headers: { "Content-Type": "text/csv" },
      });
    }

    // /wallets/:id/transactions
    if (resto[0] === "transactions") {
      // O stream de eventos não existe sem servidor. Responder 204 sem corpo faz
      // a assinatura encerrar em silêncio, que é o caminho que o app já trata.
      if (resto[1] === "events") return new Response(null, { status: 204 });

      const lista = transacoesDa(walletId);

      if (!resto[1]) {
        if (metodo === "GET") {
          const tipo = busca.get("type") as TransactionType | null;
          return json(tipo ? lista.filter((t) => t.type === tipo) : lista);
        }
        if (metodo === "POST") {
          const entrada = corpoDe<{
            type: TransactionType;
            amount: number;
            description?: string;
            date: string;
            categoryId?: number;
          }>(init);
          const categoria = b.categorias.find((c) => c.id === entrada.categoryId);
          const nova: Transaction = {
            id: novoId(),
            type: entrada.type,
            amount: entrada.amount,
            description: entrada.description ?? null,
            date: entrada.date,
            categoryId: categoria?.id ?? null,
            categoryName: categoria?.name ?? null,
            categoryColor: categoria?.color ?? null,
            createdByName: usuarioLogado().name,
            createdAt: new Date().toISOString(),
          };
          lista.push(nova);
          gravar();
          return json(nova, 201);
        }
      } else {
        const id = Number(resto[1]);
        const i = lista.findIndex((t) => t.id === id);
        if (i < 0) return erro("Transação não encontrada.", 404);
        if (metodo === "GET") return json(lista[i]);
        if (metodo === "PUT") {
          const entrada = corpoDe<{
            type: TransactionType;
            amount: number;
            description?: string;
            date: string;
            categoryId?: number;
          }>(init);
          const categoria = b.categorias.find((c) => c.id === entrada.categoryId);
          lista[i] = {
            ...lista[i],
            type: entrada.type,
            amount: entrada.amount,
            description: entrada.description ?? null,
            date: entrada.date,
            categoryId: categoria?.id ?? null,
            categoryName: categoria?.name ?? null,
            categoryColor: categoria?.color ?? null,
          };
          gravar();
          return json(lista[i]);
        }
        if (metodo === "DELETE") {
          lista.splice(i, 1);
          gravar();
          return new Response(null, { status: 204 });
        }
      }
    }
  }

  return null;
}

/** Liga o servidor falso. Chamado uma vez, antes de a aplicação subir. */
export function instalarServidorFalso(): void {
  const original = window.fetch.bind(window);

  window.fetch = async (entrada: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof entrada === "string" ? entrada : entrada instanceof URL ? entrada.href : entrada.url;
    const metodo = (init?.method ?? (entrada instanceof Request ? entrada.method : "GET")).toUpperCase();

    let caminho: string;
    let busca: URLSearchParams;
    try {
      const u = new URL(url, window.location.origin);
      caminho = u.pathname;
      busca = u.searchParams;
    } catch {
      return original(entrada as RequestInfo, init);
    }

    // O que não é da API segue para a rede de verdade: traduções, ícones,
    // service worker. Interceptar tudo quebraria o i18n.
    if (!caminho.startsWith("/api/") && !caminho.startsWith("/auth/")) {
      return original(entrada as RequestInfo, init);
    }

    await esperar();
    tokenAtual = tokenDe(entrada, init);
    const resposta = await responder(metodo, caminho, busca, init);
    return resposta ?? erro(`Rota não implementada no servidor falso: ${metodo} ${caminho}`, 404);
  };
}
