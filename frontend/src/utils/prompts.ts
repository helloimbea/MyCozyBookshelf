// Perguntas que ajudam a escrever uma reflexão. A ideia do projeto é que todo livro
// tem um aprendizado, inclusive os de ficção, então as perguntas mudam com o gênero.

const LEARNED = 'escreva aqui o que você aprendeu.'

const FICTION_PROMPTS = [
  'qual personagem te ensinou alguma coisa?',
  'teve alguma cena que mudou seu jeito de ver algo?',
  'o que você faria no lugar de alguém dessa história?',
  'com qual personagem você mais se identificou? por quê?',
  'o que essa história fala sobre a vida real?',
]

const NONFICTION_PROMPTS = [
  'qual ideia você quer levar pra vida?',
  'o que você vai fazer diferente depois dessa leitura?',
  'com o que você concordou? e do que discordou?',
  'qual parte você queria ter lido antes?',
]

const GENERAL_PROMPTS = [
  LEARNED,
  'que frase ou momento ficou com você?',
  'o que esse livro deixou em você?',
  'se fosse contar esse livro pra um amigo, o que diria que aprendeu?',
]

// "não ficção" é checado antes, porque também contém a palavra "ficção"
const NONFICTION_WORDS = ['nao ficcao', 'autoajuda', 'auto ajuda', 'psicologia', 'filosofia', 'desenvolvimento', 'financas', 'biografia', 'historia', 'ciencia', 'espiritualidade', 'negocios', 'ensaio']
const FICTION_WORDS = ['ficcao', 'romance', 'fantasia', 'fabula', 'conto', 'poesia', 'cronica', 'suspense', 'terror', 'misterio', 'aventura', 'distopia', 'literatura', 'drama', 'hq', 'manga']

function normalize(text: string) {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

/** Perguntas para um livro: as do gênero dele (mais o convite geral) ou, sem gênero conhecido, as gerais. */
export function promptsFor(genre?: string): string[] {
  const g = normalize(genre ?? '')
  if (g && NONFICTION_WORDS.some((w) => g.includes(w))) return [...NONFICTION_PROMPTS, LEARNED]
  if (g && FICTION_WORDS.some((w) => g.includes(w))) return [...FICTION_PROMPTS, LEARNED]
  return GENERAL_PROMPTS
}
