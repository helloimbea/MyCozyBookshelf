import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { BookCover } from '../components/BookCover'
import { BookForm } from '../components/BookForm'
import { FinishReadingDialog } from '../components/FinishReadingDialog'
import { ReflectionField } from '../components/ReflectionField'
import { StarRating } from '../components/StarRating'
import { errorText, useI18n } from '../i18n/context'
import * as api from '../services/api'
import type { Book, PinnedView } from '../types'
import { isReading, parsePage } from '../utils/reading'
import './book.css'

export function BookDetail() {
  const { t, formatDate, formatList } = useI18n()
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const cameFromShelf = (useLocation().state as { fromShelf?: boolean } | null)?.fromShelf === true
  const [book, setBook] = useState<Book | null>()
  const [pinned, setPinned] = useState<PinnedView | null>(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [draftPage, setDraftPage] = useState('')
  const [finishing, setFinishing] = useState(false)
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
        <h1>{t.book.notFound}</h1>
        <Link to="/shelf" className="btn btn--primary">
          {t.book.backToShelf}
        </Link>
      </section>
    )
  }

  async function handleAddReflection(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      await api.addReflection(book!.id, { text: draft, page: parsePage(draftPage) })
      setDraft('')
      setDraftPage('')
      setError('')
      await refresh()
    } catch (err) {
      setError(errorText(err, t))
    }
  }

  async function handleDeleteBook() {
    if (!confirm(t.book.confirmRemove(book!.title))) return
    await api.deleteBook(book!.id)
    navigate('/shelf')
  }

  async function handleDeleteReflection(reflectionId: string) {
    if (!confirm(t.book.confirmDeleteReflection)) return
    await api.deleteReflection(book!.id, reflectionId)
    await refresh()
  }

  async function handleFinish(finalReflection: string) {
    await api.finishReading(book!.id, { text: finalReflection })
    setFinishing(false)
    await refresh()
  }

  async function handlePin(reflectionId: string) {
    await api.setPinned({ kind: 'reflection', bookId: book!.id, reflectionId })
    await refresh()
  }

  const reading = isReading(book)
  const pinnedId = pinned?.pinned.kind === 'reflection' ? pinned.pinned.reflectionId : undefined
  // the invite only mentions the fields that are still empty
  const missing = [
    !book.author && t.book.fields.author,
    !book.summary && t.book.fields.summary,
    !book.genre && t.book.fields.genre,
    !book.pages && t.book.fields.pages,
    book.tags.length === 0 && t.book.fields.tags,
    !book.stars && t.book.fields.stars,
  ].filter(Boolean) as string[]
  const meta = [book.genre, book.pages && t.book.pagesCount(book.pages)].filter(Boolean) as string[]

  return (
    <section className="page">
      <Link
        to="/shelf"
        className="back-link"
        onClick={(e) => {
          // came from the shelf: go back in history to keep the search and filters
          if (cameFromShelf) {
            e.preventDefault()
            navigate(-1)
          }
        }}
      >
        {t.book.back}
      </Link>

      <div className="card">
        {editing ? (
          <BookForm
            initial={book}
            submitLabel={t.common.save}
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
              <span className={reading ? 'status-chip is-reading' : 'status-chip'}>
                {reading ? t.status.reading : book.finishedAt ? t.status.readOn(formatDate(book.finishedAt)) : t.status.read}
              </span>
              {book.stars && <StarRating value={book.stars} />}

              {(meta.length > 0 || book.tags.length > 0) && (
                <div className="book-info__chips">
                  {meta.map((m) => (
                    <span key={m} className="chip chip--beige">
                      {m}
                    </span>
                  ))}
                  {book.tags.map((tag) => (
                    <span key={tag} className="chip">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {book.summary && <p className="book-info__summary">{book.summary}</p>}
              {missing.length > 0 && <p className="book-info__missing">{t.book.canComplete(formatList(missing))}</p>}

              <p className="book-info__date">{t.book.onShelfSince(formatDate(book.createdAt))}</p>

              <div className="book-info__actions">
                {reading && (
                  <button type="button" className="btn btn--primary btn--small" onClick={() => setFinishing(true)}>
                    {t.book.finish}
                  </button>
                )}
                <button type="button" className="btn btn--soft btn--small" onClick={() => setEditing(true)}>
                  {t.book.edit}
                </button>
                <button type="button" className="btn btn--danger btn--small" onClick={handleDeleteBook}>
                  {t.book.remove}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <section className="reflections">
        <div>
          <h2>{t.book.reflections}</h2>
          <p className="reflections__lead">{reading ? t.book.leadReading : t.book.leadRead}</p>
        </div>

        <form className="reflection-new" onSubmit={handleAddReflection}>
          <ReflectionField value={draft} onChange={setDraft} genre={book.genre} page={draftPage} onPageChange={setDraftPage} />
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn--primary" disabled={!draft.trim()}>
            {t.book.saveReflection}
          </button>
        </form>

        {book.reflections.length === 0 && <p className="reflections__empty">{t.book.emptyReflections}</p>}

        {[...book.reflections].reverse().map((r) => (
          <article key={r.id} className={r.final ? 'reflection reflection--final' : 'reflection'}>
            <header>
              <time dateTime={r.createdAt}>{formatDate(r.createdAt)}</time>
              {r.page && <span className="chip">{t.book.page(r.page)}</span>}
              {r.final && <span className="chip">{t.book.finalChip}</span>}
              {r.id === pinnedId && <span className="chip">{t.book.pinnedChip}</span>}
            </header>
            <p>{r.text}</p>
            <footer>
              {r.id !== pinnedId && (
                <button type="button" className="btn btn--ghost btn--small" onClick={() => handlePin(r.id)}>
                  {t.book.pin}
                </button>
              )}
              <button type="button" className="btn btn--danger btn--small" onClick={() => handleDeleteReflection(r.id)}>
                {t.common.delete}
              </button>
            </footer>
          </article>
        ))}
      </section>

      <FinishReadingDialog open={finishing} bookTitle={book.title} onConfirm={handleFinish} onClose={() => setFinishing(false)} />
    </section>
  )
}
