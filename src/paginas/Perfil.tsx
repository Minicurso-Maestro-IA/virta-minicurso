import { useState } from 'react'
import { atualizarPerfil, usuarioAtual } from '../auth/sessao'
import { formatarData } from '../lib/formato'

export function Perfil() {
  const usuario = usuarioAtual()
  const [nome, setNome] = useState(usuario?.nome ?? '')
  const [email, setEmail] = useState(usuario?.email ?? '')
  const [salvo, setSalvo] = useState(false)
  const [enviando, setEnviando] = useState(false)

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    setSalvo(false)
    try {
      await atualizarPerfil({ nome, email })
      setSalvo(true)
    } finally {
      setEnviando(false)
    }
  }

  if (!usuario) return <p className="carregando">Sessão não encontrada.</p>

  return (
    <>
      <h2 className="titulo">Perfil</h2>

      <section className="painel perfil">
        <div className="perfil-topo">
          <span className="avatar grande">{usuario.nome.slice(0, 2).toUpperCase()}</span>
          <div>
            <p className="perfil-nome">{usuario.nome}</p>
            <p className="perfil-meta">{usuario.email}</p>
            <p className="perfil-meta">
              Na conta desde {formatarData(usuario.entrouEm.slice(0, 10))}
            </p>
          </div>
        </div>

        <form className="perfil-form" onSubmit={enviar}>
          <label className="campo">
            <span>Nome</span>
            <input value={nome} onChange={(e) => setNome(e.target.value)} />
          </label>

          <label className="campo">
            <span>E-mail</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <button className="primario" type="submit" disabled={enviando}>
            {enviando ? 'Salvando...' : 'Salvar alterações'}
          </button>

          {salvo && <p className="sucesso">Perfil atualizado.</p>}
        </form>
      </section>
    </>
  )
}
