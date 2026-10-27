import type { Book } from '../types'

/** Books without a status (added before "reading" existed) count as read. */
export function isReading(book: Pick<Book, 'status'>): boolean {
  return book.status === 'reading'
}

/** Turns the page field text into a number (or nothing, if empty or invalid). */
export function parsePage(text: string): number | undefined {
  const n = Number(text)
  return text.trim() && Number.isInteger(n) && n > 0 ? n : undefined
}
