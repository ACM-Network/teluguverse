'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ContentItem } from '@/types'
import { useStore } from '@/store/useStore'
import { formatRuntime, formatDate, getContentColor, PLACEHOLDER_POSTER, PLACEHOLDER_BACKDROP } from '@/lib/utils'
import OttBadge from '@/components/ui/OttBadge'
import RatingStars from '@/components/ui/RatingStars'
import ContentCard from '@/components/ui/ContentCard'
import SectionHeader from '@/components/ui/SectionHeader'
import PremiumIcon from '@/components/ui/PremiumIcon'

const TYPE_LABELS: Record<string, string> = {
  MOVIE: 'Movie',
  ANIME: 'Anime',
  SERIES: 'Series',
  KDRAMA: 'K-Drama',
  CARTOON: 'Cartoon',
  HOLLYWOOD: 'Hollywood',
  DOCUMENTARY: 'Documentary',
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
  similar?: ContentItem[]
}

// Reusable Collapsible Card component with Framer Motion transitions
function CollapsibleSection({
  title,
  titleTe,
  children,
  defaultOpen = false,
}: {
  title: string
  titleTe?: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className="bg-surface/20 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-white/10 shadow-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 font-cinzel text-sm md:text-base font-bold text-yellow-400 hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-yellow-400/70 text-xs">✦</span>
          <span>{title}</span>
          {titleTe && <span className="font-telugu text-xs text-gray-400 block sm:inline sm:ml-3 font-normal">{titleTe}</span>}
        </div>
        <span
          className={`text-xs text-yellow-400/50 transition-transform duration-300 ml-4 flex-none ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          ▼
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="p-5 pt-0 font-telugu text-gray-300 leading-8 text-base border-t border-white/5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Youtube Embed Link Helper supporting various URL patterns
function getYouTubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.includes('youtube.com/embed/')) return url

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=1`
  }
  return url
}

export default function ContentDetailPage({ content, similar = [] }: Props) {
  const [activeTab, setActiveTab] = useState('Overview')
  const [userRating, setUserRating] = useState<number | null>(null)
  const [showTrailer, setShowTrailer] = useState(false)
  const [watchedEps, setWatchedEps] = useState<Set<number>>(new Set())
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current
      const offset = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75
      carouselRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' })
    }
  }

  const [posterSrc, setPosterSrc] = useState(content.poster || PLACEHOLDER_POSTER)
  const [backdropSrc, setBackdropSrc] = useState(content.banner || content.poster || PLACEHOLDER_BACKDROP)

  useEffect(() => {
    setPosterSrc(content.poster || PLACEHOLDER_POSTER)
    setBackdropSrc(content.banner || content.poster || PLACEHOLDER_BACKDROP)
  }, [content.poster, content.banner])

  const { toggleWatchlist, toggleFavorite, watchlist, favorites, language } = useStore()

  const color = getContentColor(content.type)
  const title = language === 'te' && content.titleTelugu ? content.titleTelugu : content.titleEnglish
  const desc = language === 'te' && content.descriptionTelugu ? content.descriptionTelugu : content.descriptionEnglish

  // Keyboard navigation for screenshots lightbox
  useEffect(() => {
    if (lightboxIndex === null) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowRight' && content.screenshots) {
        setLightboxIndex((prev) => (prev! + 1) % content.screenshots.length)
      }
      if (e.key === 'ArrowLeft' && content.screenshots) {
        setLightboxIndex((prev) => (prev! - 1 + content.screenshots.length) % content.screenshots.length)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, content.screenshots])

  // DYNAMIC FUTURE TABS: Only include sections with database rows
  const TABS = [
    'Overview',
    ...(content.seasons?.length || (content as any).episodes?.length ? ['Episodes'] : []),
    ...(content.characters?.length ? ['Characters'] : []),
    ...(content.cast?.length ? ['Cast'] : []),
    ...(content.reviews?.length ? ['Reviews'] : []),
    ...(content.screenshots?.length ? ['Gallery'] : []),
    ...(similar.length ? ['Similar'] : []),
    'Info',
  ]

  const inWatchlist = watchlist.includes(content.id)
  const isFav = favorites.includes(content.id)

  return (
    <div className="min-h-screen bg-dark relative overflow-x-hidden">
      
      {/* HERO BANNER - CINEMATIC & PREMIUM BG BLENDING */}
      <div className="relative h-[45vh] md:h-[60vh] min-h-[350px] overflow-hidden">
        {/* Desktop Banner: hidden below md */}
        {backdropSrc && (
          <div className="hidden md:block absolute inset-0 w-full h-full">
            <Image
              src={backdropSrc}
              alt={content.titleEnglish}
              fill
              priority
              className="object-cover scale-105"
              sizes="100vw"
              unoptimized
              onError={() => setBackdropSrc(PLACEHOLDER_BACKDROP)}
            />
          </div>
        )}
        
        {/* Mobile Banner: hidden on md and up */}
        {posterSrc && (
          <div className="block md:hidden absolute inset-0 w-full h-full">
            <Image
              src={posterSrc}
              alt={content.titleEnglish}
              fill
              priority
              className="object-cover scale-105 object-top"
              sizes="100vw"
              unoptimized
              onError={() => setPosterSrc(PLACEHOLDER_POSTER)}
            />
          </div>
        )}

        {!backdropSrc && !posterSrc && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: `radial-gradient(ellipse at center, ${color}15 0%, #070810 80%)` }}
          >
            <PremiumIcon name={TYPE_ICONS[content.type] || 'movies'} size={120} className="opacity-15" />
          </div>
        )}

        {/* Heavy Vignette Overlay */}
        <div 
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 30%, transparent 10%, rgba(7, 8, 16, 0.45) 50%, rgba(7, 8, 16, 0.95) 100%)'
          }}
        />

        {/* Radial Glow behind title area */}
        <div 
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background: `radial-gradient(circle at 20% 80%, ${color}22 0%, transparent 60%)`
          }}
        />

        {/* Cinematic gradient overlays */}
        <div
          className="absolute inset-0 z-[3] pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(7,8,16,0.95) 0%, rgba(7,8,16,0.65) 45%, rgba(7,8,16,0.15) 100%)',
          }}
        />
        <div
          className="absolute inset-0 z-[4] pointer-events-none"
          style={{ background: 'linear-gradient(to top, #070810 0%, rgba(7,8,16,0.1) 50%, transparent 100%)' }}
        />
        
        {/* Soft bottom edge transition block to blend into body background */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-40 z-[5] pointer-events-none" 
          style={{ 
            background: 'linear-gradient(to top, #070810 0%, rgba(7,8,16,0.95) 15%, rgba(7,8,16,0.7) 40%, transparent 100%)' 
          }} 
        />
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 -mt-36 md:-mt-52 relative z-10 pb-20">
        
        {/* OPTIMIZED GRID: Left poster 220px to give details more space */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 md:gap-10 items-start">
          
          {/* LEFT COLUMN: Poster Card (Desktop only) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="hidden lg:flex flex-col flex-none w-[220px] sticky top-24"
          >
            {posterSrc && (
              <div
                className="relative w-[220px] h-[330px] rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group cursor-pointer hover:border-yellow-400/40 transition-all duration-300"
                style={{
                  boxShadow: `0 20px 50px rgba(0,0,0,0.85), 0 0 25px ${color}12`,
                }}
              >
                <Image
                  src={posterSrc}
                  alt={content.titleEnglish}
                  fill
                  priority
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="220px"
                  unoptimized
                  onError={() => setPosterSrc(PLACEHOLDER_POSTER)}
                />
              </div>
            )}

            {/* Genres list on Desktop Column */}
            {content.genres && content.genres.length > 0 && (
              <div className="mt-5">
                <p className="text-gray-500 text-[10px] font-bold font-rajdhani tracking-widest uppercase mb-2">
                  Genres
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {content.genres.map((g: any, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg border border-purple-500/20 bg-purple-500/5 text-purple-300 text-[11px] font-semibold tracking-wide font-rajdhani"
                    >
                      {g.genre?.name || g.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Lang Details on Desktop Column */}
            <div className="mt-5">
              <p className="text-gray-500 text-[10px] font-bold font-rajdhani tracking-widest uppercase mb-2">
                Telugu Availability
              </p>
              <div className="text-xs font-semibold py-1.5 border-b border-white/5">
                {content.teluguDubAvail ? (
                  <span className="text-yellow-400">✓ Telugu Dub Available</span>
                ) : (
                  <span className="text-red-400">✗ Telugu Dub Not Available</span>
                )}
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Titles, IMDb Rating, OTT platforms, Actions, Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex-1 min-w-0"
          >
            {/* MOBILE ONLY TITLE HEADER */}
            <div className="flex lg:hidden gap-4 items-start mb-5">
              {posterSrc && (
                <div
                  className="relative w-24 h-36 rounded-xl overflow-hidden border border-white/10 flex-none shadow-xl"
                  style={{ boxShadow: `0 10px 25px rgba(0,0,0,0.5), 0 0 15px ${color}08` }}
                >
                  <Image
                    src={posterSrc}
                    alt={content.titleEnglish}
                    fill
                    className="object-cover"
                    sizes="96px"
                    unoptimized
                    onError={() => setPosterSrc(PLACEHOLDER_POSTER)}
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex gap-1.5 flex-wrap mb-1.5">
                  <span
                    className="px-2 py-0.5 rounded text-[9px] font-bold font-rajdhani tracking-wider"
                    style={{ background: `${color}20`, color, border: `1px solid ${color}35` }}
                  >
                    {TYPE_LABELS[content.type]}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold font-rajdhani tracking-wider ${
                      content.status === 'COMPLETED'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : content.status === 'ONGOING'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                    }`}
                  >
                    {content.status}
                  </span>
                </div>

                <h1 className="font-cinzel text-xl md:text-2xl font-black text-white leading-tight mb-1">
                  {content.titleEnglish}
                </h1>
                {content.titleTelugu && (
                  <p className="font-telugu text-sm text-yellow-400/80 font-bold mb-2">
                    {content.titleTelugu}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-gray-400 font-rajdhani text-xs font-bold uppercase tracking-wider">
                  {content.year && (
                    <span className="flex items-center gap-1">
                      <PremiumIcon name="upcoming" size={13} className="text-yellow-500/80" /> {content.year}
                    </span>
                  )}
                  {content.imdbRating && (
                    <span className="text-yellow-400 font-black flex items-center gap-0.5">
                      <PremiumIcon name="rating" size={13} className="text-yellow-400" /> {content.imdbRating.toFixed(1)}
                    </span>
                  )}
                  {content.runtime && (
                    <span className="flex items-center gap-1">
                      <PremiumIcon name="clock" size={13} className="text-cyan-500/80" /> {formatRuntime(content.runtime)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* DESKTOP ONLY TITLE HEADER */}
            <div className="hidden lg:block mb-4">
              <div className="flex gap-2 flex-wrap mb-2.5">
                <span
                  className="px-3 py-1 rounded-lg text-xs font-bold font-rajdhani tracking-wider"
                  style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}
                >
                  {TYPE_LABELS[content.type]}
                </span>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold font-rajdhani tracking-wider ${
                    content.status === 'COMPLETED'
                      ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                      : content.status === 'ONGOING'
                      ? 'bg-blue-500/15 text-blue-400 border border-blue-500/25'
                      : 'bg-orange-500/15 text-orange-400 border border-orange-500/25'
                  }`}
                >
                  {content.status}
                </span>
                {content.ageRating && (
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-white/5 text-gray-400 border border-white/10 font-rajdhani">
                    {content.ageRating}
                  </span>
                )}
              </div>

              <h1 className="font-cinzel text-4xl lg:text-5xl font-black text-white leading-none tracking-wide mb-1" style={{ textShadow: '0 2px 25px rgba(0,0,0,0.8)' }}>
                {content.titleEnglish}
              </h1>
              {content.titleTelugu && (
                <p className="font-telugu text-xl text-yellow-400/90 font-semibold mb-2">{content.titleTelugu}</p>
              )}
              {content.titleOriginal && content.titleOriginal !== content.titleEnglish && (
                <p className="text-gray-500 text-xs font-rajdhani mb-3 italic tracking-wide">{content.titleOriginal}</p>
              )}
            </div>

            {/* PREMIUM METADATA ROW & IMDB RATING BADGE (Desktop Layout) */}
            <div className="hidden lg:flex items-center justify-between border-b border-white/5 pb-4 mb-4 gap-6">
              
              {/* IMDb Premium Rating badge */}
              {content.imdbRating && (
                <div className="flex items-center gap-3 bg-surface/20 border border-yellow-400/10 rounded-2xl px-5 py-2.5 backdrop-blur-md shadow-md">
                  <svg className="w-8 h-8 text-yellow-400 flex-none" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <div>
                    <div className="flex items-baseline gap-0.5">
                      <span className="font-cinzel text-3xl font-black text-white leading-none">
                        {content.imdbRating.toFixed(1)}
                      </span>
                      <span className="text-gray-500 text-xs font-bold font-rajdhani">/10</span>
                    </div>
                    <p className="text-gray-400 text-[9px] font-rajdhani uppercase tracking-widest font-bold mt-0.5">
                      IMDb Rating
                    </p>
                  </div>
                </div>
              )}

              {/* Meta information tags */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-gray-400 font-rajdhani text-sm font-semibold tracking-wide justify-end">
                {content.year && <span className="flex items-center gap-1.5"><PremiumIcon name="upcoming" size={14} className="text-yellow-500/80" /> {content.year}</span>}
                {content.runtime && <span className="flex items-center gap-1.5"><PremiumIcon name="clock" size={14} className="text-cyan-500/80" /> {formatRuntime(content.runtime)}</span>}
                {content.totalEpisodes && <span className="flex items-center gap-1.5"><PremiumIcon name="ott" size={14} className="text-blue-500/80" /> {content.totalEpisodes} Episodes</span>}
                {content.totalSeasons && <span className="flex items-center gap-1.5"><PremiumIcon name="watchlist" size={14} className="text-yellow-500/80" /> {content.totalSeasons} Seasons</span>}
                {content.language && <span className="flex items-center gap-1.5"><PremiumIcon name="globe" size={14} className="text-emerald-500/80" /> {content.language}</span>}
                {content.studio && <span className="flex items-center gap-1.5"><PremiumIcon name="movies" size={14} className="text-red-500/80" /> {content.studio}</span>}
                {content.country && <span className="flex items-center gap-1.5"><PremiumIcon name="universe" size={14} className="text-cyan-500/80" /> {content.country}</span>}
              </div>
            </div>

            {/* ACTION BUTTONS ROW */}
            <div className="flex gap-2.5 flex-wrap mb-5">
              <button
                onClick={() => setShowTrailer(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-bold font-rajdhani tracking-wider text-white transition-all duration-300 hover:opacity-95 hover:scale-[1.02] shadow-[0_4px_20px_rgba(229,9,20,0.25)] hover:shadow-[0_4px_25px_rgba(229,9,20,0.4)]"
                style={{
                  background: 'linear-gradient(135deg, #E50914 0%, #B00710 100%)',
                }}
              >
                ▶ WATCH TRAILER
              </button>

              <button
                onClick={() => toggleWatchlist(content.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs md:text-sm font-bold font-rajdhani tracking-wider border transition-all duration-300 hover:scale-[1.02] ${
                  inWatchlist
                    ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:border-yellow-400/30 hover:text-yellow-400'
                }`}
              >
                {inWatchlist ? '✓ IN WATCHLIST' : '+ WATCHLIST'}
              </button>
              <button
                onClick={() => toggleFavorite(content.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs md:text-sm font-bold font-rajdhani tracking-wider border transition-all duration-300 hover:scale-[1.02] ${
                  isFav
                    ? 'bg-red-500/10 border-red-500/40 text-red-400'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:border-red-400/30 hover:text-red-400'
                }`}
              >
                {isFav ? '♥ FAVORITED' : '♡ FAVORITE'}
              </button>
            </div>

            {/* Mobile-only Genres and Dubbed details wrapper */}
            <div className="flex lg:hidden flex-col gap-3 mb-5 p-4 bg-surface/20 border border-white/5 rounded-xl">
              <div>
                <p className="text-gray-500 text-[9px] font-bold font-rajdhani tracking-widest uppercase mb-1">
                  Genres
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {content.genres?.map((g: any, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md border border-purple-500/20 bg-purple-500/5 text-purple-300 text-xs"
                    >
                      {g.genre?.name || g.name}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-[9px] font-bold font-rajdhani tracking-widest uppercase mb-1">
                  Telugu Availability
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {content.teluguDubAvail ? (
                    <span className="px-2.5 py-1 rounded-md border border-yellow-500/20 bg-yellow-500/5 text-yellow-400 text-xs font-semibold">
                      Telugu Dub Available
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-semibold">
                      Telugu Dub Not Available
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* OTT / TV AVAILABILITY SECTION - w-fit to shrinkwrap content and remove large empty space */}
            {content.streamingLinks && content.streamingLinks.length > 0 && (() => {
              const allAvailable = content.streamingLinks.filter((link) => link.isAvailable);
              const tvChannels = ['DISNEY_CHANNEL', 'HUNGAMA_TV', 'CARTOON_NETWORK', 'POGO', 'SONIC', 'NICK', 'SONY_YAY', 'ETV_BAL_BHARAT'];
              const ottLinks = allAvailable.filter(link => !tvChannels.includes(link.platform.toUpperCase()));
              const tvLinks = allAvailable.filter(link => tvChannels.includes(link.platform.toUpperCase()));

              if (allAvailable.length === 0) return null;

              return (
                <div className="mb-5 p-4 bg-surface/25 border border-white/5 rounded-2xl backdrop-blur-md shadow-lg w-fit max-w-full flex flex-col gap-4">
                  {ottLinks.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-[10px] font-bold font-rajdhani tracking-widest uppercase mb-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-2.5 bg-yellow-400 rounded-full" />
                        Available On / స్ట్రీమింగ్
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {ottLinks.map((link) => (
                          <div key={link.id} className="flex-none">
                            <OttBadge
                              platform={link.platform}
                              isTeluguDub={link.isTeluguDub || content.teluguDubAvail}
                              isTeluguSub={content.teluguSubAvail}
                              url={link.url}
                              isPremium={link.isPremium}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {tvLinks.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-[10px] font-bold font-rajdhani tracking-widest uppercase mb-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-2.5 bg-purple-500 rounded-full animate-pulse" />
                        Airs On TV / టీవీ ప్రసారాలు
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {tvLinks.map((link) => (
                          <div key={link.id} className="flex-none">
                            <OttBadge
                              platform={link.platform}
                              isTeluguDub={link.isTeluguDub || content.teluguDubAvail}
                              isTeluguSub={content.teluguSubAvail}
                              url={link.url}
                              isPremium={link.isPremium}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* REDESIGNED PREMIUM CAPSULE NAVIGATION TABS */}
            <div className="bg-dark-3/40 border border-white/5 rounded-2xl p-1.5 flex gap-1 overflow-x-auto scrollbar-none relative select-none mb-6 shadow-2xl backdrop-blur-md">
              {TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-6 py-3 text-xs md:text-sm font-black font-rajdhani tracking-widest whitespace-nowrap transition-all duration-300 uppercase rounded-xl ${
                      isActive 
                        ? 'text-yellow-400 text-glow scale-[1.02]' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0.5 left-2 right-2 h-[3px] bg-gradient-to-r from-yellow-400 via-amber-400 to-amber-500 rounded-full shadow-[0_0_15px_rgba(255,215,0,0.8)] z-10"
                        transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* TAB CONTENTS (Tighter spacing & Information hierarchy) */}
            <div className="mt-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* OVERVIEW TAB */}
                  {activeTab === 'Overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Left: Synopsis, Explanations, Cast, Screenshots */}
                      <div className="lg:col-span-2 space-y-5">
                        
                        {/* Description Section */}
                        {desc && (
                          <div className="bg-surface/30 border border-white/5 rounded-2xl p-5 backdrop-blur-md shadow-md">
                            <h3 className="font-cinzel text-xs font-bold text-yellow-400 mb-3 flex items-center gap-2.5 uppercase tracking-wider">
                              <PremiumIcon name="watchlist" size={16} /> Synopsis / కథాసారాంశం
                            </h3>
                            <p className="font-telugu text-gray-300 leading-8 text-base tracking-normal">{desc}</p>
                          </div>
                        )}

                        {/* Collapsible: Story Explanation */}
                        {content.storyExplanation && (
                          <CollapsibleSection title="Story Explained" titleTe="కథ వివరణ">
                            <p className="whitespace-pre-wrap">{content.storyExplanation}</p>
                          </CollapsibleSection>
                        )}

                        {/* Collapsible: Ending Explanation */}
                        {content.endingExplanation && (
                          <CollapsibleSection title="Ending Explained" titleTe="ముగింపు వివరణ">
                            <p className="whitespace-pre-wrap">{content.endingExplanation}</p>
                          </CollapsibleSection>
                        )}

                        {/* Collapsible: Fun Facts & Trivia */}
                        {content.funFacts && Array.isArray(content.funFacts) && (content.funFacts as string[]).length > 0 && (
                          <CollapsibleSection title="Fun Facts & Trivia" titleTe="ఆసక్తికరమైన విషయాలు">
                            <div className="space-y-3 font-rajdhani text-sm md:text-base">
                              {(content.funFacts as string[]).map((fact, i) => (
                                <div key={i} className="flex gap-3 py-2.5 border-b border-white/5 last:border-0">
                                  <span className="text-yellow-400 flex-none font-bold">✦</span>
                                  <span className="text-gray-300 leading-relaxed font-semibold">{fact}</span>
                                </div>
                              ))}
                            </div>
                          </CollapsibleSection>
                        )}

                        {/* Embedded Trailer Display */}
                        {content.trailer && (
                          <div className="bg-surface/30 border border-white/5 rounded-2xl p-5 backdrop-blur-md shadow-md">
                            <h3 className="font-cinzel text-xs font-bold text-yellow-400 mb-3 flex items-center gap-2.5 uppercase tracking-wider">
                              <PremiumIcon name="trailer" size={16} /> Official Trailer
                            </h3>
                            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/5">
                              <iframe
                                src={getYouTubeEmbedUrl(content.trailer)!}
                                className="w-full h-full"
                                allowFullScreen
                              />
                            </div>
                          </div>
                        )}

                        {/* Cast & Characters: Rendered dynamically if rows exist */}
                        {((content.characters && content.characters.length > 0) ||
                          (content.cast && content.cast.length > 0)) && (
                          <div className="bg-surface/20 border border-white/5 rounded-2xl p-5 backdrop-blur-md shadow-md">
                            <SectionHeader title="Cast & Characters" titleTe="పాత్రలు & నటీనటులు" icon="cast" />
                            <div className="flex gap-3.5 overflow-x-auto pb-3.5 scrollbar-thin scrollbar-none snap-x snap-mandatory">
                              {content.type === 'ANIME' && content.characters && content.characters.length > 0
                                ? content.characters.slice(0, 10).map((char) => (
                                    <div
                                      key={char.id}
                                      className="w-32 flex-none snap-start bg-surface/50 border border-white/5 rounded-xl overflow-hidden hover:border-yellow-400/30 transition-all duration-300 group"
                                    >
                                      <div className="relative aspect-[4/5] w-full bg-dark-3 flex items-center justify-center text-4xl overflow-hidden">
                                        {char.photo ? (
                                          <Image
                                            src={char.photo}
                                            alt={char.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="128px"
                                            unoptimized
                                          />
                                        ) : (
                                          <PremiumIcon name="user" size={32} className="opacity-30" />
                                        )}
                                        {char.isMain && (
                                          <span className="absolute top-1.5 right-1.5 bg-yellow-400 text-black text-[8px] font-bold px-1 py-0.5 rounded tracking-wider shadow">
                                            MAIN
                                          </span>
                                        )}
                                      </div>
                                      <div className="p-2.5">
                                        <p className="text-white text-xs font-bold font-rajdhani truncate">{char.name}</p>
                                        {char.nameTe && (
                                          <p className="font-telugu text-gray-500 text-[10px] truncate leading-tight mt-0.5">
                                            {char.nameTe}
                                          </p>
                                        )}
                                        {char.voiceActor && (
                                          <p className="text-yellow-400/80 text-[10px] mt-1 font-rajdhani truncate flex items-center" title={char.voiceActor}>
                                            <span className="inline-block mr-1 text-[8px] px-1.5 py-0.5 rounded bg-yellow-400/10 text-yellow-400 font-bold border border-yellow-400/15 leading-none">VOICE</span> {char.voiceActor}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))
                                : content.cast && content.cast.length > 0
                                ? content.cast.slice(0, 10).map((member) => (
                                    <div
                                      key={member.id}
                                      className="w-32 flex-none snap-start bg-surface/50 border border-white/5 rounded-xl overflow-hidden hover:border-yellow-400/30 transition-all duration-300 group"
                                    >
                                      <div className="relative aspect-[4/5] w-full bg-dark-3 flex items-center justify-center text-4xl overflow-hidden">
                                        {member.photo ? (
                                          <Image
                                            src={member.photo}
                                            alt={member.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="128px"
                                            unoptimized
                                          />
                                        ) : (
                                          <PremiumIcon name="cast" size={32} className="opacity-30" />
                                        )}
                                      </div>
                                      <div className="p-2.5">
                                        <p className="text-white text-xs font-bold font-rajdhani truncate">{member.name}</p>
                                        {member.character && (
                                          <p className="text-gray-400 text-[10px] mt-0.5 font-rajdhani truncate leading-none">
                                            as {member.character}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))
                                : null}
                            </div>
                          </div>
                        )}

                        {/* Screenshots gallery: Rendered dynamically if rows exist */}
                        {content.screenshots && content.screenshots.length > 0 && (
                          <div className="bg-surface/20 border border-white/5 rounded-2xl p-5 backdrop-blur-md shadow-md">
                            <SectionHeader title="Gallery / Screenshots" titleTe="గ్యాలరీ చిత్రాలు" icon="gallery" />
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-none snap-x snap-mandatory">
                              {content.screenshots.map((ss, idx) => (
                                <div
                                  key={idx}
                                  onClick={() => setLightboxIndex(idx)}
                                  className="relative w-64 h-36 flex-none snap-start rounded-xl overflow-hidden bg-dark-3 border border-white/10 hover:border-yellow-400/40 transition-all cursor-zoom-in group shadow-lg"
                                >
                                  <Image
                                    src={ss}
                                    alt={`Screenshot ${idx + 1}`}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="256px"
                                    unoptimized
                                  />
                                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Sidebar: Quick info table, Directors list, Stats widgets */}
                      <div className="space-y-4">
                        <div className="bg-surface/30 border border-white/5 rounded-2xl p-5 backdrop-blur-md shadow-md">
                          <h3 className="font-cinzel text-xs font-bold text-yellow-400 mb-3 tracking-wider uppercase flex items-center gap-2.5">
                            <PremiumIcon name="info" size={16} /> Info Details
                          </h3>
                          {[
                            { label: 'Type', value: TYPE_LABELS[content.type] },
                            { label: 'Year', value: content.year },
                            { label: 'Status', value: content.status },
                            { label: 'Episodes', value: content.totalEpisodes },
                            { label: 'Seasons', value: content.totalSeasons },
                            { label: 'Runtime', value: content.runtime ? formatRuntime(content.runtime) : null },
                            { label: 'Language', value: content.language },
                            { label: 'Country', value: content.country },
                            { label: 'Studio', value: content.studio },
                            { label: 'Release', value: content.releaseDate ? formatDate(content.releaseDate) : null },
                          ]
                            .filter((d) => d.value)
                            .map(({ label, value }) => (
                              <div
                                key={label}
                                className="flex justify-between py-3 border-b border-white/5 last:border-0 text-xs md:text-sm font-rajdhani"
                              >
                                <span className="text-gray-400 font-semibold">{label}</span>
                                <span className="text-white font-semibold text-right max-w-[60%] truncate">
                                  {String(value)}
                                </span>
                              </div>
                            ))}
                        </div>

                        {/* Interactive rating box */}
                        <div className="flex flex-col gap-2 p-5 bg-surface/30 border border-white/5 rounded-2xl backdrop-blur-md shadow-md">
                          <span className="text-gray-400 text-[10px] font-bold font-rajdhani uppercase tracking-wider">
                            Rate this title
                          </span>
                          <div className="flex items-center gap-3">
                            <RatingStars rating={userRating} maxRating={10} size="md" interactive onRate={setUserRating} />
                            {userRating && (
                              <span className="text-yellow-400 font-black font-rajdhani text-sm">
                                {userRating}/10
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Directors list */}
                        {content.directors && content.directors.length > 0 && (
                          <div className="bg-surface/30 border border-white/5 rounded-2xl p-5 backdrop-blur-md shadow-md">
                            <h3 className="font-cinzel text-xs font-bold text-yellow-400 mb-3 tracking-wider uppercase flex items-center gap-2.5">
                              <PremiumIcon name="movies" size={16} /> Directors
                            </h3>
                            <div className="space-y-3">
                              {content.directors.map((d) => (
                                <div key={d.id} className="flex items-center gap-3">
                                  <div className="relative w-8 h-8 rounded-full bg-surface border border-white/5 overflow-hidden flex-none">
                                    {d.photo ? (
                                      <Image src={d.photo} alt={d.name} fill className="object-cover" unoptimized />
                                    ) : (
                                      <div className="absolute inset-0 flex items-center justify-center bg-white/5"><PremiumIcon name="user" size={16} className="opacity-40" /></div>
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-white text-xs font-bold font-rajdhani">{d.name}</p>
                                    {d.nameTe && <p className="font-telugu text-[10px] text-gray-500 leading-tight">{d.nameTe}</p>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Stats Counts - only render active stats that have values > 0 (Hide when zero) */}
                        {content._count && (
                          (() => {
                            const activeStats = [
                              { label: 'Reviews', value: content._count.reviews },
                              { label: 'Ratings', value: content._count.ratings },
                              { label: 'Watchlist', value: content._count.watchlist },
                              { label: 'Favorites', value: content._count.favorites },
                            ].filter((s) => s.value > 0)

                            if (activeStats.length === 0) return null

                            return (
                              <div className="grid grid-cols-2 gap-2.5">
                                {activeStats.map(({ label, value }) => (
                                  <div
                                    key={label}
                                    className="bg-surface/30 border border-white/5 rounded-xl p-3 text-center backdrop-blur-md shadow-sm"
                                  >
                                    <p className="font-cinzel text-lg font-bold text-yellow-400">{value.toLocaleString()}</p>
                                    <p className="text-gray-500 text-[9px] font-rajdhani mt-1 uppercase tracking-wider font-semibold">
                                      {label}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )
                          })()
                        )}
                      </div>
                    </div>
                  )}

                  {/* EPISODES TAB (Visible if seasons exist) */}
                  {activeTab === 'Episodes' && (
                    <div className="space-y-6">
                      {content.seasons && content.seasons.length > 0 ? (
                        content.seasons.map((season) => (
                          <div key={season.id} className="bg-surface/30 border border-white/5 rounded-2xl p-6 shadow-md">
                            <h3 className="font-cinzel text-base font-bold text-white mb-1">
                              Season {season.number}: {season.title}
                            </h3>
                            {season.titleTe && <p className="font-telugu text-yellow-400/70 text-sm mb-4">{season.titleTe}</p>}
                            <div
                              className="grid gap-2"
                              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))' }}
                            >
                              {season.episodeList?.map((ep) => (
                                <button
                                  key={ep.id}
                                  onClick={() =>
                                    setWatchedEps((prev) => {
                                      const n = new Set(prev)
                                      n.has(ep.number) ? n.delete(ep.number) : n.add(ep.number)
                                      return n
                                    })
                                  }
                                  className={`p-2 rounded-lg text-xs font-bold font-rajdhani border transition-all duration-300 ${
                                    watchedEps.has(ep.number)
                                      ? 'bg-green-500/20 border-green-500/40 text-green-400'
                                      : 'bg-dark-3 border-white/5 text-gray-400 hover:border-yellow-400/30 hover:text-yellow-400'
                                  }`}
                                  title={ep.title || `Episode ${ep.number}`}
                                >
                                  Ep {ep.number}
                                </button>
                              ))}
                            </div>
                            {season.episodeList && season.episodeList.length > 0 && (
                              <p className="text-gray-500 text-xs mt-3 font-rajdhani">
                                {watchedEps.size} / {season.episodeList.length} watched
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="bg-surface border border-border rounded-2xl p-6">
                          <p className="text-gray-500 font-rajdhani text-center py-8">
                            Episode list coming soon...
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* CHARACTERS TAB (Visible if characters exist) */}
                  {activeTab === 'Characters' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {content.characters && content.characters.length > 0 && (
                        content.characters.map((char) => (
                          <div
                            key={char.id}
                            className="bg-surface/30 border border-white/5 rounded-xl overflow-hidden hover:border-yellow-400/30 transition-all duration-300 group shadow-md"
                          >
                            <div
                              className="relative aspect-square w-full bg-dark-3 flex items-center justify-center text-4xl overflow-hidden"
                              style={{ background: `linear-gradient(135deg, ${color}15, ${color}05)` }}
                            >
                              {char.photo ? (
                                <Image
                                  src={char.photo}
                                  alt={char.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  unoptimized
                                />
                              ) : (
                                <PremiumIcon name="user" size={48} className="opacity-30" />
                              )}
                            </div>
                            <div className="p-3">
                              <p className="text-white text-sm font-bold font-rajdhani">{char.name}</p>
                              {char.nameTe && <p className="font-telugu text-gray-500 text-xs mt-0.5">{char.nameTe}</p>}
                              {char.voiceActor && (
                                <p className="text-yellow-400 text-xs mt-1.5 font-rajdhani flex items-center">
                                  <span className="inline-block mr-1 text-[8px] px-1.5 py-0.5 rounded bg-yellow-400/10 text-yellow-400 font-bold border border-yellow-400/15 leading-none">VOICE</span> {char.voiceActor}
                                </p>
                              )}
                              {char.isMain && (
                                <span className="text-yellow-400 text-[10px] font-bold font-rajdhani mt-1 flex items-center gap-0.5 uppercase tracking-wider">
                                  <PremiumIcon name="star" size={9} /> Main
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* CAST TAB (Visible if cast exists) */}
                  {activeTab === 'Cast' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {content.cast && content.cast.length > 0 && (
                        content.cast.map((member) => (
                          <div
                            key={member.id}
                            className="bg-surface/30 border border-white/5 rounded-xl overflow-hidden hover:border-yellow-400/20 transition-all duration-300 shadow-md"
                          >
                            <div
                              className="relative aspect-square w-full bg-dark-3 flex items-center justify-center text-5xl overflow-hidden"
                              style={{ background: `linear-gradient(135deg, ${color}12, ${color}04)` }}
                            >
                              {member.photo ? (
                                <Image src={member.photo} alt={member.name} fill className="object-cover" unoptimized />
                              ) : (
                                <PremiumIcon name="cast" size={48} className="opacity-30" />
                              )}
                            </div>
                            <div className="p-3">
                              <p className="text-white text-sm font-bold font-rajdhani truncate">{member.name}</p>
                              {member.character && (
                                <p className="text-gray-500 text-xs mt-0.5 font-rajdhani truncate">
                                  as {member.character}
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* REVIEWS TAB (Visible if reviews exist) */}
                  {activeTab === 'Reviews' && (
                    <div className="max-w-3xl space-y-4">
                      {content.reviews && content.reviews.length > 0 && (
                        content.reviews.map((review) => (
                          <div
                            key={review.id}
                            className="bg-surface/30 border border-white/5 rounded-2xl p-5 hover:border-yellow-400/20 transition-all duration-300 backdrop-blur-sm shadow-md"
                          >
                            <div className="flex items-start gap-4 mb-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-black text-sm flex-none">
                                {review.user.displayName.slice(0, 2).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 flex-wrap">
                                  <p className="text-white font-bold font-rajdhani text-sm">
                                    {review.user.displayName}
                                  </p>
                                  <p className="text-gray-600 text-xs">@{review.user.username}</p>
                                  {review.rating && (
                                    <div className="flex gap-0.5">
                                      <RatingStars rating={review.rating} maxRating={10} size="sm" />
                                    </div>
                                  )}
                                </div>
                                <p className="text-gray-500 text-xs mt-0.5">{formatDate(review.createdAt)}</p>
                              </div>
                              {review.rating && (
                                <span className="text-yellow-400 font-bold font-cinzel text-lg">{review.rating}</span>
                              )}
                            </div>
                            {review.title && <h4 className="text-white font-bold font-rajdhani mb-2">{review.title}</h4>}
                            <p className="font-telugu text-gray-300 leading-7 text-sm">{review.body}</p>
                            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
                              <button className="text-gray-500 hover:text-yellow-400 text-xs font-rajdhani font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-yellow-400/10 hover:border-yellow-400/20 active:scale-95">
                                <PremiumIcon name="popular" size={12} /> {review.likes} Helpful
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* GALLERY TAB (Visible if screenshots exist) */}
                  {activeTab === 'Gallery' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {content.screenshots && content.screenshots.length > 0 && (
                        content.screenshots.map((ss, i) => (
                          <div
                            key={i}
                            onClick={() => setLightboxIndex(i)}
                            className="relative aspect-video rounded-xl overflow-hidden bg-dark-3 border border-white/10 hover:border-yellow-400/30 transition-all cursor-zoom-in shadow-md"
                          >
                            <Image
                              src={ss}
                              alt={`Screenshot ${i + 1}`}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 768px) 50vw, 33vw"
                              unoptimized
                            />
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* SIMILAR CONTENT RECS TAB */}
                  {activeTab === 'Similar' && (
                    <div>
                      {similar.length > 0 ? (
                        <div
                          className="grid gap-4"
                          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}
                        >
                          {similar.map((item, i) => (
                            <ContentCard key={item.id} content={item} index={i} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-16 font-rajdhani">No similar content found yet.</p>
                      )}
                    </div>
                  )}

                  {/* INFO STATISTICS TAB */}
                  {activeTab === 'Info' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-surface/30 border border-white/5 rounded-2xl p-6 backdrop-blur-md shadow-md">
                        <h3 className="font-cinzel text-base font-bold text-yellow-400 mb-4 flex items-center gap-2.5">
                          <PremiumIcon name="ranking" size={18} /> Statistics
                        </h3>
                        <div className="space-y-3 font-rajdhani text-sm md:text-base">
                          <div className="flex justify-between py-3.5 border-b border-white/5 last:border-0 font-semibold">
                            <span className="text-gray-400">View Count</span>
                            <span className="text-white">{content.viewCount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between py-3.5 border-b border-white/5 last:border-0 font-semibold">
                            <span className="text-gray-400">Popularity Score</span>
                            <span className="text-white">{content.popularityScore.toFixed(1)}</span>
                          </div>
                          <div className="flex justify-between py-3.5 border-b border-white/5 last:border-0 font-semibold">
                            <span className="text-gray-400">Trending Score</span>
                            <span className="text-white">{content.trendingScore.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* MORE LIKE THIS CAROUSEL - PREMIUM SLIDER WITH SIZE LG CARDS, SCALING HOVERS, FADE BORDER */}
            {similar.length > 0 && activeTab === 'Overview' && (
              <div className="mt-10 border-t border-white/5 pt-8">
                <SectionHeader title="More Like This" titleTe="ఇలాంటివి మరిన్ని" icon="similar" />
                <div className="relative group/slider select-none">
                  {/* Left scroll control */}
                  <button 
                    onClick={() => scrollCarousel('left')}
                    className="absolute left-0 top-[40%] -translate-y-1/2 w-11 h-11 rounded-full bg-black/80 border border-white/10 text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 hover:border-yellow-400/40 hover:text-yellow-400 z-30 shadow-[0_4px_20px_rgba(0,0,0,0.6)] font-cinzel text-lg"
                    aria-label="Scroll Left"
                  >
                    ‹
                  </button>

                  <div 
                    ref={carouselRef}
                    className="flex gap-5 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory -webkit-overflow-scrolling-touch scroll-smooth"
                  >
                    {similar.map((item, i) => (
                      <div key={item.id} className="snap-start flex-none transition-transform duration-300 hover:scale-[1.04] hover:-translate-y-1 hover:z-20">
                        <ContentCard content={item} index={i} size="lg" />
                      </div>
                    ))}
                  </div>

                  {/* Right scroll control */}
                  <button 
                    onClick={() => scrollCarousel('right')}
                    className="absolute right-0 top-[40%] -translate-y-1/2 w-11 h-11 rounded-full bg-black/80 border border-white/10 text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 hover:border-yellow-400/40 hover:text-yellow-400 z-30 shadow-[0_4px_20px_rgba(0,0,0,0.6)] font-cinzel text-lg"
                    aria-label="Scroll Right"
                  >
                    ›
                  </button>

                  {/* Cinematic gradient fading overlays */}
                  <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-dark to-transparent pointer-events-none z-10" />
                  <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-dark to-transparent pointer-events-none z-10" />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* CINEMATIC TRAILER MODAL */}
      <AnimatePresence>
        {showTrailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setShowTrailer(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="w-full max-w-4xl aspect-video bg-dark rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.9)] relative mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/60 w-10 h-10 rounded-full flex items-center justify-center transition-colors z-10 hover:scale-105 active:scale-95"
                onClick={() => setShowTrailer(false)}
              >
                ✕
              </button>

              {content.trailer ? (
                <iframe
                  src={getYouTubeEmbedUrl(content.trailer)!}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-400 font-rajdhani">Trailer not available yet</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SCREENSHOTS LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxIndex !== null && content.screenshots && content.screenshots.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] flex items-center justify-center bg-black/95 backdrop-blur-md"
            onClick={() => setLightboxIndex(null)}
          >
            <div
              className="relative w-full max-w-5xl h-full flex flex-col items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl transition-colors z-[410] bg-black/50 w-12 h-12 rounded-full flex items-center justify-center hover:scale-105"
                onClick={() => setLightboxIndex(null)}
              >
                ✕
              </button>

              {/* Main Image Container */}
              <div className="relative w-full h-[70vh] flex items-center justify-center">
                <Image
                  src={content.screenshots[lightboxIndex]}
                  alt={`Screenshot ${lightboxIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                  unoptimized
                />
              </div>

              {/* Image Counter & Title */}
              <div className="mt-4 text-center">
                <p className="text-gray-400 text-sm font-rajdhani uppercase tracking-widest font-bold">
                  Screenshot {lightboxIndex + 1} of {content.screenshots.length}
                </p>
              </div>

              {/* Prev / Next Buttons */}
              {content.screenshots.length > 1 && (
                <>
                  <button
                    className="absolute left-6 text-white/70 hover:text-white text-4xl transition-colors bg-black/50 w-14 h-14 rounded-full flex items-center justify-center hover:scale-105"
                    onClick={() =>
                      setLightboxIndex(
                        (prev) => (prev! - 1 + content.screenshots.length) % content.screenshots.length
                      )
                    }
                  >
                    ‹
                  </button>
                  <button
                    className="absolute right-6 text-white/70 hover:text-white text-4xl transition-colors bg-black/50 w-14 h-14 rounded-full flex items-center justify-center hover:scale-105"
                    onClick={() =>
                      setLightboxIndex((prev) => (prev! + 1) % content.screenshots.length)
                    }
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
