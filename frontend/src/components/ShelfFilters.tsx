import './ShelfFilters.css'

export type Filters = {
  query: string
  genre: string
  tags: string[]
}

type Props = {
  filters: Filters
  genres: string[]
  tags: string[]
  onChange: (filters: Filters) => void
}

export function ShelfFilters({ filters, genres, tags, onChange }: Props) {
  const active = filters.query || filters.genre || filters.tags.length

  function toggleTag(tag: string) {
    const next = filters.tags.includes(tag) ? filters.tags.filter((t) => t !== tag) : [...filters.tags, tag]
    onChange({ ...filters, tags: next })
  }

  return (
    <div className="filters">
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

      {active ? (
        <button type="button" className="filters__clear" onClick={() => onChange({ query: '', genre: '', tags: [] })}>
          limpar filtros
        </button>
      ) : null}
    </div>
  )
}
