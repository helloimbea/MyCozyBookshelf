// Busca de livros para preencher o cadastro sozinho (título, autor, capa, páginas, gênero).
// Tenta primeiro o Google Books (mais edições brasileiras) e, se ele falhar ou não achar nada,
// usa o Open Library. Sem chave, o Google divide a cota por IP: em redes que saem todas pelo
// mesmo IP (ex.: proxy de empresa) ela acaba rápido, e aí o Open Library segura a busca.
// Para ter cota própria, defina VITE_GOOGLE_BOOKS_API_KEY no frontend/.env.local.

export type BookSuggestion = {
  id: string
  title: string
  author?: string
  year?: string
  pages?: number
  genre?: string
  coverUrl?: string
}

const MAX_RESULTS = 6

// categorias das APIs (em inglês) -> gênero em português; as mais específicas vêm antes
const GENRE_MAP: [RegExp, string][] = [
  [/self-help|autoajuda/i, 'autoajuda'],
  [/psycholog|psicolog/i, 'psicologia'],
  [/philosoph|filosof/i, 'filosofia'],
  [/fantasy|fantasia/i, 'fantasia'],
  [/romance/i, 'romance'],
  [/juvenile fiction|young adult/i, 'ficção juvenil'],
  [/science fiction|ficção científica/i, 'ficção científica'],
  [/mystery|thriller|suspense/i, 'suspense'],
  [/horror|terror/i, 'terror'],
  [/poetry|poesia/i, 'poesia'],
  [/comics|graphic novel/i, 'hq'],
  [/biograph/i, 'biografia'],
  [/business|economics|finance/i, 'negócios'],
  [/history|história/i, 'história'],
  [/religion|spiritual|body, mind/i, 'espiritualidade'],
  [/health|saúde/i, 'saúde'],
  [/science|ciência/i, 'ciência'],
  [/fiction|ficção/i, 'ficção'],
]

/** As APIs listam as categorias da mais para a menos relevante: vale a primeira que for reconhecida. */
function genreFrom(categories: string[] = []): string | undefined {
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
        // as miniaturas vêm em http e com a "orelha" dobrada; https e sem o efeito
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
      // default=false: sem capa, responde 404 (e entra a capa placeholder) em vez de uma imagem vazia
      coverUrl: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-L.jpg?default=false` : undefined,
    }))
}

/** Procura livros pelo título (ou título + autor). Nunca lança erro: sem resultado, devolve []. */
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
