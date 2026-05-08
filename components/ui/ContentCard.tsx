'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn, formatRuntime, getContentColor } from '@/lib/utils'
import { ContentItem } from '@/types'
import { useStore } from '@/store/useStore'

const TYPE_LABELS: Record<string, string> = {
  MOVIE: 'Movie', ANIME: 'Anime', SERIES: 'Series', KDRAMA: 'K-Drama', CARTOON: 'Cartoon', HOLLYWOOD: 'Hollywood', DOCUMENTARY: 'Documentary'
}

const TYPE_COLORS: Record<string, string> = {
  MOVIE: '#E50914', ANIME: '#a855f7', SERIES: '#3b82f6', KDRAMA: '#ec4899', CARTOON: '#22c55e', HOLLYWOOD: '#f59e0b', DOCUMENTARY: '#06b6d4'
}

interface Props {
  content: ContentItem
  index?: number
  size?: 'sm' | 'md' | 'lg'
  showRank?: boolean
  rank?: number
}

export default function ContentCard({ content, index = 0, size = 'md', showRank, rank }: Props) {
  const { toggleWatchlist, toggleFavorite, watchlist, favorites, language } = useStore()
  const color = TYPE_COLORS[content.type] || '#FFD700'
  const title = language === 'te' && content.titleTelugu ? content.titleTelugu : content.titleEnglish
  const w = size === 'sm' ? 'w-36' : size === 'lg' ? 'w-52' : 'w-44'
  const h = size === 'sm' ? 'h-52' : size === 'lg' ? 'h-72' : 'h-64'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn('group relative flex-none cursor-pointer', w)}
    >
      <Link href={`/content/${content.slug}`}>
        <div className={cn('relative rounded-xl overflow-hidden', h)}>
          {content.poster ? (
            <Image src={content.poster} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 768px) 144px, 176px" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg, ${color}22, ${color}08)`, border: `1px solid ${color}33` }}>
              <span className="text-5xl">{getTypeEmoji(content.type)}</span>
              <span className="text-xs text-center text-gray-400 px-3 font-rajdhani font-semibold line-clamp-2">{content.titleEnglish}</span>
            </div>
          )}

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

          {/* Type badge */}
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold font-rajdhani tracking-wide uppercase"
            style={{ background: color, color: '#000' }}>
            {TYPE_LABELS[content.type]}
          </div>

          {/* Telugu dub badge */}
          {content.teluguDubAvail && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-yellow-400 border border-yellow-400/40 font-rajdhani backdrop-blur-sm">
              తె DUB
            </div>
          )}

          {/* Rank */}
          {showRank && rank && (
            <div className={cn('absolute top-1/2 -left-1 -translate-y-1/2 font-cinzel font-black text-4xl leading-none drop-shadow-lg',
              rank <= 3 ? 'text-yellow-400' : 'text-gray-500')}>
              {rank}
            </div>
          )}

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-yellow-400 text-xs">★</span>
              <span className="text-yellow-400 text-xs font-bold font-rajdhani">{content.imdbRating?.toFixed(1) || 'N/A'}</span>
            </div>
            <p className="text-white text-sm font-semibold font-rajdhani leading-tight truncate">{content.titleEnglish}</p>
            {content.titleTelugu && <p className="text-gray-400 text-[11px] font-telugu mt-0.5 truncate">{content.titleTelugu}</p>}
          </div>

          {/* Hover actions */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={(e) => { e.preventDefault(); toggleWatchlist(content.id) }}
              className={cn('p-2 rounded-full backdrop-blur-sm border transition-all text-sm', watchlist.includes(content.id) ? 'bg-yellow-500 border-yellow-500 text-black' : 'bg-black/70 border-white/30 text-white hover:border-yellow-400')}
              title="Add to Watchlist"
            >+</button>
            <button
              onClick={(e) => { e.preventDefault(); toggleFavorite(content.id) }}
              className={cn('p-2 rounded-full backdrop-blur-sm border transition-all text-sm', favorites.includes(content.id) ? 'bg-red-500 border-red-500 text-white' : 'bg-black/70 border-white/30 text-white hover:border-red-400')}
              title="Favorite"
            >♥</button>
          </div>

          {/* Glow */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ boxShadow: `inset 0 0 0 2px ${color}80, 0 0 30px ${color}30` }} />
        </div>
      </Link>
    </motion.div>
  )
}

function getTypeEmoji(type: string) {
  const map: Record<string, string> = { MOVIE: '🎬', ANIME: '⚡', SERIES: '📺', KDRAMA: '🌸', CARTOON: '🎭', HOLLYWOOD: '🎪', DOCUMENTARY: '📽️' }
  return map[type] || '🎬'
}
