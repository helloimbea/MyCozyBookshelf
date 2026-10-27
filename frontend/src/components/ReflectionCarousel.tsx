import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useI18n } from '../i18n/context'
import type { Book, Reflection } from '../types'
import { BookCover } from './BookCover'
import './ReflectionCarousel.css'

const INTERVAL_MS = 8000
const MAX_DOTS = 8

export type CarouselItem = { book: Book; reflection: Reflection }

/** "Shelf memories": reflections that go by on their own, slowly. */
export function ReflectionCarousel({ items }: { items: CarouselItem[] }) {
  const { t } = useI18n()
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [reduceMotion] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const count = items.length
  const current = count ? index % count : 0
  const paused = hovered || focused || reduceMotion

  // restarts the countdown on every change, including manual navigation
  useEffect(() => {
    if (paused || count < 2) return
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), INTERVAL_MS)
    return () => clearTimeout(timer)
  }, [paused, count, current])

  if (count < 2) return null

  const { book, reflection } = items[current]
  const go = (i: number) => setIndex((i + count) % count)
  const details = [book.author, reflection.page && t.book.page(reflection.page)].filter(Boolean).join(' · ')

  return (
    <section
      className="memories"
      aria-roledescription={t.carousel.carousel}
      aria-label={t.carousel.title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
    >
      <h2 className="memories__title">{t.carousel.title}</h2>

      <div className="memories__card">
        <button type="button" className="memories__arrow memories__arrow--prev" aria-label={t.carousel.prev} onClick={() => go(current - 1)}>
          ‹
        </button>

        {/* the key recreates the slide so the fade plays on every change */}
        <Link
          key={reflection.id}
          to={`/book/${book.id}`}
          className="memories__slide"
          aria-roledescription={t.carousel.slide}
          aria-label={t.carousel.position(current + 1, count)}
          aria-live={paused ? 'polite' : 'off'}
        >
          <blockquote className="memories__text">{reflection.text}</blockquote>
          <span className="memories__book">
            <BookCover title={book.title} author={book.author} coverUrl={book.coverUrl} className="memories__cover" />
            <span>
              <strong>{book.title}</strong>
              {details && <span>{details}</span>}
            </span>
          </span>
        </Link>

        <button type="button" className="memories__arrow memories__arrow--next" aria-label={t.carousel.next} onClick={() => go(current + 1)}>
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
              aria-label={t.carousel.goTo(i + 1, count)}
              aria-current={i === current}
              onClick={() => go(i)}
            />
          ))}
        </div>
      ) : (
        // many reflections: a counter instead of a huge row of dots
        <p className="memories__counter" aria-hidden="true">
          {current + 1} / {count}
        </p>
      )}
    </section>
  )
}
