import './StarRating.css'

type Props = {
  value?: number
  /** Sem onChange as estrelas são só para leitura. Clicar na estrela atual limpa a nota. */
  onChange?: (value: number | undefined) => void
}

export function StarRating({ value = 0, onChange }: Props) {
  if (!onChange) {
    return (
      <span className="stars" aria-label={`${value} de 5 estrelas`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={n <= value ? 'stars__star is-on' : 'stars__star'} aria-hidden="true">
            ★
          </span>
        ))}
      </span>
    )
  }

  return (
    <span className="stars stars--editable" role="radiogroup" aria-label="estrelas">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={n === value}
          aria-label={`${n} ${n === 1 ? 'estrela' : 'estrelas'}`}
          className={n <= value ? 'stars__star is-on' : 'stars__star'}
          onClick={() => onChange(n === value ? undefined : n)}
        >
          ★
        </button>
      ))}
    </span>
  )
}
