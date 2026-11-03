import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { usuarioAtual } from './auth/sessao'
import { Layout } from './componentes/Layout'
import { Login } from './paginas/Login'
import { Dashboard } from './paginas/Dashboard'
import { Transacoes } from './paginas/Transacoes'
import { Categorias } from './paginas/Categorias'
import { Perfil } from './paginas/Perfil'

/** Manda para o login quem não tem sessão. */
function Protegida({ children }: { children: React.ReactNode }) {
  return usuarioAtual() ? <>{children}</> : <Navigate to="/login" replace />
}

export function App() {
  // HashRouter, e não BrowserRouter: o site é publicado no GitHub Pages, que
  // não tem servidor para reescrever rotas. Com BrowserRouter, recarregar a
  // página em /perfil devolveria 404.
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <Protegida>
              <Layout />
            </Protegida>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/transacoes" element={<Transacoes />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
