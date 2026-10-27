import { useEffect, useId, useState, type KeyboardEvent } from 'react'
import { useI18n } from '../i18n/context'
import { searchBooks, type BookSuggestion } from '../services/bookSearch'
import { BookCover } from './BookCover'
import './TitleSearch.css'

const MIN_CHARS = 3
const DEBOUNCE_MS = 450

type Props = {
  value: string
  onChange: (title: string) => void
  /** the person picked a suggestion: the form fills in the other fields */
  onPick: (book: BookSuggestion) => void
  autoFocus?: boolean
}

/** Title field that suggests books while the person types. */
export function TitleSearch({ value, onChange, onPick, autoFocus }: Props) {
  const { t } = useI18n()
  const listId = useId()
  const [typed, setTyped] = useState(false) // only searches after the person types
  const [open, setOpen] = useState(false)
  // results remember which query they belong to: if the text changed, it's still "searching…"
  const [found, setFound] = useState<{ query: string; books: BookSuggestion[] }>({ query: '', books: [] })
  const [active, setActive] = useState(-1)
  const query = value.trim()
  const searching = typed && query.length >= MIN_CHARS
  const loading = searching && found.query !== query
  const results = searching && !loading ? found.books : []

  useEffect(() => {
    if (!searching) return
    const controller = new AbortController()
    const timer = setTimeout(() => {
      searchBooks(query, controller.signal)
        .then((books) => {
          setFound({ query, books })
          setActive(-1)
        })
        .catch(() => {
          // search cancelled because the person kept typing
        })
    }, DEBOUNCE_MS)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query, searching])

  function pick(book: BookSuggestion) {
    onPick(book)
    setTyped(false)
    setOpen(false)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setOpen(false) // closes at any moment, even while still searching
      return
    }
    if (!open || !results.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1))
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault()
      pick(results[active])
    }
  }

  const showList = open && searching && (loading || results.length > 0)

  return (
    <div className="title-search">
      <input
        className="input"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setTyped(true)
          setOpen(true)
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        placeholder={t.form.titlePlaceholder}
        required
        autoFocus={autoFocus}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
      />

      {showList && (
        <div className="title-search__panel">
          <p className="title-search__hint">{loading ? t.search.searching : t.search.suggestions}</p>
          <ul id={listId} role="listbox" className="title-search__list" aria-label={t.search.listLabel}>
            {results.map((book, i) => (
              <li
                key={book.id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                className={i === active ? 'title-search__option is-active' : 'title-search__option'}
                // mousedown instead of click: it happens before the blur that closes the list
                onMouseDown={(e) => {
                  e.preventDefault()
                  pick(book)
                }}
                onMouseEnter={() => setActive(i)}
              >
                <BookCover title={book.title} author={book.author} coverUrl={book.coverUrl} className="title-search__cover" />
                <span className="title-search__info">
                  <strong>{book.title}</strong>
                  <span>{[book.author, book.year].filter(Boolean).join(' · ')}</span>
                </span>
              </li>
            ))}
          </ul>
          {!loading && <p className="title-search__hint">{t.search.notFound}</p>}
        </div>
      )}
    </div>
  )
}
