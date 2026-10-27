import { useEffect, useId, useRef, useState } from 'react'
import camaleao from '../assets/camaleao.png'
import { FINAL_PROMPTS } from '../utils/reading'
import { ReflectionField } from './ReflectionField'
import './FinishReadingDialog.css'

type Props = {
  open: boolean
  bookTitle: string
  /** conclui a leitura; o texto vem vazio se a pessoa preferir escrever depois */
  onConfirm: (finalReflection: string) => Promise<void>
  onClose: () => void
}

/** Janela que aparece ao concluir uma leitura, pedindo a reflexão final do livro. */
export function FinishReadingDialog({ open, bookTitle, onConfirm, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // <dialog> nativo: showModal cuida do fundo escuro, do foco e do Esc
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
      setError(err instanceof Error ? err.message : 'algo deu errado, tente de novo.')
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
      // clique no fundo escuro (fora da caixa) fecha
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="finish-dialog__box">
        <img src={camaleao} alt="" className="finish-dialog__mascot" />
        <h2 id={titleId}>terminou! que bom ✿</h2>
        <p>
          antes de voltar pra estante: qual é a sua <strong>reflexão final</strong> sobre <em>{bookTitle}</em>?
        </p>

        {open && <ReflectionField value={text} onChange={setText} prompts={FINAL_PROMPTS} autoFocus />}
        <p className="finish-dialog__hint">se preferir, dá pra escrever depois.</p>
        {error && <p className="form-error">{error}</p>}

        <div className="finish-dialog__actions">
          <button type="button" className="btn btn--ghost" onClick={close}>
            cancelar
          </button>
          <button type="button" className="btn btn--primary" onClick={confirm} disabled={busy}>
            {text.trim() ? 'guardar e concluir' : 'concluir sem reflexão'}
          </button>
        </div>
      </div>
    </dialog>
  )
}
