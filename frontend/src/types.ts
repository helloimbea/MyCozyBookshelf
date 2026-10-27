export type User = {
  id: string
  name: string
  email: string
  /** conta da estante de demonstração */
  demo?: boolean
}

export type Reflection = {
  id: string
  text: string
  createdAt: string
  /** página onde a pessoa parou ou que fez ela pensar nisso */
  page?: number
  /** reflexão escrita ao terminar o livro */
  final?: boolean
}

/** O que a pessoa escreve ao guardar uma reflexão. */
export type NewReflection = {
  text: string
  page?: number
}

/** "lendo" ou "lido". Livros antigos, sem status, contam como lidos. */
export type ReadingStatus = 'reading' | 'read'

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
  status?: ReadingStatus
  /** quando a leitura foi marcada como concluída */
  finishedAt?: string
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
  status?: ReadingStatus
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
