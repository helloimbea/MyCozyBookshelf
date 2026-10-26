import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import camaleao from '../assets/camaleao.png'
import plantar from '../assets/plantar.png'
import plantar2 from '../assets/plantar2.png'
import { useAuth } from '../auth/context'
import { BookCover } from '../components/BookCover'
import { DemoButton } from '../components/DemoButton'
import * as api from '../services/api'
import type { Book, PinnedReflection, PinnedView } from '../types'
import './home.css'

export function Home() {
  const { user } = useAuth()

  return (
    <section className="home">
      <img src={plantar} alt="" className="plant plant--hanging-left" />
      {user ? (
        <>
          <div className="home__greeting">
            <h1>oi, {user.name}!</h1>
            <p>que bom te ver por aqui.</p>
          </div>
          <PinnedCard />
        </>
      ) : (
        <Welcome />
      )}
    </section>
  )
}

function Welcome() {
  return (
    <div className="home-card home-card--welcome">
      <img src={plantar2} alt="" className="plant home-card__pot" />
      <img src={camaleao} alt="" className="home-card__mascot" />
      <h1>um cantinho pra guardar os livros que você leu</h1>
      <p>e tudo o que eles deixaram em você.</p>
      <div className="home-card__actions">
        <Link to="/cadastro" className="btn btn--primary">
          criar minha estante
        </Link>
        <Link to="/login" className="btn btn--soft">
          já tenho conta
        </Link>
      </div>
      <p className="home-card__demo">
        só quer dar uma olhadinha? <DemoButton className="link-button" />
      </p>
    </div>
  )
}

function PinnedCard() {
  // undefined = carregando, null = nada fixado
  const [pinned, setPinnedView] = useState<PinnedView | null>()
  const [books, setBooks] = useState<Book[]>([])
  const [editing, setEditing] = useState(false)

  const refresh = useCallback(async () => {
    const [p, b] = await Promise.all([api.getPinned(), api.listBooks()])
    setPinnedView(p)
    setBooks(b)
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  async function save(next: PinnedReflection | null) {
    await api.setPinned(next)
    setEditing(false)
    await refresh()
  }

  if (pinned === undefined) return <div className="home-card" />

  return (
    <div className="home-card">
      <img src={plantar2} alt="" className="plant home-card__pot" />

      {editing ? (
        <PinEditor books={books} current={pinned?.pinned} onSave={save} onCancel={() => setEditing(false)} />
      ) : pinned ? (
        <figure className="pinned">
          <span className="chip">reflexão fixada</span>
          <blockquote className="pinned__text">{pinned.text}</blockquote>
          <figcaption className="pinned__source">
            {pinned.book ? (
              <Link to={`/livro/${pinned.book.id}`} className="pinned__book">
                <BookCover title={pinned.book.title} author={pinned.book.author} coverUrl={pinned.book.coverUrl} className="pinned__cover" />
                <span>
                  <strong>{pinned.book.title}</strong>
                  {pinned.book.author && <span>{pinned.book.author}</span>}
                </span>
              </Link>
            ) : (
              <span className="pinned__own">escrita por você</span>
            )}
          </figcaption>
          <div className="home-card__actions">
            <button type="button" className="btn btn--soft btn--small" onClick={() => setEditing(true)}>
              trocar reflexão
            </button>
            <button type="button" className="btn btn--ghost btn--small" onClick={() => save(null)}>
              desafixar
            </button>
          </div>
        </figure>
      ) : (
        <div className="home-empty">
          <img src={camaleao} alt="" className="home-card__mascot" />
          <h2>fixe aqui uma reflexão que te acompanha</h2>
          <p>escolha uma das suas reflexões ou escreva uma nova, só pra este cantinho.</p>
          <button type="button" className="btn btn--primary" onClick={() => setEditing(true)}>
            escolher reflexão
          </button>
        </div>
      )}
    </div>
  )
}

type EditorProps = {
  books: Book[]
  current?: PinnedReflection
  onSave: (pinned: PinnedReflection) => Promise<void>
  onCancel: () => void
}

function PinEditor({ books, current, onSave, onCancel }: EditorProps) {
  const options = books
    .flatMap((book) => book.reflections.map((reflection) => ({ book, reflection })))
    .sort((a, b) => b.reflection.createdAt.localeCompare(a.reflection.createdAt))
  const [mode, setMode] = useState<'pick' | 'write'>(current?.kind === 'custom' || !options.length ? 'write' : 'pick')
  const [selected, setSelected] = useState(current?.kind === 'reflection' ? current.reflectionId : '')
  const [text, setText] = useState(current?.kind === 'custom' ? current.text : '')
  const [error, setError] = useState('')

  function handleSave() {
    if (mode === 'pick') {
      const option = options.find((o) => o.reflection.id === selected)
      if (!option) return setError('escolha uma das reflexões.')
      return onSave({ kind: 'reflection', bookId: option.book.id, reflectionId: option.reflection.id })
    }
    if (!text.trim()) return setError('escreva alguma coisa antes de fixar.')
    return onSave({ kind: 'custom', text: text.trim() })
  }

  return (
    <div className="pin-editor">
      <h2>o que você quer ver ao chegar aqui?</h2>

      <div className="segmented pin-editor__tabs" role="tablist">
        <button type="button" role="tab" aria-selected={mode === 'pick'} onClick={() => setMode('pick')}>
          escolher das minhas
        </button>
        <button type="button" role="tab" aria-selected={mode === 'write'} onClick={() => setMode('write')}>
          escrever uma nova
        </button>
      </div>

      {mode === 'pick' ? (
        options.length ? (
          <div className="pin-editor__list" role="radiogroup">
            {options.map(({ book, reflection }) => (
              <button
                key={reflection.id}
                type="button"
                role="radio"
                aria-checked={selected === reflection.id}
                className="pin-option"
                onClick={() => setSelected(reflection.id)}
              >
                <span className="pin-option__text">{reflection.text}</span>
                <span className="pin-option__book">{book.title}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="pin-editor__empty">
            você ainda não escreveu reflexões nos seus livros. <Link to="/estante">ir para a estante</Link>
          </p>
        )
      ) : (
        <textarea className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="uma frase, um pensamento, um lembrete pra você mesmo..." autoFocus />
      )}

      {error && <p className="form-error">{error}</p>}

      <div className="home-card__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          cancelar
        </button>
        <button type="button" className="btn btn--primary" onClick={handleSave}>
          fixar no início
        </button>
      </div>
    </div>
  )
}
