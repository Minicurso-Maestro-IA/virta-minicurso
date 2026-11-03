/**
 * Autenticação de mentira, para a aula.
 *
 * Não existe servidor: qualquer senha com 4 caracteres ou mais entra, e a
 * sessão fica no localStorage. O objetivo é ter as telas de login e perfil
 * para trabalhar em cima, não ensinar segurança — um app de verdade jamais
 * decidiria isso no navegador.
 */

export interface Usuario {
  nome: string
  email: string
  entrouEm: string
}

const CHAVE = 'virta-aula-sessao'
const ATRASO_MS = 500
const esperar = () => new Promise<void>((ok) => setTimeout(ok, ATRASO_MS))

export function usuarioAtual(): Usuario | null {
  try {
    const bruto = localStorage.getItem(CHAVE)
    return bruto ? (JSON.parse(bruto) as Usuario) : null
  } catch {
    return null
  }
}

function gravar(u: Usuario | null): void {
  try {
    if (u) localStorage.setItem(CHAVE, JSON.stringify(u))
    else localStorage.removeItem(CHAVE)
  } catch {
    // aba anônima ou armazenamento bloqueado: a sessão dura só esta visita
  }
}

export class ErroDeLogin extends Error {}

export async function entrar(email: string, senha: string): Promise<Usuario> {
  await esperar()

  if (!email.includes('@')) throw new ErroDeLogin('Informe um e-mail válido.')
  if (senha.length < 4) throw new ErroDeLogin('E-mail ou senha incorretos.')

  const usuario: Usuario = {
    nome: email.split('@')[0].replace(/[._-]/g, ' '),
    email,
    entrouEm: new Date().toISOString()
  }
  gravar(usuario)
  return usuario
}

export function sair(): void {
  gravar(null)
}

export async function atualizarPerfil(dados: { nome: string; email: string }): Promise<Usuario> {
  await esperar()
  const atual = usuarioAtual()
  if (!atual) throw new ErroDeLogin('Sessão expirada.')
  const novo: Usuario = { ...atual, ...dados }
  gravar(novo)
  return novo
}
