export type User = {
  id: string
  name: string
  email: string
}

export type Reflection = {
  id: string
  text: string
  createdAt: string
}

export type Book = {
  id: string
  userId: string
  title: string
  coverUrl?: string
  author?: string
  summary?: string
  pages?: number
  genre?: string
  tags: string[]
  stars?: number
  reflections: Reflection[]
  createdAt: string
}

/** Campos que o usuário preenche no formulário (só o título é obrigatório). */
export type BookInput = {
  title: string
  coverUrl?: string
  author?: string
  summary?: string
  pages?: number
  genre?: string
  tags: string[]
  stars?: number
}

/** O que fica fixado na tela inicial: uma reflexão de um livro ou um texto livre. */
export type PinnedReflection =
  | { kind: 'reflection'; bookId: string; reflectionId: string }
  | { kind: 'custom'; text: string }

export type PinnedView = {
  pinned: PinnedReflection
  text: string
  book?: Book
}
