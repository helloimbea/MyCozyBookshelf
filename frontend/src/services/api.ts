// API mocked in the browser (localStorage) while the Spring Boot backend has no endpoints yet.
// The functions are already async and shaped like the real API: once the backend exists,
// only their bodies change to fetch('/api/...') calls, without touching the screens.
import { MESSAGES, type Lang } from '../i18n/context'
import type { Book, BookInput, NewReflection, PinnedReflection, PinnedView, Reflection, User } from '../types'
import { DEMO_BOOKS } from './demoData'
import { AppError } from './errors'

// The plain-text password only exists in this mock; the backend will store just a hash.
type StoredUser = User & { password: string }

type Db = {
  users: StoredUser[]
  books: Book[]
  pinned: Record<string, PinnedReflection>
}

const DB_KEY = 'mcb:db'
const SESSION_KEY = 'mcb:session'

function load(): Db {
  try {
    const raw = localStorage.getItem(DB_KEY)
    if (raw) return JSON.parse(raw) as Db
  } catch {
    // corrupted data: start from scratch
  }
  return { users: [], books: [], pinned: {} }
}

function save(db: Db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db))
  } catch {
    throw new AppError('storageFull')
  }
}

function newId() {
  return crypto.randomUUID()
}

function toUser({ id, name, email, demo }: StoredUser): User {
  return demo ? { id, name, email, demo } : { id, name, email }
}

function requireUserId(): string {
  const id = localStorage.getItem(SESSION_KEY)
  if (!id) throw new AppError('notLoggedIn')
  return id
}

function findOwnBook(db: Db, bookId: string): Book {
  const userId = requireUserId()
  const book = db.books.find((b) => b.id === bookId && b.userId === userId)
  if (!book) throw new AppError('bookNotFound')
  return book
}

function cleanInput(input: BookInput): BookInput {
  const text = (v?: string) => v?.trim() || undefined
  return {
    title: input.title.trim(),
    coverUrl: text(input.coverUrl),
    author: text(input.author),
    summary: text(input.summary),
    genre: text(input.genre),
    pages: input.pages && input.pages > 0 ? Math.floor(input.pages) : undefined,
    stars: input.stars && input.stars >= 1 && input.stars <= 5 ? input.stars : undefined,
    tags: [...new Set(input.tags.map((t) => t.trim().toLowerCase()).filter(Boolean))],
    status: input.status === 'reading' ? 'reading' : 'read',
  }
}

function makeReflection(input: NewReflection, final = false): Reflection {
  const text = input.text.trim()
  if (!text) throw new AppError('emptyReflection')
  const page = input.page && input.page > 0 ? Math.floor(input.page) : undefined
  return { id: newId(), text, createdAt: new Date().toISOString(), ...(page && { page }), ...(final && { final }) }
}

// ---------- auth ----------

export function getSessionUser(): User | null {
  const id = localStorage.getItem(SESSION_KEY)
  const user = id ? load().users.find((u) => u.id === id) : undefined
  return user ? toUser(user) : null
}

export async function register(name: string, email: string, password: string): Promise<User> {
  const db = load()
  const normalized = email.trim().toLowerCase()
  if (!name.trim()) throw new AppError('needName')
  if (password.length < 8) throw new AppError('shortPassword')
  if (db.users.some((u) => u.email === normalized)) throw new AppError('emailTaken')
  const user: StoredUser = { id: newId(), name: name.trim(), email: normalized, password }
  db.users.push(user)
  save(db)
  localStorage.setItem(SESSION_KEY, user.id)
  return toUser(user)
}

export async function login(email: string, password: string): Promise<User> {
  const normalized = email.trim().toLowerCase()
  const user = load().users.find((u) => u.email === normalized && u.password === password)
  if (!user) throw new AppError('badCredentials')
  localStorage.setItem(SESSION_KEY, user.id)
  return toUser(user)
}

const DEMO_EMAIL = 'demo@mycozybookshelf.app'
const DAY = 24 * 60 * 60 * 1000

/** Opens the demo shelf, rebuilt from scratch every time, in the given language. */
export async function startDemo(lang: Lang): Promise<User> {
  const t = MESSAGES[lang]
  const db = load()
  let user = db.users.find((u) => u.email === DEMO_EMAIL)
  if (!user) {
    // no password: this account can only be opened through the demo button
    user = { id: newId(), name: t.demo.visitorName, email: DEMO_EMAIL, password: '', demo: true }
    db.users.push(user)
  }
  user.name = t.demo.visitorName
  const userId = user.id
  db.books = db.books.filter((b) => b.userId !== userId)
  delete db.pinned[userId]

  // read books: dates spread over the last year, like a real shelf;
  // books being read: started in the last weeks, so they sit together at the end of the shelf
  const readingCount = DEMO_BOOKS.filter((d) => d.status === 'reading').length
  const start = Date.now() - (DEMO_BOOKS.length * 12 + readingCount * 7 + 14) * DAY
  let readingIndex = 0
  DEMO_BOOKS.forEach((demo, i) => {
    const addedAt = demo.status === 'reading' ? Date.now() - (readingCount - readingIndex++) * 7 * DAY : start + i * 12 * DAY
    const book: Book = {
      id: newId(),
      userId,
      title: demo.title,
      author: demo.author,
      coverUrl: demo.cover ? `/demo/${demo.cover}` : undefined,
      genre: t.genres[demo.genre],
      tags: demo.tags[lang],
      stars: demo.stars,
      summary: demo.summary?.[lang],
      reflections: demo.reflections.map((r, j) => ({
        id: newId(),
        text: r.text[lang],
        createdAt: new Date(addedAt + (j + 1) * 2 * DAY).toISOString(),
        ...(r.page && { page: r.page }),
        ...(r.final && { final: true }),
      })),
      createdAt: new Date(addedAt).toISOString(),
      status: demo.status ?? 'read',
      finishedAt: demo.status === 'reading' ? undefined : new Date(addedAt + (demo.reflections.length + 1) * 2 * DAY).toISOString(),
    }
    db.books.push(book)
    if (demo.pinned && book.reflections[0]) {
      db.pinned[userId] = { kind: 'reflection', bookId: book.id, reflectionId: book.reflections[0].id }
    }
  })

  save(db)
  localStorage.setItem(SESSION_KEY, userId)
  return toUser(user)
}

export async function logout(): Promise<void> {
  localStorage.removeItem(SESSION_KEY)
}

// ---------- books ----------

export async function listBooks(): Promise<Book[]> {
  const userId = requireUserId()
  return load()
    .books.filter((b) => b.userId === userId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

export async function getBook(id: string): Promise<Book> {
  return findOwnBook(load(), id)
}

export async function createBook(input: BookInput, reflection?: NewReflection): Promise<Book> {
  const data = cleanInput(input)
  if (!data.title) throw new AppError('needTitle')
  const db = load()
  const now = new Date().toISOString()
  const book: Book = {
    ...data,
    id: newId(),
    userId: requireUserId(),
    reflections: reflection?.text.trim() ? [makeReflection(reflection)] : [],
    createdAt: now,
    finishedAt: data.status === 'read' ? now : undefined,
  }
  db.books.push(book)
  save(db)
  return book
}

export async function updateBook(id: string, input: BookInput): Promise<Book> {
  const data = cleanInput(input)
  if (!data.title) throw new AppError('needTitle')
  const db = load()
  const book = findOwnBook(db, id)
  const wasReading = book.status === 'reading'
  Object.assign(book, { coverUrl: undefined, author: undefined, summary: undefined, pages: undefined, genre: undefined, stars: undefined }, data)
  // the finish date follows the status chosen when editing
  if (data.status === 'reading') book.finishedAt = undefined
  else if (wasReading) book.finishedAt = new Date().toISOString()
  save(db)
  return book
}

export async function deleteBook(id: string): Promise<void> {
  const db = load()
  const book = findOwnBook(db, id)
  db.books = db.books.filter((b) => b.id !== book.id)
  const pinned = db.pinned[book.userId]
  if (pinned?.kind === 'reflection' && pinned.bookId === book.id) delete db.pinned[book.userId]
  save(db)
}

// ---------- reflections ----------

export async function addReflection(bookId: string, input: NewReflection): Promise<Reflection> {
  const reflection = makeReflection(input)
  const db = load()
  const book = findOwnBook(db, bookId)
  book.reflections.push(reflection)
  save(db)
  return reflection
}

/** Marks the reading as finished; the final reflection is optional. */
export async function finishReading(bookId: string, finalReflection?: NewReflection): Promise<Book> {
  const db = load()
  const book = findOwnBook(db, bookId)
  if (finalReflection?.text.trim()) book.reflections.push(makeReflection(finalReflection, true))
  book.status = 'read'
  book.finishedAt = new Date().toISOString()
  save(db)
  return book
}

export async function deleteReflection(bookId: string, reflectionId: string): Promise<void> {
  const db = load()
  const book = findOwnBook(db, bookId)
  book.reflections = book.reflections.filter((r) => r.id !== reflectionId)
  const pinned = db.pinned[book.userId]
  if (pinned?.kind === 'reflection' && pinned.reflectionId === reflectionId) delete db.pinned[book.userId]
  save(db)
}

// ---------- reflection pinned to the home page ----------

export async function getPinned(): Promise<PinnedView | null> {
  const userId = requireUserId()
  const db = load()
  const pinned = db.pinned[userId]
  if (!pinned) return null
  if (pinned.kind === 'custom') return { pinned, text: pinned.text }
  const book = db.books.find((b) => b.id === pinned.bookId && b.userId === userId)
  const reflection = book?.reflections.find((r) => r.id === pinned.reflectionId)
  return book && reflection ? { pinned, text: reflection.text, book } : null
}

export async function setPinned(pinned: PinnedReflection | null): Promise<void> {
  const userId = requireUserId()
  const db = load()
  if (pinned) db.pinned[userId] = pinned
  else delete db.pinned[userId]
  save(db)
}
