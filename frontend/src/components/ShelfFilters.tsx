import { useState } from 'react'
import { useI18n } from '../i18n/context'
import type { ReadingStatus } from '../types'
import './ShelfFilters.css'

export type Filters = {
  query: string
  genre: string
  tags: string[]
  status: ReadingStatus | ''
}

type Props = {
  filters: Filters
  genres: string[]
  tags: string[]
  /** shows the reading filter (only makes sense when some books are being read) */
  showStatus?: boolean
  onChange: (filters: Filters) => void
}

export function ShelfFilters({ filters, genres, tags, showStatus = false, onChange }: Props) {
  const { t } = useI18n()
  // genres and tags stay collapsed so they don't push the bookcase down
  const [open, setOpen] = useState(false)
  const activeCount = (filters.status ? 1 : 0) + (filters.genre ? 1 : 0) + filters.tags.length
  const hasOptions = showStatus || genres.length > 0 || tags.length > 0

  function toggleTag(tag: string) {
    const next = filters.tags.includes(tag) ? filters.tags.filter((x) => x !== tag) : [...filters.tags, tag]
    onChange({ ...filters, tags: next })
  }

  return (
    <div className="filters">
      <div className="filters__bar">
        <label className="filters__search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder={t.filters.searchPlaceholder}
            aria-label={t.filters.searchPlaceholder}
          />
        </label>

        {hasOptions && (
          <button
            type="button"
            className={open || activeCount ? 'filters__toggle is-on' : 'filters__toggle'}
            aria-expanded={open}
            aria-controls="shelf-filters"
            onClick={() => setOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            {t.filters.filter}
            {activeCount > 0 && <span className="filters__count">{activeCount}</span>}
          </button>
        )}
      </div>

      {open ? (
        <div id="shelf-filters" className="filters__panel">
          {showStatus && (
            <div className="filters__group" role="group" aria-label={t.filters.byReading}>
              <span className="filters__label">{t.filters.reading}</span>
              {(['reading', 'read'] as ReadingStatus[]).map((s) => {
                const on = filters.status === s
                return (
                  <button key={s} type="button" className={on ? 'filter-chip is-on' : 'filter-chip'} aria-pressed={on} onClick={() => onChange({ ...filters, status: on ? '' : s })}>
                    {t.status[s]}
                  </button>
                )
              })}
            </div>
          )}
          {genres.length > 0 && (
            <div className="filters__group" role="group" aria-label={t.filters.byGenre}>
              <span className="filters__label">{t.filters.genre}</span>
              {genres.map((genre) => {
                const on = filters.genre === genre
                return (
                  <button key={genre} type="button" className={on ? 'filter-chip is-on' : 'filter-chip'} aria-pressed={on} onClick={() => onChange({ ...filters, genre: on ? '' : genre })}>
                    {genre}
                  </button>
                )
              })}
            </div>
          )}

          {tags.length > 0 && (
            <div className="filters__group" role="group" aria-label={t.filters.byTag}>
              <span className="filters__label">{t.filters.tags}</span>
              {tags.map((tag) => {
                const on = filters.tags.includes(tag)
                return (
                  <button key={tag} type="button" className={on ? 'filter-chip is-on' : 'filter-chip'} aria-pressed={on} onClick={() => toggleTag(tag)}>
                    #{tag}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      ) : (
        activeCount > 0 && (
          // closed panel: shows only what is active, with an "x" to remove it
          <div className="filters__group" aria-label={t.filters.active}>
            {filters.status && (
              <button type="button" className="filter-chip is-on" onClick={() => onChange({ ...filters, status: '' })} aria-label={t.filters.remove(t.status[filters.status])}>
                {t.status[filters.status]} ×
              </button>
            )}
            {filters.genre && (
              <button type="button" className="filter-chip is-on" onClick={() => onChange({ ...filters, genre: '' })} aria-label={t.filters.remove(filters.genre)}>
                {filters.genre} ×
              </button>
            )}
            {filters.tags.map((tag) => (
              <button key={tag} type="button" className="filter-chip is-on" onClick={() => toggleTag(tag)} aria-label={t.filters.remove(tag)}>
                #{tag} ×
              </button>
            ))}
          </div>
        )
      )}

      {(filters.query || activeCount > 0) && (
        <button type="button" className="filters__clear" onClick={() => onChange({ query: '', genre: '', tags: [], status: '' })}>
          {t.filters.clear}
        </button>
      )}
    </div>
  )
}
