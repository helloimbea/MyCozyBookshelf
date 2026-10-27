import { useState, type ChangeEvent, type FormEvent } from 'react'
import { errorText, useI18n } from '../i18n/context'
import type { BookSuggestion } from '../services/bookSearch'
import type { BookInput, NewReflection, ReadingStatus } from '../types'
import { fileToCoverDataUrl } from '../utils/image'
import { parsePage } from '../utils/reading'
import { BookCover } from './BookCover'
import { ReflectionField } from './ReflectionField'
import { StarRating } from './StarRating'
import { TagInput } from './TagInput'
import { TitleSearch } from './TitleSearch'
import './BookForm.css'

type Props = {
  initial?: BookInput
  /** When adding a book, the form also takes the first reflection. */
  withReflection?: boolean
  /** When adding a book, the title suggests books (Google Books / Open Library) and fills in the rest. */
  withSearch?: boolean
  submitLabel: string
  onSubmit: (input: BookInput, reflection?: NewReflection) => Promise<void>
  onCancel?: () => void
}

const EMPTY: BookInput = { title: '', tags: [], status: 'read' }

export function BookForm({ initial = EMPTY, withReflection = false, withSearch = false, submitLabel, onSubmit, onCancel }: Props) {
  const { t } = useI18n()
  const [values, setValues] = useState<BookInput>(initial)
  const [pagesText, setPagesText] = useState(initial.pages ? String(initial.pages) : '')
  const [reflection, setReflection] = useState('')
  const [reflectionPage, setReflectionPage] = useState('')
  const [coverMode, setCoverMode] = useState<'upload' | 'link'>(initial.coverUrl?.startsWith('http') ? 'link' : 'upload')
  const [showMore, setShowMore] = useState(initial !== EMPTY)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const status: ReadingStatus = values.status ?? 'read'

  function set<K extends keyof BookInput>(key: K, value: BookInput[K]) {
    setValues((v) => ({ ...v, [key]: value }))
  }

  /** Fills the form with the book picked in the search (only what the search returned). */
  function fillFromSuggestion(book: BookSuggestion) {
    setValues((v) => ({
      ...v,
      title: book.title,
      author: book.author ?? v.author,
      genre: book.genre ? t.genres[book.genre] : v.genre,
      coverUrl: book.coverUrl ?? v.coverUrl,
    }))
    if (book.pages) setPagesText(String(book.pages))
    if (book.coverUrl) setCoverMode('link')
    setShowMore(true) // opens the details so the person sees what was filled in
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      set('coverUrl', await fileToCoverDataUrl(file))
    } catch {
      setError(t.form.imageError)
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!values.title.trim()) {
      setError(t.errors.needTitle)
      return
    }
    const pages = pagesText ? Number(pagesText) : undefined
    if (pages !== undefined && (!Number.isInteger(pages) || pages <= 0)) {
      setError(t.form.pagesError)
      return
    }
    setError('')
    setBusy(true)
    try {
      await onSubmit({ ...values, pages }, withReflection ? { text: reflection, page: parsePage(reflectionPage) } : undefined)
    } catch (err) {
      setError(errorText(err, t))
      setBusy(false)
    }
  }

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <div className="book-form__cover">
        <BookCover title={values.title} author={values.author} coverUrl={values.coverUrl} />

        <div className="segmented" role="tablist" aria-label={t.form.coverHow}>
          <button type="button" role="tab" aria-selected={coverMode === 'upload'} onClick={() => setCoverMode('upload')}>
            {t.form.upload}
          </button>
          <button type="button" role="tab" aria-selected={coverMode === 'link'} onClick={() => setCoverMode('link')}>
            {t.form.link}
          </button>
        </div>

        {coverMode === 'upload' ? (
          <label className="btn btn--soft btn--small book-form__file">
            {t.form.chooseImage}
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
            {t.form.removeCover}
          </button>
        ) : (
          <p className="book-form__hint">{t.form.noCover}</p>
        )}
      </div>

      <div className="book-form__fields">
        {withSearch ? (
          <div className="field">
            <span className="field__label">{t.form.title}</span>
            <TitleSearch value={values.title} onChange={(title) => set('title', title)} onPick={fillFromSuggestion} autoFocus={!initial.title} />
            <span className="field__hint">{t.form.searchHint}</span>
          </div>
        ) : (
          <label className="field">
            <span className="field__label">{t.form.title}</span>
            <input
              className="input"
              value={values.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder={t.form.titlePlaceholder}
              required
              autoFocus={!initial.title}
            />
          </label>
        )}

        <div className="field">
          <span className="field__label">{t.form.statusQuestion}</span>
          <div className="segmented book-form__status" role="radiogroup" aria-label={t.form.statusQuestion}>
            {(['reading', 'read'] as ReadingStatus[]).map((s) => (
              <button key={s} type="button" role="radio" aria-checked={status === s} onClick={() => set('status', s)}>
                {t.status[s]}
              </button>
            ))}
          </div>
          {status === 'reading' && <span className="field__hint">{t.form.statusReadingHint}</span>}
        </div>

        <button type="button" className="book-form__toggle" aria-expanded={showMore} onClick={() => setShowMore((s) => !s)}>
          <span aria-hidden="true">{showMore ? '−' : '+'}</span>
          {showMore ? t.form.less : t.form.more}
        </button>

        {showMore && (
          <div className="book-form__more">
            <label className="field">
              <span className="field__label">{t.form.author}</span>
              <input className="input" value={values.author ?? ''} onChange={(e) => set('author', e.target.value)} placeholder={t.form.authorPlaceholder} />
            </label>
            <label className="field">
              <span className="field__label">{t.form.genre}</span>
              <input className="input" value={values.genre ?? ''} onChange={(e) => set('genre', e.target.value)} placeholder={t.form.genrePlaceholder} />
            </label>
            <label className="field">
              <span className="field__label">{t.form.pages}</span>
              <input className="input" type="number" min={1} step={1} inputMode="numeric" value={pagesText} onChange={(e) => setPagesText(e.target.value)} placeholder={t.form.pagesPlaceholder} />
            </label>
            <div className="field">
              <span className="field__label">{t.form.stars}</span>
              <StarRating value={values.stars} onChange={(stars) => set('stars', stars)} />
            </div>
            <label className="field book-form__wide">
              <span className="field__label">{t.form.summary}</span>
              <textarea className="input" value={values.summary ?? ''} onChange={(e) => set('summary', e.target.value)} placeholder={t.form.summaryPlaceholder} />
            </label>
            <div className="field book-form__wide">
              <span className="field__label">{t.form.tags}</span>
              <TagInput value={values.tags} onChange={(tags) => set('tags', tags)} />
            </div>
            {withReflection && (
              <div className="field book-form__wide">
                <span className="field__label">{status === 'reading' ? t.form.reflectionSoFar : t.form.reflection}</span>
                <span className="field__hint">{t.form.reflectionHint}</span>
                <ReflectionField value={reflection} onChange={setReflection} genre={values.genre} page={reflectionPage} onPageChange={setReflectionPage} />
              </div>
            )}
          </div>
        )}

        {error && <p className="form-error">{error}</p>}

        <div className="book-form__actions">
          {onCancel && (
            <button type="button" className="btn btn--ghost" onClick={onCancel}>
              {t.common.cancel}
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
