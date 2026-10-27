import { useState, type KeyboardEvent } from 'react'
import { useI18n } from '../i18n/context'

type Props = {
  value: string[]
  onChange: (tags: string[]) => void
}

export function TagInput({ value, onChange }: Props) {
  const { t } = useI18n()
  const [draft, setDraft] = useState('')

  function commit() {
    const tag = draft.trim().replace(/,$/, '').toLowerCase()
    if (tag && !value.includes(tag)) onChange([...value, tag])
    setDraft('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      commit()
    } else if (e.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div className="tag-input">
      {value.map((tag) => (
        <span key={tag} className="chip">
          {tag}
          <button type="button" className="chip__remove" aria-label={t.form.removeTag(tag)} onClick={() => onChange(value.filter((x) => x !== tag))}>
            ×
          </button>
        </span>
      ))}
      <input
        className="tag-input__field"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder={value.length ? '' : t.form.tagsPlaceholder}
        aria-label={t.form.tags}
      />
    </div>
  )
}
