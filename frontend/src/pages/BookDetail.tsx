import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { BookCover } from '../components/BookCover'
import { BookForm } from '../components/BookForm'
import { StarRating } from '../components/StarRating'
import * as api from '../services/api'
import type { Book, PinnedView } from '../types'
import { formatDate } from '../utils/image'
import './book.css'

export function BookDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const cameFromShelf = (useLocation().state as { fromShelf?: boolean } | null)?.fromShelf === true
  const [book, setBook] = useState<Book | null>()
  const [pinned, setPinned] = useState<PinnedView | null>(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    try {
      const [b, p] = await Promise.all([api.getBook(id), api.getPinned()])
      setBook(b)
      setPinned(p)
    } catch {
      setBook(null)
    }
  }, [id])

  useEffect(() => {
    void refresh()
  }, [refresh])

  if (book === undefined) return null

  if (book === null) {
    return (
      <section className="page book-missing">
        <h1>esse livro não está na sua estante</h1>
        <Link to="/estante" className="btn btn--primary">
          voltar para a estante
        </Link>
      </section>
    )
  }

  async function handleAddReflection(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      await api.addReflection(book!.id, draft)
      setDraft('')
      setError('')
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'algo deu errado, tente de novo.')
    }
  }

  async function handleDeleteBook() {
    if (!confirm(`tirar "${book!.title}" da estante? as reflexões dele também vão embora.`)) return
    await api.deleteBook(book!.id)
    navigate('/estante')
  }

  async function handleDeleteReflection(reflectionId: string) {
    if (!confirm('apagar essa reflexão?')) return
    await api.deleteReflection(book!.id, reflectionId)
    await refresh()
  }

  async function handlePin(reflectionId: string) {
    await api.setPinned({ kind: 'reflection', bookId: book!.id, reflectionId })
    await refresh()
  }

  const pinnedId = pinned?.pinned.kind === 'reflection' ? pinned.pinned.reflectionId : undefined
  const meta = [book.genre, book.pages && `${book.pages} páginas`].filter(Boolean) as string[]

  return (
    <section className="page">
      <Link
        to="/estante"
        className="back-link"
        onClick={(e) => {
          // veio da estante: volta no histórico para manter a busca e os filtros
          if (cameFromShelf) {
            e.preventDefault()
            navigate(-1)
          }
        }}
      >
        ← minha estante
      </Link>

      <div className="card">
        {editing ? (
          <BookForm
            initial={book}
            submitLabel="salvar"
            onSubmit={async (input) => {
              await api.updateBook(book.id, input)
              setEditing(false)
              await refresh()
            }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <div className="book-info">
            <BookCover title={book.title} author={book.author} coverUrl={book.coverUrl} className="book-info__cover" />
            <div className="book-info__body">
              <h1>{book.title}</h1>
              {book.author && <p className="book-info__author">{book.author}</p>}
              {book.stars && <StarRating value={book.stars} />}

              {(meta.length > 0 || book.tags.length > 0) && (
                <div className="book-info__chips">
                  {meta.map((m) => (
                    <span key={m} className="chip chip--beige">
                      {m}
                    </span>
                  ))}
                  {book.tags.map((t) => (
                    <span key={t} className="chip">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {book.summary ? (
                <p className="book-info__summary">{book.summary}</p>
              ) : (
                <p className="book-info__missing">
                  dá pra completar autor, resumo, gênero, páginas, tags e estrelas quando quiser.
                </p>
              )}

              <p className="book-info__date">na estante desde {formatDate(book.createdAt)}</p>

              <div className="book-info__actions">
                <button type="button" className="btn btn--soft btn--small" onClick={() => setEditing(true)}>
                  editar livro
                </button>
                <button type="button" className="btn btn--danger btn--small" onClick={handleDeleteBook}>
                  tirar da estante
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <section className="reflections">
        <h2>reflexões</h2>

        <form className="reflection-new" onSubmit={handleAddReflection}>
          <textarea className="input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="o que esse livro deixou em você?" />
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn--primary" disabled={!draft.trim()}>
            guardar reflexão
          </button>
        </form>

        {book.reflections.length === 0 && <p className="reflections__empty">ainda não tem nenhuma reflexão aqui.</p>}

        {[...book.reflections].reverse().map((r) => (
          <article key={r.id} className="reflection">
            <header>
              <time dateTime={r.createdAt}>{formatDate(r.createdAt)}</time>
              {r.id === pinnedId && <span className="chip">fixada no início</span>}
            </header>
            <p>{r.text}</p>
            <footer>
              {r.id !== pinnedId && (
                <button type="button" className="btn btn--ghost btn--small" onClick={() => handlePin(r.id)}>
                  fixar no início
                </button>
              )}
              <button type="button" className="btn btn--danger btn--small" onClick={() => handleDeleteReflection(r.id)}>
                apagar
              </button>
            </footer>
          </article>
        ))}
      </section>
    </section>
  )
}
