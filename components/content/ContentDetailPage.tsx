'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ContentItem } from '@/types'
import { useStore } from '@/store/useStore'
import { formatRuntime, formatDate, getContentColor, PLACEHOLDER_POSTER, PLACEHOLDER_BACKDROP } from '@/lib/utils'
import OttBadge from '@/components/ui/OttBadge'
import RatingStars from '@/components/ui/RatingStars'
import ContentCard from '@/components/ui/ContentCard'
import SectionHeader from '@/components/ui/SectionHeader'
import PremiumIcon from '@/components/ui/PremiumIcon'
import toast from 'react-hot-toast'

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
        className="w-full flex items-center justify-between p-5 font-cinzel text-sm md:text-base font-bold text-white hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <span>{title}</span>
          {titleTe && <span className="font-telugu text-xs text-gray-400 block sm:inline sm:ml-3 font-normal">{titleTe}</span>}
        </div>
        <svg
          className={`w-3 h-3 text-gray-500 transition-transform duration-300 ml-4 flex-none ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
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

const getUniverseFullName = (id: string): string => {
  const map: Record<string, string> = {
    mcu: 'Marvel Cinematic Universe',
    dc: 'DC Universe',
    lcu: 'Lokesh Cinematic Universe (LCU)',
    baahubali: 'Baahubali Universe',
    monsterverse: 'MonsterVerse',
    onepiece: 'One Piece Storyline'
  }
  return map[id] || 'Cinematic Universe'
}

const getAmbientBg = (slug: string, universeId?: string) => {
  const s = slug.toLowerCase()
  if (s.includes('kalki')) {
    return 'radial-gradient(circle at 50% 15%, rgba(212,175,55,0.06) 0%, rgba(7,8,16,0) 65%)'
  }
  if (s.includes('loki')) {
    return 'radial-gradient(circle at 50% 15%, rgba(50,205,50,0.05) 0%, rgba(7,8,16,0) 65%)'
  }
  if (s.includes('one-piece') || s.includes('onepiece')) {
    return 'radial-gradient(circle at 50% 15%, rgba(30,144,255,0.06) 0%, rgba(7,8,16,0) 65%)'
  }
  if (s.includes('baahubali')) {
    return 'radial-gradient(circle at 50% 15%, rgba(255,215,0,0.06) 0%, rgba(7,8,16,0) 65%)'
  }
  if (universeId === 'mcu' || s.includes('avengers') || s.includes('iron-man') || s.includes('thor') || s.includes('captain-america')) {
    return 'radial-gradient(circle at 45% 15%, rgba(229,9,20,0.035) 0%, transparent 45%), radial-gradient(circle at 55% 15%, rgba(59,130,246,0.035) 0%, transparent 45%)'
  }
  return 'radial-gradient(circle at 50% 15%, rgba(255,215,0,0.02) 0%, rgba(7,8,16,0) 60%)'
}

export default function ContentDetailPage({ content, similar = [] }: Props) {
  const [activeTab, setActiveTab] = useState('Overview')
  const [userRating, setUserRating] = useState<number | null>(null)
  const [showTrailer, setShowTrailer] = useState(false)
  const [watchedEps, setWatchedEps] = useState<Set<number>>(new Set())
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const castCarouselRef = useRef<HTMLDivElement>(null)

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

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

  const universeConnection = content.universe?.[0]
  let prevItem: any = null
  let nextItem: any = null

  if (universeConnection) {
    const universeItems = universeConnection.universe.contents
    const currentIndex = universeItems.findIndex((item: any) => item.contentId === content.id)
    
    if (currentIndex !== -1) {
      if (currentIndex > 0) {
        prevItem = universeItems[currentIndex - 1].content
      }
      if (currentIndex < universeItems.length - 1) {
        nextItem = universeItems[currentIndex + 1].content
      }
    }
  }

  // Pre-calculate sets for similar content recommendation reasons
  const currentUniverseContentIds = new Set(
    universeConnection?.universe?.contents?.map((c: any) => c.contentId) || []
  )
  const currentDirectorIds = new Set(content.directors?.map(d => d.id) || [])
  const currentGenreIds = new Set(content.genres?.map(g => g.genre.id) || [])

  const getRecommendationReason = (similarItem: any) => {
    if (currentUniverseContentIds.has(similarItem.id)) {
      return 'Same Universe'
    }
    if (similarItem.directors?.some((d: any) => currentDirectorIds.has(d.id))) {
      return 'Same Director'
    }
    const sharedGenre = similarItem.genres?.find((g: any) => currentGenreIds.has(g.genre?.id))
    if (sharedGenre) {
      return sharedGenre.genre.name || 'Similar Genre'
    }
    return 'Related Story'
  }

  return (
    <div className="min-h-screen bg-dark relative overflow-x-hidden">
      
      {/* Dynamic Content-based Ambient Background Glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 transition-all duration-1000"
        style={{
          background: getAmbientBg(content.slug, universeConnection?.universeId),
          height: '1000px',
        }}
      />
      
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
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 -mt-36 md:-mt-52 relative z-10 pb-36 xl:pb-20">
        
        {/* OPTIMIZED GRID: Left poster 220px to give details more space */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 md:gap-10 items-start">
          
          {/* LEFT COLUMN: Poster Card & Glass Sidebar Metadata Panel (Desktop only) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="hidden lg:flex flex-col flex-none w-[220px] sticky top-24"
          >
            {posterSrc && (
              <div
                className="relative w-[220px] h-[330px] rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group cursor-pointer hover:border-white/25 transition-all duration-300 mb-5"
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

            {/* Glass Metadata Panel */}
            <div className="bg-surface/20 border border-white/5 rounded-2xl p-4.5 backdrop-blur-md shadow-2xl space-y-4">
              {/* Genres list */}
              {content.genres && content.genres.length > 0 && (
                <div>
                  <p className="text-gray-500 text-[10px] font-bold font-rajdhani tracking-widest uppercase mb-1.5">
                    Genres
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {content.genres.map((g: any, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded border border-purple-500/20 bg-purple-500/5 text-purple-300 text-[10px] font-semibold font-rajdhani uppercase"
                      >
                        {g.genre?.name || g.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Telugu availability */}
              <div>
                <p className="text-gray-500 text-[10px] font-bold font-rajdhani tracking-widest uppercase mb-1">
                  Audio Availability
                </p>
                <div className="text-xs font-semibold">
                  {content.teluguDubAvail ? (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                      Telugu Dub confirmed
                    </span>
                  ) : (
                    <span className="text-red-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      Telugu Dub unavailable
                    </span>
                  )}
                </div>
              </div>

              {/* Other metadata attributes */}
              <div className="space-y-2 border-t border-white/5 pt-3">
                {content.language && (
                  <div className="flex justify-between text-xs font-rajdhani">
                    <span className="text-gray-500 font-bold uppercase">Language</span>
                    <span className="text-gray-300 font-semibold">{content.language}</span>
                  </div>
                )}
                {content.country && (
                  <div className="flex justify-between text-xs font-rajdhani">
                    <span className="text-gray-500 font-bold uppercase">Country</span>
                    <span className="text-gray-300 font-semibold">{content.country}</span>
                  </div>
                )}
                {content.studio && (
                  <div className="flex flex-col text-xs font-rajdhani gap-0.5">
                    <span className="text-gray-500 font-bold uppercase">Studio</span>
                    <span className="text-gray-300 font-semibold truncate">{content.studio}</span>
                  </div>
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
            {/* UNIFIED TITLE HEADER (Responsive) */}
            <div className="mb-4">
              <div className="flex gap-2 flex-wrap mb-2">
                <span
                  className="px-2.5 py-0.5 rounded text-[10px] font-bold font-rajdhani tracking-wider uppercase"
                  style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}
                >
                  {TYPE_LABELS[content.type]}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-rajdhani tracking-wider uppercase ${
                    content.status === 'COMPLETED'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/25'
                      : content.status === 'ONGOING'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/25'
                      : 'bg-orange-500/10 text-orange-400 border border-orange-500/25'
                  }`}
                >
                  {content.status}
                </span>
                {content.ageRating && (
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-white/5 text-gray-400 border border-white/10 font-rajdhani uppercase">
                    {content.ageRating}
                  </span>
                )}
              </div>

              <h1 className="font-cinzel text-3xl md:text-5xl font-black text-white leading-tight mb-1" style={{ textShadow: '0 2px 25px rgba(0,0,0,0.8)' }}>
                {content.titleEnglish}
              </h1>
              {content.titleTelugu && (
                <p className="font-telugu text-lg md:text-2xl text-yellow-400/90 font-semibold mb-2">{content.titleTelugu}</p>
              )}
              {content.titleOriginal && content.titleOriginal !== content.titleEnglish && (
                <p className="text-gray-500 text-xs font-rajdhani mb-3 italic tracking-wide">{content.titleOriginal}</p>
              )}
            </div>

            {/* PREMIUM QUICK FACTS ROW */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 py-3 border-y border-white/5 mb-6 text-sm font-rajdhani font-semibold text-gray-300">
              {content.imdbRating && (
                <span className="flex items-center gap-1 bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-1 rounded-xl text-yellow-400 font-bold">
                  <svg className="w-3 h-3 fill-yellow-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  {content.imdbRating.toFixed(1)}
                </span>
              )}
              {content.year && (
                <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl">
                  <PremiumIcon name="calendar" size={11} /> {content.year}
                </span>
              )}
              {content.runtime && (
                <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl">
                  <PremiumIcon name="clock" size={11} /> {formatRuntime(content.runtime)}
                </span>
              )}
              {content.genres && content.genres.length > 0 && (
                <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl">
                  <PremiumIcon name="genres" size={11} /> {content.genres.map((g: any) => g.genre?.name || g.name).slice(0, 2).join(', ')}
                </span>
              )}
              {content.teluguDubAvail && (
                <span className="bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-xl text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  తెలుగు Dub
                </span>
              )}
            </div>

            {/* ACTION BUTTONS ROW (Desktop & Mobile) */}
            <div className="flex gap-2.5 flex-wrap mb-6">
              {content.trailer && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-bold font-rajdhani tracking-wider text-white transition-all duration-300 hover:opacity-95 hover:scale-[1.02] shadow-[0_4px_20px_rgba(229,9,20,0.25)] hover:shadow-[0_4px_25px_rgba(229,9,20,0.4)]"
                  style={{
                    background: 'linear-gradient(135deg, #E50914 0%, #B00710 100%)',
                  }}
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><polygon points="8 5 19 12 8 19"/></svg> WATCH TRAILER
                </button>
              )}

              <button
                onClick={() => toggleWatchlist(content.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs md:text-sm font-bold font-rajdhani tracking-wider border transition-all duration-300 hover:scale-[1.02] ${
                  inWatchlist
                    ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:border-yellow-400/35 hover:text-yellow-400'
                }`}
              >
                <PremiumIcon name={inWatchlist ? 'watchlist' : 'list'} size={13} /> {inWatchlist ? 'IN WATCHLIST' : 'WATCHLIST'}
              </button>

              <button
                onClick={() => toggleFavorite(content.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs md:text-sm font-bold font-rajdhani tracking-wider border transition-all duration-300 hover:scale-[1.02] ${
                  isFav
                    ? 'bg-red-500/10 border-red-500/40 text-red-400'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:border-red-400/35 hover:text-red-400'
                }`}
              >
                <PremiumIcon name="favorite" size={13} /> {isFav ? 'FAVORITED' : 'FAVORITE'}
              </button>

              {/* Share button */}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs md:text-sm font-bold font-rajdhani tracking-wider border border-white/10 bg-white/5 text-gray-300 hover:border-blue-400/45 hover:text-blue-400 hover:scale-[1.02] transition-all duration-300"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg> SHARE
              </button>
            </div>

            {/* OTT / TV AVAILABILITY SECTION - w-fit to shrinkwrap content and remove large empty space */}
            {content.streamingLinks && content.streamingLinks.length > 0 && (() => {
              const allAvailable = content.streamingLinks.filter((link) => link.isAvailable);
              const tvChannels = ['DISNEY_CHANNEL', 'HUNGAMA_TV', 'CARTOON_NETWORK', 'POGO', 'SONIC', 'NICK', 'SONY_YAY', 'ETV_BAL_BHARAT', 'TV', 'AVAILABLE_ON_TV'];
              const ottLinks = allAvailable.filter(link => !tvChannels.includes(link.platform.toUpperCase()));
              const tvLinks = allAvailable.filter(link => tvChannels.includes(link.platform.toUpperCase()));

              if (allAvailable.length === 0) return null;

              const showTvOnly = ottLinks.length === 0 && tvLinks.length > 0;

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
                        {showTvOnly ? (
                          <div className="flex-none">
                            <OttBadge
                              platform="TV"
                              isTeluguDub={content.teluguDubAvail}
                              isTeluguSub={content.teluguSubAvail}
                              url={null}
                              isPremium={false}
                            />
                          </div>
                        ) : (
                          tvLinks.map((link) => (
                            <div key={link.id} className="flex-none">
                              <OttBadge
                                platform={link.platform}
                                isTeluguDub={link.isTeluguDub || content.teluguDubAvail}
                                isTeluguSub={content.teluguSubAvail}
                                url={link.url}
                                isPremium={link.isPremium}
                              />
                            </div>
                          ))
                        )}
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
                        ? 'text-white scale-[1.02]' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0.5 left-2 right-2 h-[3px] rounded-full z-10"
                        style={{ background: color, boxShadow: `0 0 12px ${color}80` }}
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

                        {/* Universe Connections Tracker */}
                        {universeConnection && (() => {
                          const uId = universeConnection.universeId;
                          let theme = {
                            border: 'border-purple-500/30',
                            accent: 'text-purple-400',
                            glow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)] border-purple-500',
                            badgeBg: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
                            title: 'Cinematic Universe Timeline',
                            icon: 'universe'
                          };

                          if (uId === 'mcu') {
                            theme = {
                              border: 'border-red-500/30',
                              accent: 'text-red-400',
                              glow: 'shadow-[0_0_25px_rgba(239,68,68,0.25)] border-red-500 bg-red-950/20',
                              badgeBg: 'bg-red-500/15 text-red-400 border border-red-500/20',
                              title: 'Marvel Cinematic Universe (MCU)',
                              icon: 'universe'
                            };
                          } else if (uId === 'lcu') {
                            theme = {
                              border: 'border-amber-600/30',
                              accent: 'text-amber-500',
                              glow: 'shadow-[0_0_25px_rgba(217,119,6,0.25)] border-amber-500 bg-amber-950/20',
                              badgeBg: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
                              title: 'Lokesh Cinematic Universe (LCU)',
                              icon: 'universe'
                            };
                          } else if (uId === 'baahubali') {
                            theme = {
                              border: 'border-yellow-500/30',
                              accent: 'text-yellow-400',
                              glow: 'shadow-[0_0_25px_rgba(234,179,8,0.3)] border-yellow-400 bg-yellow-950/20',
                              badgeBg: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
                              title: 'Baahubali Universe',
                              icon: 'universe'
                            };
                          } else if (uId === 'monsterverse') {
                            theme = {
                              border: 'border-teal-500/30',
                              accent: 'text-teal-400',
                              glow: 'shadow-[0_0_25px_rgba(20,184,166,0.25)] border-teal-500 bg-teal-950/20',
                              badgeBg: 'bg-teal-500/15 text-teal-400 border border-teal-500/20',
                              title: 'MonsterVerse',
                              icon: 'universe'
                            };
                          } else if (uId === 'onepiece') {
                            theme = {
                              border: 'border-sky-500/30',
                              accent: 'text-sky-400',
                              glow: 'shadow-[0_0_25px_rgba(14,165,233,0.25)] border-sky-400 bg-sky-950/20',
                              badgeBg: 'bg-sky-500/15 text-sky-400 border border-sky-500/20',
                              title: 'One Piece Saga',
                              icon: 'universe'
                            };
                          }

                          return (
                            <div className="bg-surface/30 border border-white/5 rounded-2xl p-5 backdrop-blur-md shadow-md">
                              <h3 className="font-cinzel text-xs font-bold text-yellow-400 mb-5 flex items-center gap-2.5 uppercase tracking-wider">
                                <PremiumIcon name={theme.icon} size={16} /> {theme.title} Timeline Navigation
                              </h3>

                              <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
                                
                                {/* Previous Entry Card */}
                                <div className="w-full md:w-[30%]">
                                  {prevItem ? (
                                    <Link href={`/content/${prevItem.slug}`} className={`flex items-center gap-3 p-3 rounded-xl bg-black/40 border ${theme.border} hover:border-yellow-400/40 hover:bg-surface-2 transition-all group text-left h-20`}>
                                      <div className="w-10 h-14 rounded-lg overflow-hidden flex-none border border-white/10 relative aspect-[2/3]">
                                        <img src={prevItem.poster || PLACEHOLDER_POSTER} alt={prevItem.titleEnglish} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-[8px] text-gray-500 font-extrabold uppercase tracking-wider">← Previous</p>
                                        <p className="text-white text-xs font-bold font-rajdhani truncate group-hover:text-yellow-400 transition-colors">{prevItem.titleEnglish}</p>
                                        <p className="text-gray-500 text-[10px] font-rajdhani font-semibold">{prevItem.year}</p>
                                      </div>
                                    </Link>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-black/20 border border-white/5 border-dashed text-gray-600 text-xs font-rajdhani font-bold text-center h-20 uppercase tracking-widest">
                                      Timeline Start
                                    </div>
                                  )}
                                </div>

                                {/* Desktop Horizontal Connection Line / Arrow */}
                                <div className="hidden md:flex flex-1 items-center justify-center">
                                  <div className="h-[2px] flex-1 bg-gradient-to-r from-white/10 to-white/20 relative">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/25 text-[10px]">➔</div>
                                  </div>
                                </div>

                                {/* Current Entry Card (Highlighted) */}
                                <div className="w-full md:w-[36%] z-10">
                                  <div className={`flex items-center gap-3 p-3 rounded-xl bg-black/60 border ${theme.glow} transition-all h-24 transform scale-[1.03]`}>
                                    <div className="w-12 h-18 rounded-lg overflow-hidden flex-none border border-white/20 relative aspect-[2/3]">
                                      <img src={content.poster || PLACEHOLDER_POSTER} alt={content.titleEnglish} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider mb-1 ${theme.badgeBg}`}>
                                        Currently Viewing
                                      </span>
                                      <p className="text-white text-sm font-black font-rajdhani truncate">{content.titleEnglish}</p>
                                      <p className="text-gray-400 text-[10px] font-rajdhani font-semibold">{content.year}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Desktop Horizontal Connection Line / Arrow */}
                                <div className="hidden md:flex flex-1 items-center justify-center">
                                  <div className="h-[2px] flex-1 bg-gradient-to-r from-white/20 to-white/10 relative">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/25 text-[10px]">➔</div>
                                  </div>
                                </div>

                                {/* Next Entry Card */}
                                <div className="w-full md:w-[30%]">
                                  {nextItem ? (
                                    <Link href={`/content/${nextItem.slug}`} className={`flex items-center gap-3 p-3 rounded-xl bg-black/40 border ${theme.border} hover:border-yellow-400/40 hover:bg-surface-2 transition-all group text-left h-20`}>
                                      <div className="w-10 h-14 rounded-lg overflow-hidden flex-none border border-white/10 relative aspect-[2/3]">
                                        <img src={nextItem.poster || PLACEHOLDER_POSTER} alt={nextItem.titleEnglish} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-[8px] text-gray-500 font-extrabold uppercase tracking-wider">Next →</p>
                                        <p className="text-white text-xs font-bold font-rajdhani truncate group-hover:text-yellow-400 transition-colors">{nextItem.titleEnglish}</p>
                                        <p className="text-gray-500 text-[10px] font-rajdhani font-semibold">{nextItem.year}</p>
                                      </div>
                                    </Link>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-black/20 border border-white/5 border-dashed text-gray-600 text-xs font-rajdhani font-bold text-center h-20 uppercase tracking-widest">
                                      Timeline End
                                    </div>
                                  )}
                                </div>

                              </div>
                            </div>
                          );
                        })()}

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
                            <div className="flex items-center justify-between mb-4">
                              <SectionHeader title="Cast & Characters" titleTe="పాత్రలు & నటీనటులు" icon="cast" />
                              {/* Scroll buttons for Cast */}
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => {
                                    if (castCarouselRef.current) {
                                      castCarouselRef.current.scrollBy({ left: -200, behavior: 'smooth' })
                                    }
                                  }}
                                  className="w-8 h-8 rounded-full bg-black/60 border border-white/10 hover:border-yellow-400/40 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 text-xs font-semibold"
                                >
                                  ‹
                                </button>
                                <button 
                                  onClick={() => {
                                    if (castCarouselRef.current) {
                                      castCarouselRef.current.scrollBy({ left: 200, behavior: 'smooth' })
                                    }
                                  }}
                                  className="w-8 h-8 rounded-full bg-black/60 border border-white/10 hover:border-yellow-400/40 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 text-xs font-semibold"
                                >
                                  ›
                                </button>
                              </div>
                            </div>

                            <div 
                              ref={castCarouselRef}
                              className="flex gap-4 overflow-x-auto pb-2.5 scrollbar-none snap-x snap-mandatory scroll-smooth"
                            >
                              {content.type === 'ANIME' && content.characters && content.characters.length > 0
                                ? content.characters.map((char) => (
                                    <motion.div
                                      key={char.id}
                                      whileHover={{ y: -3 }}
                                      className="w-28 flex-none snap-start bg-black/35 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 shadow-md group"
                                    >
                                      <div className="relative aspect-square w-full bg-dark-3 overflow-hidden">
                                        {char.photo ? (
                                          <Image
                                            src={char.photo}
                                            alt={char.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="112px"
                                            unoptimized
                                          />
                                        ) : (
                                          <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                                            <PremiumIcon name="user" size={24} className="opacity-25" />
                                          </div>
                                        )}
                                        {char.isMain && (
                                          <span className="absolute top-1.5 right-1.5 bg-yellow-400 text-black text-[8px] font-bold px-1.5 py-0.5 rounded tracking-wider shadow">
                                            MAIN
                                          </span>
                                        )}
                                      </div>
                                      <div className="p-2.5 min-w-0">
                                        <p className="text-white text-[11px] font-bold font-rajdhani truncate group-hover:text-white transition-colors">{char.name}</p>
                                        <p className="text-gray-500 text-[9px] font-rajdhani truncate leading-none mt-0.5" title={char.voiceActor || ''}>
                                          {char.voiceActor || 'Voice Actor'}
                                        </p>
                                      </div>
                                    </motion.div>
                                  ))
                                : content.cast && content.cast.length > 0
                                ? content.cast.map((member) => (
                                    <motion.div
                                      key={member.id}
                                      whileHover={{ y: -3 }}
                                      className="w-28 flex-none snap-start bg-black/35 border border-white/5 rounded-2xl overflow-hidden hover:border-yellow-400/25 transition-all duration-300 shadow-md group"
                                    >
                                      <div className="relative aspect-square w-full bg-dark-3 overflow-hidden">
                                        {member.photo ? (
                                          <Image
                                            src={member.photo}
                                            alt={member.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="112px"
                                            unoptimized
                                          />
                                        ) : (
                                          <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                                            <PremiumIcon name="cast" size={24} className="opacity-25" />
                                          </div>
                                        )}
                                      </div>
                                      <div className="p-2.5 min-w-0">
                                        <p className="text-white text-[11px] font-bold font-rajdhani truncate group-hover:text-white transition-colors">{member.name}</p>
                                        {member.character && (
                                          <p className="text-gray-500 text-[9px] font-rajdhani truncate leading-none mt-0.5">
                                            as {member.character}
                                          </p>
                                        )}
                                      </div>
                                    </motion.div>
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
                                  className="relative w-64 h-36 flex-none snap-start rounded-xl overflow-hidden bg-dark-3 border border-white/10 hover:border-white/25 transition-all cursor-zoom-in group shadow-lg"
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
                            <ContentCard key={item.id} content={item} index={i} reason={getRecommendationReason(item)} />
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
                        <ContentCard content={item} index={i} size="lg" reason={getRecommendationReason(item)} />
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
      {/* MOBILE BOTTOM STICKY ACTION BAR */}
      <div className="xl:hidden fixed bottom-[72px] left-0 right-0 z-[80] h-[64px] bg-dark-3/95 backdrop-blur-md border-t border-white/5 px-4 flex items-center gap-2 shadow-[0_-8px_24px_rgba(0,0,0,0.6)]">
        {content.trailer && (
          <button
            onClick={() => setShowTrailer(true)}
            className="flex-1 flex items-center justify-center gap-1.5 h-11 rounded-xl text-[10px] font-black font-rajdhani tracking-wider text-white bg-red-600 active:scale-95 transition-all shadow-[0_4px_12px_rgba(220,38,38,0.2)]"
          >
            ▶ TRAILER
          </button>
        )}
        <button
          onClick={() => toggleWatchlist(content.id)}
          className={`flex-1 flex items-center justify-center gap-1.5 h-11 rounded-xl text-[10px] font-black font-rajdhani tracking-wider border active:scale-95 transition-all ${
            inWatchlist
              ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
              : 'bg-white/5 border-white/10 text-gray-300'
          }`}
        >
          {inWatchlist ? '✓ SAVED' : '+ WATCH'}
        </button>
        <button
          onClick={() => toggleFavorite(content.id)}
          className={`flex-1 flex items-center justify-center gap-1.5 h-11 rounded-xl text-[10px] font-black font-rajdhani tracking-wider border active:scale-95 transition-all ${
            isFav
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : 'bg-white/5 border-white/10 text-gray-300'
          }`}
        >
          {isFav ? '♥ FAV' : '♡ FAV'}
        </button>
        <button
          onClick={handleShare}
          className="flex-none w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-gray-300 flex items-center justify-center hover:bg-white/10 hover:border-white/20 active:scale-95 transition-all"
          title="Share"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </button>
      </div>
    </div>
  )
}
