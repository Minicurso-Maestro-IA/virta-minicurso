import { useCallback, useEffect, useState } from 'react'
import { criarCategoria, excluirCategoria, listarCategorias } from '../mock/db'
import type { Categoria } from '../tipos'

const CORES = ['#f97316', '#3b82f6', '#a855f7', '#10b981', '#ec4899', '#eab308', '#06b6d4']

export function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [carregando, setCarregando] = useState(true)
  const [nome, setNome] = useState('')
  const [cor, setCor] = useState(CORES[0])
  const [enviando, setEnviando] = useState(false)

  const carregar = useCallback(async () => {
    setCarregando(true)
    try {
      setCategorias(await listarCategorias())
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    void carregar()
  }, [carregar])

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    try {
      await criarCategoria({ nome, cor })
      setNome('')
      await carregar()
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <h2 className="titulo">Categorias</h2>

      <section className="painel">
        <form className="formulario" onSubmit={enviar}>
          <input placeholder="Nome da categoria" value={nome} onChange={(e) => setNome(e.target.value)} />
          <div className="cores">
            {CORES.map((c) => (
              <button
                key={c}
                type="button"
                className={`cor ${cor === c ? 'cor-ativa' : ''}`}
                style={{ background: c }}
                onClick={() => setCor(c)}
                aria-label={`Cor ${c}`}
              />
            ))}
          </div>
          <button className="primario" type="submit" disabled={enviando}>
            {enviando ? 'Salvando...' : 'Adicionar'}
          </button>
        </form>

        {carregando ? (
          <p className="carregando">Carregando...</p>
        ) : (
          <ul className="lista">
            {categorias.map((c) => (
              <li key={c.id} className="linha">
                <span className="badge-ponto grande" style={{ background: c.cor }} />
                <div className="linha-meio">
                  <p className="descricao">{c.nome}</p>
                </div>
                <button
                  className="excluir"
                  onClick={async () => {
                    await excluirCategoria(c.id)
                    await carregar()
                  }}
                  aria-label={`Excluir ${c.nome}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
