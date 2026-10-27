import { useState } from 'react'
import { promptsFor } from '../utils/prompts'
import './ReflectionField.css'

type Props = {
  value: string
  onChange: (value: string) => void
  /** gênero do livro, para escolher perguntas que combinem com ele */
  genre?: string
  /** perguntas próprias (ex.: reflexão final); senão, vêm do gênero */
  prompts?: string[]
  /** com onPageChange, aparece o campo opcional de página */
  page?: string
  onPageChange?: (page: string) => void
  className?: string
  autoFocus?: boolean
}

/** Campo de reflexão com pergunta de inspiração, botão "me dá uma ideia" e página opcional. */
export function ReflectionField({ value, onChange, genre, prompts, page = '', onPageChange, className = 'input', autoFocus }: Props) {
  const options = prompts ?? promptsFor(genre)
  // a pergunta é sorteada uma vez; o botão troca por outra diferente
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1000))
  const prompt = options[seed % options.length]

  function anotherIdea() {
    const step = 1 + Math.floor(Math.random() * Math.max(1, options.length - 1))
    setSeed((s) => s + step)
  }

  return (
    <div className="reflection-field">
      <textarea className={className} value={value} onChange={(e) => onChange(e.target.value)} placeholder={prompt} aria-label="reflexão" autoFocus={autoFocus} />
      <div className="reflection-field__row">
        {onPageChange && (
          <label className="reflection-field__page" title="a página onde você parou ou a que te fez pensar nisso">
            <span>página</span>
            <input
              className="input"
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              value={page}
              onChange={(e) => onPageChange(e.target.value)}
              placeholder="opcional"
            />
          </label>
        )}
        <button type="button" className="reflection-field__idea" onClick={anotherIdea}>
          <span aria-hidden="true">✿</span> me dá uma ideia
        </button>
      </div>
    </div>
  )
}
