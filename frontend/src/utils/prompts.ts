// Questions that help writing a reflection. The project's idea is that every book has a lesson,
// fiction included, so the questions change with the genre the person typed.
import type { Messages } from '../i18n/messages.en'

// genre words in English, Portuguese and Spanish (without accents).
// "non-fiction" is checked first because it also contains the word "fiction".
const NONFICTION_WORDS = [
  'non-fiction', 'nonfiction', 'nao ficcao', 'no ficcion',
  'self-help', 'autoajuda', 'auto ajuda', 'autoayuda',
  'psycholog', 'psicolog', 'philosoph', 'filosof',
  'personal growth', 'desenvolvimento', 'desarrollo',
  'finance', 'financas', 'finanzas', 'business', 'negocios',
  'biograph', 'biografia', 'history', 'historia', 'science', 'ciencia',
  'spiritual', 'espiritualidad', 'essay', 'ensaio', 'ensayo', 'health', 'saude', 'salud',
]
const FICTION_WORDS = [
  'fiction', 'ficcao', 'ficcion', 'novel', 'novela', 'romance',
  'fantasy', 'fantasia', 'fable', 'fabula', 'tale', 'conto', 'cuento',
  'poetry', 'poesia', 'chronicle', 'cronica', 'thriller', 'suspense', 'suspenso',
  'horror', 'terror', 'mystery', 'misterio', 'adventure', 'aventura',
  'dystopia', 'distopia', 'literature', 'literatura', 'drama', 'comics', 'hq', 'manga', 'young adult', 'juvenil',
]

function normalize(text: string) {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

/** Prompts for a book: its genre's ones (plus the general invite) or, for an unknown genre, the general ones. */
export function promptsFor(t: Messages, genre?: string): string[] {
  const g = normalize(genre ?? '')
  if (g && NONFICTION_WORDS.some((w) => g.includes(w))) return [...t.prompts.nonFiction, t.prompts.learned]
  if (g && FICTION_WORDS.some((w) => g.includes(w))) return [...t.prompts.fiction, t.prompts.learned]
  return t.prompts.general
}
