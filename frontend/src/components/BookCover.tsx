import { useState, type CSSProperties } from 'react'
import { useI18n } from '../i18n/context'
import './BookCover.css'

// Palette pairs for the placeholder cover; the pick is fixed per title.
const PLACEHOLDER_COLORS = [
  { bg: '#91ebc8', fg: '#3f6157' },
  { bg: '#a0d6b2', fg: '#3f6157' },
  { bg: '#6adce4', fg: '#2f5c63' },
  { bg: '#b4a588', fg: '#fffdf9' },
  { bg: '#d3f4ed', fg: '#56756c' },
  { bg: '#e8a598', fg: '#fffdf9' },
]

function colorFor(title: string) {
  let hash = 0
  for (const char of title) hash = (hash * 31 + char.charCodeAt(0)) | 0
  return PLACEHOLDER_COLORS[Math.abs(hash) % PLACEHOLDER_COLORS.length]
}

type Props = {
  title: string
  author?: string
  coverUrl?: string
  className?: string
}

export function BookCover({ title, author, coverUrl, className = '' }: Props) {
  const { t } = useI18n()
  const [failedUrl, setFailedUrl] = useState<string>()
  const shownTitle = title || t.cover.untitled

  if (coverUrl && coverUrl !== failedUrl) {
    return (
      <div className={`cover ${className}`}>
        <img src={coverUrl} alt={t.cover.alt(shownTitle)} onError={() => setFailedUrl(coverUrl)} />
      </div>
    )
  }

  const { bg, fg } = colorFor(title)
  return (
    <div
      className={`cover ${className}`}
      style={{ '--cover-bg': bg, '--cover-fg': fg } as CSSProperties}
      role="img"
      aria-label={t.cover.alt(shownTitle)}
    >
      <div className="cover__placeholder">
        <svg className="cover__leaf" viewBox="0 0 40 40" aria-hidden="true">
          <path d="M20 36V16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M20 22C12 22 7 16 7 8c8 0 13 6 13 14Z" fill="currentColor" opacity="0.75" />
          <path d="M20 18c0-7 5-12 13-12 0 8-5 12-13 12Z" fill="currentColor" />
        </svg>
        <span className="cover__title">{shownTitle}</span>
        {author && <span className="cover__author">{author}</span>}
      </div>
    </div>
  )
}
