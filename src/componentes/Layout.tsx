import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { sair, usuarioAtual } from '../auth/sessao'
import { recomecar } from '../mock/db'

const ABAS = [
  { para: '/', rotulo: 'Dashboard', fim: true },
  { para: '/transacoes', rotulo: 'Transações', fim: false },
  { para: '/categorias', rotulo: 'Categorias', fim: false },
  { para: '/perfil', rotulo: 'Perfil', fim: false }
]

/** Iniciais do usuário para o avatar: "Maria Silva" -> "MS". */
function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/)
  return (partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')
}

export function Layout() {
  const navegar = useNavigate()
  const usuario = usuarioAtual()

  return (
    <div className="app">
      <header className="barra">
        <div className="barra-interna">
          <span className="marca">Virta</span>

          <nav className="nav">
            {ABAS.map((a) => (
              <NavLink
                key={a.para}
                to={a.para}
                end={a.fim}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-ativo' : ''}`}
              >
                {a.rotulo}
              </NavLink>
            ))}
          </nav>

          <div className="usuario">
            <button
              className="secundario pequeno"
              title="Devolve os dados ao estado inicial"
              onClick={() => {
                recomecar()
                navegar(0)
              }}
            >
              Recomeçar dados
            </button>
            <span className="avatar">{usuario ? iniciais(usuario.nome) : '?'}</span>
            <button
              className="secundario pequeno"
              onClick={() => {
                sair()
                navegar('/login')
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="conteudo">
        <Outlet />
      </main>
    </div>
  )
}
