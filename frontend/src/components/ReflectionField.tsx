import { useState } from 'react'
import { useI18n } from '../i18n/context'
import { promptsFor } from '../utils/prompts'
import './ReflectionField.css'

type Props = {
  value: string
  onChange: (value: string) => void
  /** the book's genre, to pick questions that match it */
  genre?: string
  /** custom questions (e.g. final reflection); otherwise they come from the genre */
  prompts?: string[]
  /** with onPageChange, the optional page field shows up */
  page?: string
  onPageChange?: (page: string) => void
  className?: string
  autoFocus?: boolean
}

/** Reflection field with an inspiring question, a "give me an idea" button and an optional page. */
export function ReflectionField({ value, onChange, genre, prompts, page = '', onPageChange, className = 'input', autoFocus }: Props) {
  const { t } = useI18n()
  const options = prompts ?? promptsFor(t, genre)
  // the question is drawn once; the button swaps it for a different one
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1000))
  const prompt = options[seed % options.length]

  function anotherIdea() {
    const step = 1 + Math.floor(Math.random() * Math.max(1, options.length - 1))
    setSeed((s) => s + step)
  }

  return (
    <div className="reflection-field">
      <textarea className={className} value={value} onChange={(e) => onChange(e.target.value)} placeholder={prompt} aria-label={t.reflectionField.label} autoFocus={autoFocus} />
      <div className="reflection-field__row">
        {onPageChange && (
          <label className="reflection-field__page" title={t.reflectionField.pageTip}>
            <span>{t.reflectionField.page}</span>
            <input
              className="input"
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              value={page}
              onChange={(e) => onPageChange(e.target.value)}
              placeholder={t.reflectionField.pagePlaceholder}
            />
          </label>
        )}
        <button type="button" className="reflection-field__idea" onClick={anotherIdea}>
          <span aria-hidden="true">✿</span> {t.reflectionField.idea}
        </button>
      </div>
    </div>
  )
}
