import { useI18n } from '../i18n/context'
import './StarRating.css'

type Props = {
  value?: number
  /** Without onChange the stars are read-only. Clicking the current star clears the rating. */
  onChange?: (value: number | undefined) => void
}

export function StarRating({ value = 0, onChange }: Props) {
  const { t } = useI18n()

  if (!onChange) {
    return (
      <span className="stars" role="img" aria-label={t.stars.value(value)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={n <= value ? 'stars__star is-on' : 'stars__star'} aria-hidden="true">
            ★
          </span>
        ))}
      </span>
    )
  }

  return (
    <span className="stars stars--editable" role="radiogroup" aria-label={t.stars.label}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={n === value}
          aria-label={t.stars.option(n)}
          className={n <= value ? 'stars__star is-on' : 'stars__star'}
          onClick={() => onChange(n === value ? undefined : n)}
        >
          ★
        </button>
      ))}
    </span>
  )
}
