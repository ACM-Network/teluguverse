'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn, PLACEHOLDER_POSTER } from '@/lib/utils'
import { ContentItem } from '@/types'
import { useStore } from '@/store/useStore'
import PremiumIcon from '@/components/ui/PremiumIcon'

const TYPE_LABELS: Record<string, string> = {
  MOVIE: 'Movie', 
  ANIME: 'Anime', 
  SERIES: 'Series', 
  KDRAMA: 'K-Drama', 
  CARTOON: 'Cartoon', 
  HOLLYWOOD: 'Hollywood', 
  DOCUMENTARY: 'Documentary'
}

const TYPE_COLORS: Record<string, string> = {
  MOVIE: '#E50914', 
  ANIME: '#A855F7', 
  SERIES: '#3B82F6', 
  KDRAMA: '#EC4899', 
  CARTOON: '#22C55E', 
  HOLLYWOOD: '#F59E0B', 
  DOCUMENTARY: '#06B6D4'
}

const TYPE_ICONS: Record<string, string> = {
  MOVIE: 'movies',
  ANIME: 'anime',
  SERIES: 'series',
  KDRAMA: 'kdrama',
  CARTOON: 'cartoon',
  HOLLYWOOD: 'hollywood',
  DOCUMENTARY: 'documentary',
}

interface Props {
  content: ContentItem
  index?: number
  size?: 'sm' | 'md' | 'lg'
  showRank?: boolean
  rank?: number
  reason?: string
}

export default function ContentCard({ content, index = 0, size = 'md', showRank, rank, reason }: Props) {
  const { toggleWatchlist, toggleFavorite, watchlist, favorites, language } = useStore()
  const [imgSrc, setImgSrc] = useState(content.poster || PLACEHOLDER_POSTER)

  useEffect(() => {
    setImgSrc(content.poster || PLACEHOLDER_POSTER)
  }, [content.poster])

  const color = TYPE_COLORS[content.type] || '#FFD700'
  const title = language === 'te' && content.titleTelugu ? content.titleTelugu : content.titleEnglish
  
  const w = size === 'sm' ? 'w-36' : size === 'lg' ? 'w-52' : 'w-44'
  const h = size === 'sm' ? 'h-52' : size === 'lg' ? 'h-72' : 'h-64'

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        delay: (index % 6) * 0.04, 
        duration: 0.45, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      className={cn('group relative flex-none select-none cursor-pointer', w)}
    >
      <Link href={`/content/${content.slug}`}>
        <div 
          className={cn('relative rounded-2xl overflow-hidden transition-all duration-500', h)}
          style={{
            background: 'var(--dark-3)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
          }}
        >
          {/* Card Border glow */}
          <div 
            className="absolute inset-0 rounded-2xl border border-white/5 group-hover:border-white/20 transition-all duration-500 z-30" 
            style={{
              boxShadow: 'inset 0 0 15px rgba(255,255,255,0.01)',
            }}
          />

          {/* Poster Image */}
          {imgSrc ? (
            <div className="relative w-full h-full overflow-hidden">
              <Image 
                src={imgSrc} 
                alt={title} 
                fill 
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:rotate-[0.5deg]" 
                sizes="(max-width: 768px) 144px, 208px" 
                onError={() => setImgSrc(PLACEHOLDER_POSTER)}
              />
            </div>
          ) : (
            <div 
              className="w-full h-full flex flex-col items-center justify-center gap-2.5 p-3 text-center"
              style={{ background: `linear-gradient(135deg, ${color}15, ${color}05)` }}
            >
              <PremiumIcon name={TYPE_ICONS[content.type] || 'movies'} size={32} className="opacity-40" />
              <span className="text-[11px] text-gray-400 font-rajdhani font-semibold line-clamp-2">{content.titleEnglish}</span>
            </div>
          )}

          {/* Cinematic Bottom dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300 z-10" />

          {/* Top badges (absolute) */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 z-20">
            {/* Category / Type badge */}
            <span 
              className="px-2 py-0.5 rounded-md text-[9px] font-bold font-rajdhani tracking-wider uppercase bg-black/60 border border-white/10 text-white backdrop-blur-md"
              style={{ color }}
            >
              {TYPE_LABELS[content.type]}
            </span>

            {/* Telugu dub badge */}
            {content.teluguDubAvail && (
              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-yellow-400/90 text-black font-rajdhani shadow-lg shadow-black/30">
                తె DUB
              </span>
            )}
          </div>

          {/* Rank indicator overlay */}
          {showRank && rank && (
            <div 
              className={cn(
                'absolute top-1/2 -left-1 -translate-y-1/2 font-cinzel font-black text-5xl leading-none z-20 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] select-none',
                rank <= 3 ? 'text-yellow-400' : 'text-gray-500/70'
              )}
            >
              {rank}
            </div>
          )}

          {/* Bottom Card Details */}
          <div className="absolute bottom-0 left-0 right-0 p-3.5 z-20 space-y-1">
            {/* Rating pill & optional recommendation reason */}
            <div className="flex items-center justify-between gap-1.5 flex-wrap">
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 text-xs">★</span>
                <span className="text-yellow-400 text-xs font-bold font-rajdhani tracking-wider">
                  {content.imdbRating ? content.imdbRating.toFixed(1) : 'N/A'}
                </span>
              </div>
              {reason && (
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/95 border border-white/10 text-[9px] font-bold font-rajdhani uppercase tracking-wider scale-90 origin-right">
                  {reason}
                </span>
              )}
            </div>
            
            {/* Title Eng / Tel */}
            <p className="text-white text-xs sm:text-sm font-bold font-rajdhani tracking-wide leading-snug line-clamp-1 transition-colors duration-300">
              {content.titleEnglish}
            </p>
            {content.titleTelugu && (
              <p className="text-gray-400 text-[10px] font-telugu mt-0 truncate tracking-normal">
                {content.titleTelugu}
              </p>
            )}
          </div>

          {/* Hover Action overlay buttons */}
          <div className="absolute inset-0 flex items-center justify-center gap-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 bg-black/40 backdrop-blur-[2px]">
            <button
              onClick={(e) => { e.preventDefault(); toggleWatchlist(content.id) }}
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center border font-bold text-base transition-all duration-300 shadow-md',
                watchlist.includes(content.id) 
                  ? 'bg-yellow-500 border-yellow-500 text-black hover:scale-105' 
                  : 'bg-black/60 border-white/20 text-white hover:border-yellow-400 hover:text-yellow-400 hover:scale-105'
              )}
              title={watchlist.includes(content.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              {watchlist.includes(content.id) ? '✓' : '+'}
            </button>
            <button
              onClick={(e) => { e.preventDefault(); toggleFavorite(content.id) }}
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center border font-bold text-sm transition-all duration-300 shadow-md',
                favorites.includes(content.id) 
                  ? 'bg-red-500 border-red-500 text-white hover:scale-105' 
                  : 'bg-black/60 border-white/20 text-white hover:border-red-400 hover:text-red-400 hover:scale-105'
              )}
              title={favorites.includes(content.id) ? 'Favorited' : 'Favorite'}
            >
              ♥
            </button>
          </div>

          {/* Ambient card type shadow & bottom border line */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-1 z-30 transition-transform duration-300 translate-y-1 group-hover:translate-y-0"
            style={{ background: color }}
          />
        </div>
      </Link>
    </motion.div>
  )
}



