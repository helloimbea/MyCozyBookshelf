import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { BookInput } from '../types'
import { fileToCoverDataUrl } from '../utils/image'
import { BookCover } from './BookCover'
import { StarRating } from './StarRating'
import { TagInput } from './TagInput'
import './BookForm.css'

type Props = {
  initial?: BookInput
  /** No cadastro o formulário também aceita a primeira reflexão. */
  withReflection?: boolean
  submitLabel: string
  onSubmit: (input: BookInput, reflection?: string) => Promise<void>
  onCancel?: () => void
}

const EMPTY: BookInput = { title: '', tags: [] }

export function BookForm({ initial = EMPTY, withReflection = false, submitLabel, onSubmit, onCancel }: Props) {
  const [values, setValues] = useState<BookInput>(initial)
  const [pagesText, setPagesText] = useState(initial.pages ? String(initial.pages) : '')
  const [reflection, setReflection] = useState('')
  const [coverMode, setCoverMode] = useState<'upload' | 'link'>(initial.coverUrl?.startsWith('http') ? 'link' : 'upload')
  const [showMore, setShowMore] = useState(initial !== EMPTY)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function set<K extends keyof BookInput>(key: K, value: BookInput[K]) {
    setValues((v) => ({ ...v, [key]: value }))
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      set('coverUrl', await fileToCoverDataUrl(file))
    } catch {
      setError('não consegui abrir essa imagem.')
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!values.title.trim()) {
      setError('o livro precisa de um título.')
      return
    }
    const pages = pagesText ? Number(pagesText) : undefined
    if (pages !== undefined && (!Number.isInteger(pages) || pages <= 0)) {
      setError('o número de páginas precisa ser um número inteiro maior que zero.')
      return
    }
    setError('')
    setBusy(true)
    try {
      await onSubmit({ ...values, pages }, withReflection ? reflection : undefined)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'algo deu errado, tente de novo.')
      setBusy(false)
    }
  }

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <div className="book-form__cover">
        <BookCover title={values.title} author={values.author} coverUrl={values.coverUrl} />

        <div className="segmented" role="tablist" aria-label="como adicionar a capa">
          <button type="button" role="tab" aria-selected={coverMode === 'upload'} onClick={() => setCoverMode('upload')}>
            enviar
          </button>
          <button type="button" role="tab" aria-selected={coverMode === 'link'} onClick={() => setCoverMode('link')}>
            link
          </button>
        </div>

        {coverMode === 'upload' ? (
          <label className="btn btn--soft btn--small book-form__file">
            escolher imagem
            <input type="file" accept="image/*" onChange={handleFile} />
          </label>
        ) : (
          <input
            className="input"
            type="url"
            placeholder="https://..."
            value={values.coverUrl?.startsWith('data:') ? '' : (values.coverUrl ?? '')}
            onChange={(e) => set('coverUrl', e.target.value)}
          />
        )}

        {values.coverUrl ? (
          <button type="button" className="btn btn--ghost btn--small" onClick={() => set('coverUrl', undefined)}>
            tirar capa
          </button>
        ) : (
          <p className="book-form__hint">sem capa? a gente faz uma fofinha pra você.</p>
        )}
      </div>

      <div className="book-form__fields">
        <label className="field">
          <span className="field__label">título</span>
          <input
            className="input"
            value={values.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="qual livro você leu?"
            required
            autoFocus={!initial.title}
          />
        </label>

        <button type="button" className="book-form__toggle" aria-expanded={showMore} onClick={() => setShowMore((s) => !s)}>
          <span aria-hidden="true">{showMore ? '−' : '+'}</span>
          {showMore ? 'menos detalhes' : 'quer contar mais? (opcional)'}
        </button>

        {showMore && (
          <div className="book-form__more">
            <label className="field">
              <span className="field__label">autor</span>
              <input className="input" value={values.author ?? ''} onChange={(e) => set('author', e.target.value)} placeholder="quem escreveu" />
            </label>
            <label className="field">
              <span className="field__label">gênero</span>
              <input className="input" value={values.genre ?? ''} onChange={(e) => set('genre', e.target.value)} placeholder="romance, fantasia..." />
            </label>
            <label className="field">
              <span className="field__label">número de páginas</span>
              <input className="input" type="number" min={1} step={1} inputMode="numeric" value={pagesText} onChange={(e) => setPagesText(e.target.value)} placeholder="ex.: 320" />
            </label>
            <div className="field">
              <span className="field__label">estrelas</span>
              <StarRating value={values.stars} onChange={(stars) => set('stars', stars)} />
            </div>
            <label className="field book-form__wide">
              <span className="field__label">resumo</span>
              <textarea className="input" value={values.summary ?? ''} onChange={(e) => set('summary', e.target.value)} placeholder="sobre o que é o livro, com as suas palavras" />
            </label>
            <div className="field book-form__wide">
              <span className="field__label">tags</span>
              <TagInput value={values.tags} onChange={(tags) => set('tags', tags)} />
            </div>
            {withReflection && (
              <label className="field book-form__wide">
                <span className="field__label">reflexão</span>
                <textarea className="input" value={reflection} onChange={(e) => setReflection(e.target.value)} placeholder="o que esse livro deixou em você?" />
              </label>
            )}
          </div>
        )}

        {error && <p className="form-error">{error}</p>}

        <div className="book-form__actions">
          {onCancel && (
            <button type="button" className="btn btn--ghost" onClick={onCancel}>
              cancelar
            </button>
          )}
          <button type="submit" className="btn btn--primary" disabled={busy}>
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  )
}
