import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { entrar } from '../auth/sessao'

export function Login() {
  const navegar = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      await entrar(email, senha)
      navegar('/')
    } catch (problema) {
      setErro(problema instanceof Error ? problema.message : 'Não foi possível entrar.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="login">
      <form className="login-caixa" onSubmit={enviar}>
        <h1 className="login-marca">Virta</h1>
        <p className="login-sub">Entre para ver sua carteira</p>

        <label className="campo">
          <span>E-mail</span>
          <input
            type="email"
            autoComplete="username"
            placeholder="voce@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="campo">
          <span>Senha</span>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="pelo menos 4 caracteres"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </label>

        <button className="primario largo" type="submit" disabled={enviando}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>

        {erro && <p className="erro">{erro}</p>}

        <p className="login-dica">
          É uma demonstração: qualquer e-mail válido e uma senha de 4 caracteres entram.
        </p>
      </form>
    </div>
  )
}
