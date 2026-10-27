import { useState } from 'react'
import type { ReadingStatus } from '../types'
import './ShelfFilters.css'

const STATUS_LABEL: Record<ReadingStatus, string> = { reading: 'lendo', read: 'lido' }

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
  /** mostra o filtro de leitura (só faz sentido se há livros sendo lidos) */
  showStatus?: boolean
  onChange: (filters: Filters) => void
}

export function ShelfFilters({ filters, genres, tags, showStatus = false, onChange }: Props) {
  // gêneros e tags ficam recolhidos para não empurrar a estante para baixo
  const [open, setOpen] = useState(false)
  const activeCount = (filters.status ? 1 : 0) + (filters.genre ? 1 : 0) + filters.tags.length
  const hasOptions = showStatus || genres.length > 0 || tags.length > 0

  function toggleTag(tag: string) {
    const next = filters.tags.includes(tag) ? filters.tags.filter((t) => t !== tag) : [...filters.tags, tag]
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
            placeholder="procurar pelo título"
            aria-label="procurar pelo título"
          />
        </label>

        {hasOptions && (
          <button
            type="button"
            className={open || activeCount ? 'filters__toggle is-on' : 'filters__toggle'}
            aria-expanded={open}
            aria-controls="filtros-da-estante"
            onClick={() => setOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            filtrar
            {activeCount > 0 && <span className="filters__count">{activeCount}</span>}
          </button>
        )}
      </div>

      {open ? (
        <div id="filtros-da-estante" className="filters__panel">
          {showStatus && (
            <div className="filters__group" role="group" aria-label="filtrar por leitura">
              <span className="filters__label">leitura</span>
              {(['reading', 'read'] as ReadingStatus[]).map((s) => {
                const on = filters.status === s
                return (
                  <button key={s} type="button" className={on ? 'filter-chip is-on' : 'filter-chip'} aria-pressed={on} onClick={() => onChange({ ...filters, status: on ? '' : s })}>
                    {STATUS_LABEL[s]}
                  </button>
                )
              })}
            </div>
          )}
          {genres.length > 0 && (
            <div className="filters__group" role="group" aria-label="filtrar por gênero">
              <span className="filters__label">gênero</span>
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
            <div className="filters__group" role="group" aria-label="filtrar por tag">
              <span className="filters__label">tags</span>
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
          // painel fechado: mostra só o que está ativo, com "x" para tirar
          <div className="filters__group" aria-label="filtros ativos">
            {filters.status && (
              <button type="button" className="filter-chip is-on" onClick={() => onChange({ ...filters, status: '' })} aria-label={`tirar filtro ${STATUS_LABEL[filters.status]}`}>
                {STATUS_LABEL[filters.status]} ×
              </button>
            )}
            {filters.genre && (
              <button type="button" className="filter-chip is-on" onClick={() => onChange({ ...filters, genre: '' })} aria-label={`tirar filtro ${filters.genre}`}>
                {filters.genre} ×
              </button>
            )}
            {filters.tags.map((tag) => (
              <button key={tag} type="button" className="filter-chip is-on" onClick={() => toggleTag(tag)} aria-label={`tirar filtro ${tag}`}>
                #{tag} ×
              </button>
            ))}
          </div>
        )
      )}

      {(filters.query || activeCount > 0) && (
        <button type="button" className="filters__clear" onClick={() => onChange({ query: '', genre: '', tags: [], status: '' })}>
          limpar filtros
        </button>
      )}
    </div>
  )
}
