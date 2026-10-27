// Genres known by the app. Book search, demo data and reflection prompts use these keys;
// the visible name comes from the current language (messages.genres).
export const GENRE_KEYS = [
  'selfHelp',
  'personalDevelopment',
  'psychology',
  'philosophy',
  'spirituality',
  'finance',
  'business',
  'biography',
  'history',
  'science',
  'health',
  'nonFiction',
  'novel',
  'romance',
  'fantasy',
  'youngAdult',
  'sciFi',
  'thriller',
  'horror',
  'poetry',
  'chronicles',
  'fable',
  'comics',
  'fiction',
] as const

export type GenreKey = (typeof GENRE_KEYS)[number]

/** Genres that count as fiction when picking reflection prompts. */
export const FICTION_GENRES: GenreKey[] = ['novel', 'romance', 'fantasy', 'youngAdult', 'sciFi', 'thriller', 'horror', 'poetry', 'chronicles', 'fable', 'comics', 'fiction']
