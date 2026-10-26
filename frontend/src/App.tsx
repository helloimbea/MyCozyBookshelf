import { useEffect, useState } from 'react'
import './App.css'

type Hello = { message: string; timestamp: string }

function App() {
  const [data, setData] = useState<Hello | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/hello')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<Hello>
      })
      .then(setData)
      .catch((err: Error) => setError(err.message))
  }, [])

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Projeto — Spring Boot + React</h1>
      {error && <p style={{ color: 'crimson' }}>Erro ao chamar o backend: {error}</p>}
      {!error && !data && <p>Carregando…</p>}
      {data && (
        <p>
          {data.message} <small>({data.timestamp})</small>
        </p>
      )}
    </main>
  )
}

export default App
