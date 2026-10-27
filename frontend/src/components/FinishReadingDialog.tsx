import { useEffect, useId, useRef, useState } from 'react'
import chameleon from '../assets/chameleon.png'
import { errorText, useI18n } from '../i18n/context'
import { ReflectionField } from './ReflectionField'
import './FinishReadingDialog.css'

type Props = {
  open: boolean
  bookTitle: string
  /** finishes the reading; the text is empty if the person prefers to write later */
  onConfirm: (finalReflection: string) => Promise<void>
  onClose: () => void
}

/** Window shown when finishing a book, asking for the book's final reflection. */
export function FinishReadingDialog({ open, bookTitle, onConfirm, onClose }: Props) {
  const { t } = useI18n()
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // native <dialog>: showModal takes care of the backdrop, focus and Esc
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  function close() {
    setText('')
    setError('')
    onClose()
  }

  async function confirm() {
    setBusy(true)
    try {
      await onConfirm(text)
      setText('')
      setError('')
    } catch (err) {
      setError(errorText(err, t))
    } finally {
      setBusy(false)
    }
  }

  return (
    <dialog
      ref={ref}
      className="finish-dialog"
      aria-labelledby={titleId}
      onClose={close}
      // a click on the dark backdrop (outside the box) closes it
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="finish-dialog__box">
        <img src={chameleon} alt="" className="finish-dialog__mascot" />
        <h2 id={titleId}>{t.finish.title}</h2>
        <p>
          {t.finish.askBefore}
          <strong>{t.finish.askStrong}</strong>
          {t.finish.askAfter}
          <em>{bookTitle}</em>?
        </p>

        {open && <ReflectionField value={text} onChange={setText} prompts={t.prompts.final} autoFocus />}
        <p className="finish-dialog__hint">{t.finish.hint}</p>
        {error && <p className="form-error">{error}</p>}

        <div className="finish-dialog__actions">
          <button type="button" className="btn btn--ghost" onClick={close}>
            {t.common.cancel}
          </button>
          <button type="button" className="btn btn--primary" onClick={confirm} disabled={busy}>
            {text.trim() ? t.finish.saveAndFinish : t.finish.finishWithout}
          </button>
        </div>
      </div>
    </dialog>
  )
}
