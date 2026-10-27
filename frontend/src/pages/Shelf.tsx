import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router'
import plantar from '../assets/plantar.png'
import plantar2 from '../assets/plantar2.png'
import { BookCover } from '../components/BookCover'
import { ShelfFilters, type Filters } from '../components/ShelfFilters'
import * as api from '../services/api'
import type { Book } from '../types'
import { isReading } from '../utils/reading'
import './shelf.css'

const MIN_SHELVES = 3
const GAP = 22

/** Quantos livros cabem por prateleira, de acordo com a largura da estante. */
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

/** Compara sem diferenciar maiúsculas nem acentos ("Hábitos" acha "habitos"). */
function normalize(text: string) {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
}

/** Valores únicos (ignorando maiúsculas/acentos), mantendo a primeira grafia, em ordem alfabética. */
function uniqueSorted(values: string[]) {
  const seen = new Map<string, string>()
  for (const v of values) if (v.trim() && !seen.has(normalize(v))) seen.set(normalize(v), v.trim())
  return [...seen.values()].sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

export function Shelf() {
  const [books, setBooks] = useState<Book[]>()
  const highlight = (useLocation().state as { added?: string } | null)?.added
  const { ref, perShelf, bookWidth } = useBooksPerShelf()

  // filtros ficam na URL para continuarem lá ao voltar da página de um livro
  const [params, setParams] = useSearchParams()
  const statusParam = params.get('leitura')
  const filters: Filters = {
    query: params.get('q') ?? '',
    genre: params.get('genero') ?? '',
    tags: params.getAll('tag'),
    status: statusParam === 'lendo' ? 'reading' : statusParam === 'lido' ? 'read' : '',
  }

  function setFilters(next: Filters) {
    const p = new URLSearchParams()
    if (next.query) p.set('q', next.query)
    if (next.genre) p.set('genero', next.genre)
    if (next.status) p.set('leitura', next.status === 'reading' ? 'lendo' : 'lido')
    next.tags.forEach((t) => p.append('tag', t))
    setParams(p, { replace: true, state: null })
  }

  useEffect(() => {
    void api.listBooks().then(setBooks)
  }, [])

  const allBooks = books ?? []
  const genres = uniqueSorted(allBooks.map((b) => b.genre ?? ''))
  const tags = uniqueSorted(allBooks.flatMap((b) => b.tags))
  const query = normalize(filters.query)
  const visible = allBooks.filter(
    (b) =>
      (!query || normalize(b.title).includes(query)) &&
      (!filters.genre || normalize(b.genre ?? '') === normalize(filters.genre)) &&
      filters.tags.every((t) => b.tags.includes(t)) &&
      (!filters.status || (filters.status === 'reading') === isReading(b)),
  )
  const readingCount = allBooks.filter(isReading).length
  const filtering = visible.length !== allBooks.length

  const shelves: Book[][] = []
  for (let i = 0; i < visible.length; i += perShelf) shelves.push(visible.slice(i, i + perShelf))
  while (shelves.length < MIN_SHELVES) shelves.push([])

  return (
    <section className="page shelf-page">
      <img src={plantar} alt="" className="plant plant--hanging-left" />

      <div className="page-head">
        <div>
          <h1>minha estante</h1>
          {books && (
            <p>
              {filtering
                ? `${visible.length} de ${allBooks.length} livros`
                : `${allBooks.length} ${allBooks.length === 1 ? 'livro' : 'livros'}${readingCount ? ` · ${readingCount} lendo agora` : ''}`}
            </p>
          )}
        </div>
        <Link to="/adicionar" className="btn btn--primary">
          + adicionar livro
        </Link>
      </div>

      {/* faixa acima da estante: vasinho à esquerda, busca e filtros à direita */}
      <div className="shelf-top">
        {allBooks.length > 0 && <ShelfFilters filters={filters} genres={genres} tags={tags} showStatus={readingCount > 0} onChange={setFilters} />}
      </div>

      <div className="bookcase" style={{ '--book-w': `${bookWidth}px`, '--gap': `${GAP}px` } as CSSProperties}>
        <img src={plantar2} alt="" className="plant bookcase__plant" />
        <div className="bookcase__inner" ref={ref}>
          {shelves.map((row, i) => (
            <div className="bookcase__shelf" key={i}>
              <div className="bookcase__books">
                {i === 0 && books?.length === 0 && (
                  <p className="shelf-empty">
                    todo livro tem um aprendizado.
                    <br />
                    qual foi o último que você leu?
                  </p>
                )}
                {i === 0 && allBooks.length > 0 && visible.length === 0 && (
                  <p className="shelf-empty">nenhum livro da sua estante combina com essa busca.</p>
                )}
                {row.map((book) => (
                  <Link
                    key={book.id}
                    to={`/livro/${book.id}`}
                    state={{ fromShelf: true }}
                    className={book.id === highlight ? 'shelf-book is-new' : 'shelf-book'}
                    title={[book.title, book.author, isReading(book) && '(lendo)'].filter(Boolean).join(' — ')}
                  >
                    <BookCover title={book.title} author={book.author} coverUrl={book.coverUrl} />
                    {/* fitinha marcando onde a leitura parou */}
                    {isReading(book) && <span className="shelf-book__ribbon" role="img" aria-label="lendo" />}
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
