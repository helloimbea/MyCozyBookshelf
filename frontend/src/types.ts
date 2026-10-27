export type User = {
  id: string
  name: string
  email: string
  /** account of the demo shelf */
  demo?: boolean
}

export type Reflection = {
  id: string
  text: string
  createdAt: string
  /** page where the person stopped, or the one that made them think about this */
  page?: number
  /** reflection written when finishing the book */
  final?: boolean
}

/** What the person writes when saving a reflection. */
export type NewReflection = {
  text: string
  page?: number
}

/** "reading" or "read". Older books without a status count as read. */
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
  /** when the reading was marked as finished */
  finishedAt?: string
  reflections: Reflection[]
  createdAt: string
}

/** Fields the user fills in the form (only the title is required). */
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

/** What is pinned to the home page: a reflection from a book or a free text. */
export type PinnedReflection =
  | { kind: 'reflection'; bookId: string; reflectionId: string }
  | { kind: 'custom'; text: string }

export type PinnedView = {
  pinned: PinnedReflection
  text: string
  book?: Book
}
