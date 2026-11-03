import { useCallback, useEffect, useState } from 'react'
import { criarTransacao, excluirTransacao, listarTransacoes } from '../mock/db'
import type { Transacao, TipoTransacao } from '../tipos'
import { ListaTransacoes } from '../componentes/ListaTransacoes'
import { NovaTransacao } from '../componentes/NovaTransacao'

type Filtro = 'TODAS' | TipoTransacao

export function Transacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [filtro, setFiltro] = useState<Filtro>('TODAS')
  const [carregando, setCarregando] = useState(true)

  const carregar = useCallback(async () => {
    setCarregando(true)
    try {
      setTransacoes(await listarTransacoes())
    } finally {
      setCarregando(false)
    }
  }, [filtro])

  useEffect(() => {
    void carregar()
  }, [carregar])

  return (
    <>
      <h2 className="titulo">Transações</h2>

      <section className="painel">
        <div className="painel-topo">
          <div className="abas">
            {(['TODAS', 'RECEITA', 'DESPESA'] as Filtro[]).map((f) => (
              <button
                key={f}
                className={`aba ${filtro === f ? 'aba-ativa' : ''}`}
                onClick={() => setFiltro(f)}
              >
                {f === 'TODAS' ? 'Todas' : f === 'RECEITA' ? 'Receitas' : 'Despesas'}
              </button>
            ))}
          </div>
          <NovaTransacao
            aoCriar={async (dados) => {
              await criarTransacao(dados)
              await carregar()
            }}
          />
        </div>

        {carregando ? (
          <p className="carregando">Carregando...</p>
        ) : (
          <ListaTransacoes
            transacoes={transacoes}
            aoExcluir={async (id) => {
              await excluirTransacao(id)
              await carregar()
            }}
          />
        )}
      </section>
    </>
  )
}
