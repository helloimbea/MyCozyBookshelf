import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import type { Book, Reflection } from '../types'
import { BookCover } from './BookCover'
import './ReflectionCarousel.css'

const INTERVAL_MS = 8000
const MAX_DOTS = 8

export type CarouselItem = { book: Book; reflection: Reflection }

/** "Lembranças da estante": reflexões que vão passando sozinhas, devagar. */
export function ReflectionCarousel({ items }: { items: CarouselItem[] }) {
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [reduceMotion] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const count = items.length
  const current = count ? index % count : 0
  const paused = hovered || focused || reduceMotion

  // reinicia a contagem a cada troca, inclusive quando a pessoa navega na mão
  useEffect(() => {
    if (paused || count < 2) return
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), INTERVAL_MS)
    return () => clearTimeout(timer)
  }, [paused, count, current])

  if (count < 2) return null

  const { book, reflection } = items[current]
  const go = (i: number) => setIndex((i + count) % count)

  return (
    <section
      className="memories"
      aria-roledescription="carrossel"
      aria-label="lembranças da estante"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
    >
      <h2 className="memories__title">lembranças da estante</h2>

      <div className="memories__card">
        <button type="button" className="memories__arrow memories__arrow--prev" aria-label="reflexão anterior" onClick={() => go(current - 1)}>
          ‹
        </button>

        {/* a key faz o slide ser recriado e animar o fade a cada troca */}
        <Link
          key={reflection.id}
          to={`/livro/${book.id}`}
          className="memories__slide"
          aria-roledescription="slide"
          aria-label={`${current + 1} de ${count}`}
          aria-live={paused ? 'polite' : 'off'}
        >
          <blockquote className="memories__text">{reflection.text}</blockquote>
          <span className="memories__book">
            <BookCover title={book.title} author={book.author} coverUrl={book.coverUrl} className="memories__cover" />
            <span>
              <strong>{book.title}</strong>
              {(book.author || reflection.page) && <span>{[book.author, reflection.page && `p. ${reflection.page}`].filter(Boolean).join(' · ')}</span>}
            </span>
          </span>
        </Link>

        <button type="button" className="memories__arrow memories__arrow--next" aria-label="próxima reflexão" onClick={() => go(current + 1)}>
          ›
        </button>
      </div>

      {count <= MAX_DOTS ? (
        <div className="memories__dots">
          {items.map((item, i) => (
            <button
              key={item.reflection.id}
              type="button"
              className={i === current ? 'memories__dot is-on' : 'memories__dot'}
              aria-label={`ver reflexão ${i + 1} de ${count}`}
              aria-current={i === current}
              onClick={() => go(i)}
            />
          ))}
        </div>
      ) : (
        // muitas reflexões: um contador no lugar de uma fileira enorme de bolinhas
        <p className="memories__counter" aria-hidden="true">
          {current + 1} / {count}
        </p>
      )}
    </section>
  )
}
