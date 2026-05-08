'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  rating?: number | null
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onRate?: (rating: number) => void
}

export default function RatingStars({ rating, maxRating = 10, size = 'md', interactive, onRate }: Props) {
  const [hovered, setHovered] = useState<number | null>(null)
  const stars = maxRating === 10 ? 5 : maxRating
  const filled = hovered ?? (rating ? (rating / maxRating) * stars : 0)
  const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg'

  return (
    <div className={cn('flex gap-0.5', sizeClass)}>
      {Array.from({ length: stars }, (_, i) => {
        const full = i + 1 <= filled
        const half = !full && i + 0.5 <= filled
        return (
          <button key={i} disabled={!interactive}
            className={cn('transition-all', interactive && 'cursor-pointer hover:scale-110')}
            style={{ color: full || half ? '#FFD700' : '#374151' }}
            onMouseEnter={() => interactive && setHovered(((i + 1) / stars) * maxRating)}
            onMouseLeave={() => interactive && setHovered(null)}
            onClick={() => interactive && onRate?.(((i + 1) / stars) * maxRating)}
          >
            {full ? '★' : half ? '⯨' : '☆'}
          </button>
        )
      })}
    </div>
  )
}
