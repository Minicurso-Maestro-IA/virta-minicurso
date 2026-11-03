import { useEffect, useState } from 'react'
import { obterResumo, type Resumo as DadosResumo } from '../mock/db'
import { Resumo } from '../componentes/Resumo'

export function Dashboard() {
  const [resumo, setResumo] = useState<DadosResumo | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    void (async () => {
      try {
        setResumo(await obterResumo())
      } finally {
        setCarregando(false)
      }
    })()
  }, [])

  return (
    <>
      <h2 className="titulo">Dashboard</h2>
      {carregando ? <p className="carregando">Carregando...</p> : resumo && <Resumo dados={resumo} />}
    </>
  )
}
