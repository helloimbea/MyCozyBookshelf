import type { Book } from '../types'

/** Livros sem status (cadastrados antes de existir "lendo") contam como lidos. */
export function isReading(book: Pick<Book, 'status'>): boolean {
  return book.status === 'reading'
}

/** Converte o texto do campo de página em número (ou nada, se vazio/inválido). */
export function parsePage(text: string): number | undefined {
  const n = Number(text)
  return text.trim() && Number.isInteger(n) && n > 0 ? n : undefined
}

// perguntas para a reflexão final, quando a pessoa conclui a leitura
export const FINAL_PROMPTS = [
  'o que esse livro te ensinou, do começo ao fim?',
  'o que você leva dessa leitura?',
  'você terminou diferente de como começou? como?',
  'se pudesse guardar só uma coisa desse livro, qual seria?',
]
