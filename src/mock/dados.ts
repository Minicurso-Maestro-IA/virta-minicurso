import type { Category } from "@/types/category";
import type { Transaction } from "@/types/transaction";
import type { Wallet, WalletMember } from "@/types/wallet";

/**
 * O "banco" do fork de aula: mora no localStorage do navegador.
 *
 * O virta de verdade conversa com uma API Java. Aqui não há servidor nenhum —
 * as telas, os componentes e os services continuam exatamente como no projeto
 * original; só quem responde mudou.
 */

const CHAVE = "virta-aula-banco-v1";

export interface UsuarioGuardado {
  id: number;
  name: string;
  email: string;
  password: string;
  photo: string | null;
  createdAt: string;
}

export interface Banco {
  usuarios: UsuarioGuardado[];
  carteiras: Wallet[];
  membros: Record<number, WalletMember[]>;
  categorias: Category[];
  transacoes: Record<number, Transaction[]>;
  proximoId: number;
}

const HOJE = new Date();
const mes = (quantos: number): string => {
  const d = new Date(HOJE.getFullYear(), HOJE.getMonth() - quantos, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
const dia = (quantos: number, diaDoMes: number): string =>
  `${mes(quantos)}-${String(diaDoMes).padStart(2, "0")}`;

const CATEGORIAS: Category[] = [
  { id: 1, name: "Mercado", type: "EXPENSE", color: "#f97316", icon: null },
  { id: 2, name: "Transporte", type: "EXPENSE", color: "#3b82f6", icon: null },
  { id: 3, name: "Moradia", type: "EXPENSE", color: "#a855f7", icon: null },
  { id: 4, name: "Lazer", type: "EXPENSE", color: "#ec4899", icon: null },
  { id: 5, name: "Salário", type: "INCOME", color: "#10b981", icon: null },
  { id: 6, name: "Freelance", type: "INCOME", color: "#14b8a6", icon: null },
];

function transacao(
  id: number,
  type: "INCOME" | "EXPENSE",
  amount: number,
  description: string,
  data: string,
  categoria: Category | null,
): Transaction {
  return {
    id,
    type,
    amount,
    description,
    date: data,
    categoryId: categoria?.id ?? null,
    categoryName: categoria?.name ?? null,
    categoryColor: categoria?.color ?? null,
    createdByName: "Maria Silva",
    createdAt: `${data}T10:00:00Z`,
  };
}

function semente(): Banco {
  const transacoes: Transaction[] = [
    transacao(1, "INCOME", 5400, "Salário do mês", dia(2, 5), CATEGORIAS[4]),
    transacao(2, "EXPENSE", 1850, "Aluguel", dia(2, 10), CATEGORIAS[2]),
    transacao(3, "EXPENSE", 842.9, "Compra do mês", dia(2, 12), CATEGORIAS[0]),
    transacao(4, "EXPENSE", 320.45, "Combustível", dia(2, 18), CATEGORIAS[1]),
    transacao(5, "INCOME", 5400, "Salário do mês", dia(1, 5), CATEGORIAS[4]),
    transacao(6, "EXPENSE", 1850, "Aluguel", dia(1, 10), CATEGORIAS[2]),
    transacao(7, "INCOME", 1200, "Projeto de fim de semana", dia(1, 14), CATEGORIAS[5]),
    transacao(
      8,
      "EXPENSE",
      287.6,
      "Jantar de aniversário com a família toda no restaurante novo do centro",
      dia(1, 20),
      CATEGORIAS[3],
    ),
    transacao(9, "INCOME", 5400, "Salário do mês", dia(0, 5), CATEGORIAS[4]),
    transacao(10, "EXPENSE", 1850, "Aluguel", dia(0, 8), CATEGORIAS[2]),
    transacao(11, "EXPENSE", 912.35, "Compra do mês", dia(0, 11), CATEGORIAS[0]),
    transacao(12, "EXPENSE", 180, "Passagens", dia(0, 15), null),
  ];

  return {
    usuarios: [
      {
        id: 1,
        name: "Maria Silva",
        email: "maria@virta.com",
        password: "123456",
        photo: null,
        createdAt: `${mes(8)}-01T09:00:00Z`,
      },
    ],
    carteiras: [
      {
        id: 1,
        name: "Casa",
        description: "Contas da casa e do dia a dia",
        createdAt: `${mes(8)}-01T09:00:00Z`,
        role: "OWNER",
        ownerName: "Maria Silva",
      },
      {
        id: 2,
        name: "Viagem de fim de ano",
        description: null,
        createdAt: `${mes(3)}-02T09:00:00Z`,
        role: "EDITOR",
        ownerName: "João Pinheiro",
      },
    ],
    membros: {
      1: [
        {
          userId: 1,
          name: "Maria Silva",
          email: "maria@virta.com",
          role: "OWNER",
          joinedAt: `${mes(8)}-01T09:00:00Z`,
        },
        {
          userId: 2,
          name: "João Pinheiro",
          email: "joao@virta.com",
          role: "EDITOR",
          joinedAt: `${mes(5)}-14T09:00:00Z`,
        },
        {
          userId: 3,
          name: "Ana Costa",
          email: "ana@virta.com",
          role: "VIEWER",
          joinedAt: `${mes(2)}-03T09:00:00Z`,
        },
      ],
      2: [
        {
          userId: 2,
          name: "João Pinheiro",
          email: "joao@virta.com",
          role: "OWNER",
          joinedAt: `${mes(3)}-02T09:00:00Z`,
        },
        {
          userId: 1,
          name: "Maria Silva",
          email: "maria@virta.com",
          role: "EDITOR",
          joinedAt: `${mes(3)}-02T09:00:00Z`,
        },
      ],
    },
    categorias: CATEGORIAS,
    transacoes: { 1: transacoes, 2: [] },
    proximoId: 100,
  };
}

let memoria: Banco | null = null;

export function banco(): Banco {
  if (memoria) return memoria;
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (bruto) {
      memoria = JSON.parse(bruto) as Banco;
      return memoria;
    }
  } catch {
    // aba anônima ou armazenamento bloqueado: segue só em memória
  }
  memoria = semente();
  gravar();
  return memoria;
}

export function gravar(): void {
  try {
    if (memoria) localStorage.setItem(CHAVE, JSON.stringify(memoria));
  } catch {
    // sem persistência o app continua, só esquece ao recarregar
  }
}

/** Devolve tudo ao estado inicial. */
export function recomecar(): void {
  memoria = semente();
  gravar();
}

export function novoId(): number {
  const b = banco();
  b.proximoId += 1;
  return b.proximoId;
}
