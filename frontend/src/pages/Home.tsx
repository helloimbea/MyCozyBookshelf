import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import chameleon from '../assets/chameleon.png'
import hangingPlant from '../assets/hanging-plant.png'
import pottedPlant from '../assets/potted-plant.png'
import { useAuth } from '../auth/context'
import { BookCover } from '../components/BookCover'
import { DemoButton } from '../components/DemoButton'
import { ReflectionCarousel } from '../components/ReflectionCarousel'
import { useI18n } from '../i18n/context'
import * as api from '../services/api'
import type { Book, PinnedReflection, PinnedView } from '../types'
import './home.css'

export function Home() {
  const { user } = useAuth()
  const { t } = useI18n()

  return (
    <section className="home">
      <img src={hangingPlant} alt="" className="plant plant--hanging-left" />
      {user ? (
        <>
          <div className="home__greeting">
            <h1>{t.home.hi(user.name)}</h1>
            <p>{t.home.glad}</p>
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
  const { t } = useI18n()

  return (
    <div className="home-card home-card--welcome">
      <img src={pottedPlant} alt="" className="plant home-card__pot" />
      <figure className="home-mascot">
        <img src={chameleon} alt="" className="home-card__mascot" />
        <figcaption>{t.home.mascotCaption}</figcaption>
      </figure>
      <h1>{t.home.motto}</h1>
      <p>{t.home.welcome}</p>
      <div className="home-card__actions">
        <Link to="/signup" className="btn btn--primary">
          {t.home.createShelf}
        </Link>
        <Link to="/login" className="btn btn--soft">
          {t.home.haveAccount}
        </Link>
      </div>
      <p className="home-card__demo">
        {t.demo.justLooking} <DemoButton className="link-button" />
      </p>
    </div>
  )
}

function PinnedCard() {
  const { t } = useI18n()
  // undefined = loading, null = nothing pinned
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

  // memories: every reflection except the pinned one, newest first
  const pinnedId = pinned?.pinned.kind === 'reflection' ? pinned.pinned.reflectionId : undefined
  const memories = books
    .flatMap((book) => book.reflections.map((reflection) => ({ book, reflection })))
    .filter(({ reflection }) => reflection.id !== pinnedId)
    .sort((a, b) => b.reflection.createdAt.localeCompare(a.reflection.createdAt))

  return (
    <>
      <div className="home-card">
        <img src={pottedPlant} alt="" className="plant home-card__pot" />

        {editing ? (
          <PinEditor books={books} current={pinned?.pinned} onSave={save} onCancel={() => setEditing(false)} />
        ) : pinned ? (
          <figure className="pinned">
            <span className="chip">{t.home.pinnedLabel}</span>
            <blockquote className="pinned__text">{pinned.text}</blockquote>
            <figcaption className="pinned__source">
              {pinned.book ? (
                <Link to={`/book/${pinned.book.id}`} className="pinned__book">
                  <BookCover title={pinned.book.title} author={pinned.book.author} coverUrl={pinned.book.coverUrl} className="pinned__cover" />
                  <span>
                    <strong>{pinned.book.title}</strong>
                    {pinned.book.author && <span>{pinned.book.author}</span>}
                  </span>
                </Link>
              ) : (
                <span className="pinned__own">{t.home.writtenByYou}</span>
              )}
            </figcaption>
            <div className="home-card__actions">
              <button type="button" className="btn btn--soft btn--small" onClick={() => setEditing(true)}>
                {t.home.change}
              </button>
              <button type="button" className="btn btn--ghost btn--small" onClick={() => save(null)}>
                {t.home.unpin}
              </button>
            </div>
          </figure>
        ) : (
          <div className="home-empty">
            <img src={chameleon} alt="" className="home-card__mascot" />
            <h2>{t.home.emptyTitle}</h2>
            <p>{t.home.emptyText}</p>
            <button type="button" className="btn btn--primary" onClick={() => setEditing(true)}>
              {t.home.choose}
            </button>
          </div>
        )}
      </div>
      <ReflectionCarousel items={memories} />
    </>
  )
}

type EditorProps = {
  books: Book[]
  current?: PinnedReflection
  onSave: (pinned: PinnedReflection) => Promise<void>
  onCancel: () => void
}

function PinEditor({ books, current, onSave, onCancel }: EditorProps) {
  const { t } = useI18n()
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
      if (!option) return setError(t.home.pickError)
      return onSave({ kind: 'reflection', bookId: option.book.id, reflectionId: option.reflection.id })
    }
    if (!text.trim()) return setError(t.home.writeError)
    return onSave({ kind: 'custom', text: text.trim() })
  }

  return (
    <div className="pin-editor">
      <h2>{t.home.editorTitle}</h2>

      <div className="segmented pin-editor__tabs" role="tablist">
        <button type="button" role="tab" aria-selected={mode === 'pick'} onClick={() => setMode('pick')}>
          {t.home.pickTab}
        </button>
        <button type="button" role="tab" aria-selected={mode === 'write'} onClick={() => setMode('write')}>
          {t.home.writeTab}
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
            {t.home.noReflections} <Link to="/shelf">{t.home.goToShelf}</Link>
          </p>
        )
      ) : (
        <textarea className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder={t.home.customPlaceholder} autoFocus />
      )}

      {error && <p className="form-error">{error}</p>}

      <div className="home-card__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          {t.common.cancel}
        </button>
        <button type="button" className="btn btn--primary" onClick={handleSave}>
          {t.home.pin}
        </button>
      </div>
    </div>
  )
}
