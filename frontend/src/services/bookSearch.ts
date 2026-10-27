// Book search to fill in the form automatically (title, author, cover, pages, genre).
// Tries Google Books first (more Brazilian editions) and, if it fails or finds nothing,
// falls back to Open Library. Without an API key Google splits its quota by IP: on networks
// where everyone leaves through the same IP (e.g. a corporate proxy) it runs out quickly,
// and Open Library keeps the search working. For a quota of your own, set
// VITE_GOOGLE_BOOKS_API_KEY in frontend/.env.local.
import type { GenreKey } from '../i18n/genres'

export type BookSuggestion = {
  id: string
  title: string
  author?: string
  year?: string
  pages?: number
  /** the visible name comes from the current language (messages.genres) */
  genre?: GenreKey
  coverUrl?: string
}

const MAX_RESULTS = 6

// API categories (mostly in English) -> genre key; the more specific ones come first
const GENRE_MAP: [RegExp, GenreKey][] = [
  [/self-help|autoajuda|autoayuda/i, 'selfHelp'],
  [/psycholog|psicolog/i, 'psychology'],
  [/philosoph|filosof/i, 'philosophy'],
  [/fantasy|fantasia|fantasía/i, 'fantasy'],
  [/romance/i, 'romance'],
  [/juvenile fiction|young adult/i, 'youngAdult'],
  [/science fiction|ficção científica|ciencia ficción/i, 'sciFi'],
  [/mystery|thriller|suspense/i, 'thriller'],
  [/horror|terror/i, 'horror'],
  [/poetry|poesia|poesía/i, 'poetry'],
  [/comics|graphic novel/i, 'comics'],
  [/biograph/i, 'biography'],
  [/business|economics|finance/i, 'business'],
  [/history|história|historia/i, 'history'],
  [/religion|spiritual|body, mind/i, 'spirituality'],
  [/health|saúde|salud/i, 'health'],
  [/science|ciência|ciencia/i, 'science'],
  [/fiction|ficção|ficción/i, 'fiction'],
]

/** APIs list categories from most to least relevant: the first recognized one wins. */
function genreFrom(categories: string[] = []): GenreKey | undefined {
  for (const category of categories) {
    for (const [pattern, genre] of GENRE_MAP) if (pattern.test(category)) return genre
  }
  return undefined
}

type GoogleVolume = {
  id: string
  volumeInfo: {
    title?: string
    subtitle?: string
    authors?: string[]
    publishedDate?: string
    pageCount?: number
    categories?: string[]
    imageLinks?: { thumbnail?: string; smallThumbnail?: string }
  }
}

async function searchGoogle(query: string, signal: AbortSignal): Promise<BookSuggestion[]> {
  const params = new URLSearchParams({ q: query, maxResults: String(MAX_RESULTS), printType: 'books', country: 'BR' })
  const key = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY as string | undefined
  if (key) params.set('key', key)
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?${params}`, { signal })
  if (!res.ok) throw new Error(`Google Books ${res.status}`)
  const data = (await res.json()) as { items?: GoogleVolume[] }
  return (data.items ?? [])
    .filter((v) => v.volumeInfo.title)
    .map(({ id, volumeInfo: v }) => {
      const thumb = v.imageLinks?.thumbnail ?? v.imageLinks?.smallThumbnail
      return {
        id: `google:${id}`,
        title: v.title!,
        author: v.authors?.join(', '),
        year: v.publishedDate?.slice(0, 4),
        pages: v.pageCount || undefined,
        genre: genreFrom(v.categories),
        // thumbnails come over http and with a "curled page" effect; use https and drop the effect
        coverUrl: thumb?.replace(/^http:/, 'https:').replace('&edge=curl', ''),
      }
    })
}

type OpenLibraryDoc = {
  key: string
  title?: string
  author_name?: string[]
  first_publish_year?: number
  number_of_pages_median?: number
  cover_i?: number
  subject?: string[]
}

async function searchOpenLibrary(query: string, signal: AbortSignal): Promise<BookSuggestion[]> {
  const params = new URLSearchParams({
    q: query,
    limit: String(MAX_RESULTS),
    fields: 'key,title,author_name,first_publish_year,number_of_pages_median,cover_i,subject',
  })
  const res = await fetch(`https://openlibrary.org/search.json?${params}`, { signal })
  if (!res.ok) throw new Error(`Open Library ${res.status}`)
  const data = (await res.json()) as { docs?: OpenLibraryDoc[] }
  return (data.docs ?? [])
    .filter((d) => d.title)
    .map((d) => ({
      id: `openlibrary:${d.key}`,
      title: d.title!,
      author: d.author_name?.join(', '),
      year: d.first_publish_year ? String(d.first_publish_year) : undefined,
      pages: d.number_of_pages_median || undefined,
      genre: genreFrom(d.subject),
      // default=false: a missing cover answers 404 (and the placeholder shows) instead of a blank image
      coverUrl: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-L.jpg?default=false` : undefined,
    }))
}

/** Searches books by title (or title + author). Never throws: no results means []. */
export async function searchBooks(query: string, signal: AbortSignal): Promise<BookSuggestion[]> {
  try {
    const results = await searchGoogle(query, signal)
    if (results.length) return results
  } catch (err) {
    if (signal.aborted) throw err
  }
  try {
    return await searchOpenLibrary(query, signal)
  } catch (err) {
    if (signal.aborted) throw err
    return []
  }
}
