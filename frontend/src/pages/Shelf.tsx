import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router'
import hangingPlant from '../assets/hanging-plant.png'
import pottedPlant from '../assets/potted-plant.png'
import { BookCover } from '../components/BookCover'
import { ShelfFilters, type Filters } from '../components/ShelfFilters'
import { useI18n } from '../i18n/context'
import * as api from '../services/api'
import type { Book } from '../types'
import { isReading } from '../utils/reading'
import './shelf.css'

const MIN_SHELVES = 3
const GAP = 22

/** How many books fit per shelf, based on the bookcase width. */
function useBooksPerShelf() {
  const ref = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState({ perShelf: 6, bookWidth: 104 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width
      const bookWidth = width < 480 ? 78 : 104
      setLayout({ bookWidth, perShelf: Math.max(1, Math.floor((width + GAP) / (bookWidth + GAP))) })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, ...layout }
}

/** Compares ignoring case and accents ("Hábitos" matches "habitos"). */
function normalize(text: string) {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
}

/** Unique values (ignoring case/accents), keeping the first spelling, sorted alphabetically. */
function uniqueSorted(values: string[], locale: string) {
  const seen = new Map<string, string>()
  for (const v of values) if (v.trim() && !seen.has(normalize(v))) seen.set(normalize(v), v.trim())
  return [...seen.values()].sort((a, b) => a.localeCompare(b, locale))
}

export function Shelf() {
  const { t, locale } = useI18n()
  const [books, setBooks] = useState<Book[]>()
  const highlight = (useLocation().state as { added?: string } | null)?.added
  const { ref, perShelf, bookWidth } = useBooksPerShelf()

  // filters live in the URL so they are still there when coming back from a book page
  const [params, setParams] = useSearchParams()
  const statusParam = params.get('status')
  const filters: Filters = {
    query: params.get('q') ?? '',
    genre: params.get('genre') ?? '',
    tags: params.getAll('tag'),
    status: statusParam === 'reading' || statusParam === 'read' ? statusParam : '',
  }

  function setFilters(next: Filters) {
    const p = new URLSearchParams()
    if (next.query) p.set('q', next.query)
    if (next.genre) p.set('genre', next.genre)
    if (next.status) p.set('status', next.status)
    next.tags.forEach((tag) => p.append('tag', tag))
    setParams(p, { replace: true, state: null })
  }

  useEffect(() => {
    void api.listBooks().then(setBooks)
  }, [])

  const allBooks = books ?? []
  const genres = uniqueSorted(allBooks.map((b) => b.genre ?? ''), locale)
  const tags = uniqueSorted(allBooks.flatMap((b) => b.tags), locale)
  const query = normalize(filters.query)
  const visible = allBooks.filter(
    (b) =>
      (!query || normalize(b.title).includes(query)) &&
      (!filters.genre || normalize(b.genre ?? '') === normalize(filters.genre)) &&
      filters.tags.every((tag) => b.tags.includes(tag)) &&
      (!filters.status || (filters.status === 'reading') === isReading(b)),
  )
  const readingCount = allBooks.filter(isReading).length
  const filtering = visible.length !== allBooks.length

  const shelves: Book[][] = []
  for (let i = 0; i < visible.length; i += perShelf) shelves.push(visible.slice(i, i + perShelf))
  while (shelves.length < MIN_SHELVES) shelves.push([])

  return (
    <section className="page shelf-page">
      <img src={hangingPlant} alt="" className="plant plant--hanging-left" />

      <div className="page-head">
        <div>
          <h1>{t.shelf.title}</h1>
          {books && <p>{filtering ? t.shelf.filtered(visible.length, allBooks.length) : t.shelf.count(allBooks.length, readingCount)}</p>}
        </div>
        <Link to="/add" className="btn btn--primary">
          {t.shelf.addBook}
        </Link>
      </div>

      {/* strip above the bookcase: little pot on the left, search and filters on the right */}
      <div className="shelf-top">
        {allBooks.length > 0 && <ShelfFilters filters={filters} genres={genres} tags={tags} showStatus={readingCount > 0} onChange={setFilters} />}
      </div>

      <div className="bookcase" style={{ '--book-w': `${bookWidth}px`, '--gap': `${GAP}px` } as CSSProperties}>
        <img src={pottedPlant} alt="" className="plant bookcase__plant" />
        <div className="bookcase__inner" ref={ref}>
          {shelves.map((row, i) => (
            <div className="bookcase__shelf" key={i}>
              <div className="bookcase__books">
                {i === 0 && books?.length === 0 && (
                  <p className="shelf-empty">
                    {t.shelf.emptyLine1}
                    <br />
                    {t.shelf.emptyLine2}
                  </p>
                )}
                {i === 0 && allBooks.length > 0 && visible.length === 0 && <p className="shelf-empty">{t.shelf.noMatch}</p>}
                {row.map((book) => (
                  <Link
                    key={book.id}
                    to={`/book/${book.id}`}
                    state={{ fromShelf: true }}
                    className={book.id === highlight ? 'shelf-book is-new' : 'shelf-book'}
                    title={[book.title, book.author, isReading(book) && `(${t.status.reading})`].filter(Boolean).join(' — ')}
                  >
                    <BookCover title={book.title} author={book.author} coverUrl={book.coverUrl} />
                    {/* bookmark ribbon on books being read */}
                    {isReading(book) && <span className="shelf-book__ribbon" role="img" aria-label={t.status.reading} />}
                  </Link>
                ))}
              </div>
              <div className="bookcase__plank" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
