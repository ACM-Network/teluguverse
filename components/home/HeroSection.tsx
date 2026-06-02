'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useStore } from '@/store/useStore'
import { PLACEHOLDER_BACKDROP, PLACEHOLDER_POSTER } from '@/lib/utils'
import OttBadge from '@/components/ui/OttBadge'

interface HeroSectionProps {
  slides: any[]
}

const tvPlatforms = ['DISNEY_CHANNEL', 'HUNGAMA_TV', 'CARTOON_NETWORK', 'POGO', 'SONIC', 'NICK', 'SONY_YAY', 'ETV_BAL_BHARAT', 'TV', 'AVAILABLE_ON_TV']

function getHeroBadge(item: any) {
  const isTrendingBacked = (item.popularityScore && item.popularityScore >= 95) || (item.trendingScore && item.trendingScore >= 95)
  if (isTrendingBacked) {
    return { en: 'Trending', te: 'ట్రెండింగ్' }
  }
  if (item.isFeatured) {
    return { en: 'Featured', te: 'ఫీచర్డ్' }
  }
  if (item.imdbRating && item.imdbRating >= 8.2) {
    return { en: "Editor's Pick", te: "ఎడిటర్స్ ఛాయిస్" }
  }
  return { en: 'Recommended', te: 'సిఫార్సు చేయబడింది' }
}

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null
  if (url.includes('youtube.com/embed/')) return url
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : url
}

export default function HeroSection({ slides = [] }: HeroSectionProps) {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [failedBgs, setFailedBgs] = useState<Record<string, boolean>>({})
  const [activeTrailerUrl, setActiveTrailerUrl] = useState<string | null>(null)
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { toggleWatchlist, watchlist, language } = useStore()
  const isTelugu = language === 'te'

  const rawSlides = slides || []
  
  const SLIDES = rawSlides.map((item: any, index: number) => {
    // Determine availability rendering
    const ottLinks = (item.streamingLinks || []).filter((s: any) => !tvPlatforms.includes(s.platform.toUpperCase()))
    const tvLinks = (item.streamingLinks || []).filter((s: any) => tvPlatforms.includes(s.platform.toUpperCase()))
    
    let displayPlatforms: { platform: string; isTeluguDub: boolean; isTeluguSub: boolean; url?: string | null; isPremium: boolean }[] = []
    
    if (ottLinks.length === 0 && tvLinks.length > 0) {
      displayPlatforms = [{ platform: 'TV', isTeluguDub: item.teluguDubAvail, isTeluguSub: false, url: null, isPremium: false }]
    } else {
      displayPlatforms = (item.streamingLinks || []).map((s: any) => ({
        platform: s.platform,
        isTeluguDub: s.isTeluguDub || item.teluguDubAvail,
        isTeluguSub: false,
        url: s.url,
        isPremium: s.isPremium
      }))
    }

    return {
      id: item.id,
      slug: item.slug,
      title: {
        en: item.titleEnglish,
        te: item.titleTelugu || item.titleEnglish
      },
      desc: {
        en: item.descriptionEnglish,
        te: item.descriptionTelugu || item.descriptionEnglish
      },
      genres: (item.genres || []).map((g: any) => g.genre?.name).filter(Boolean),
      rating: item.imdbRating?.toFixed(1) ?? '8.0',
      year: item.year?.toString() ?? '2024',
      runtime: {
        en: item.runtime ? `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}m` : `${item.totalEpisodes || 12} Episodes`,
        te: item.runtime ? `${Math.floor(item.runtime / 60)}గం ${item.runtime % 60}ని` : `${item.totalEpisodes || 12} ఎపిసోడ్స్`
      },
      type: {
        en: item.type,
        te: item.type === 'ANIME' ? 'అనిమే' : item.type === 'MOVIE' ? 'సినిమా' : 'సిరీస్'
      },
      badge: getHeroBadge(item),
      ott: displayPlatforms,
      dubAvail: item.teluguDubAvail ?? false,
      accentColor: item.type === 'ANIME' ? '#DC2626' : '#FFD700',
      glowColor: item.type === 'ANIME' ? 'rgba(220,38,38,0.25)' : 'rgba(255,215,0,0.20)',
      visual: {
        poster: item.banner || item.poster || PLACEHOLDER_BACKDROP,
        bgPosition: 'center center',
      },
      rawPoster: item.poster || PLACEHOLDER_POSTER,
      trailer: item.trailer
    }
  })

  const SLIDE_DURATION = 7500
  const slide = SLIDES[current]

  useEffect(() => {
    if (!slide) return
    if (typeof window === 'undefined') return
    
    // Desktop preloader
    const imgDesk = new window.Image()
    imgDesk.src = slide.visual.poster
    imgDesk.onerror = () => {
      setFailedBgs(prev => ({ ...prev, [slide.id + '-desk']: true }))
    }
    
    // Mobile preloader
    const imgMob = new window.Image()
    imgMob.src = slide.rawPoster || slide.visual.poster
    imgMob.onerror = () => {
      setFailedBgs(prev => ({ ...prev, [slide.id + '-mob']: true }))
    }
  }, [slide?.id, slide?.visual.poster, slide?.rawPoster])

  const goTo = useCallback((idx: number, dir: 1 | -1 = 1) => {
    setDirection(dir)
    setCurrent(idx)
  }, [])

  const next = useCallback(() => {
    if (SLIDES.length > 0) {
      goTo((current + 1) % SLIDES.length, 1)
    }
  }, [current, goTo, SLIDES.length])

  const prev_ = useCallback(() => {
    if (SLIDES.length > 0) {
      goTo((current - 1 + SLIDES.length) % SLIDES.length, -1)
    }
  }, [current, goTo, SLIDES.length])

  // Auto-advance
  useEffect(() => {
    if (isPaused || SLIDES.length <= 1) return
    timerRef.current = setTimeout(next, SLIDE_DURATION)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, isPaused, next, SLIDES.length])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev_()
      if (e.key === ' ') { 
        e.preventDefault()
        setIsPaused(p => !p) 
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev_])

  // Preload adjacent slides
  useEffect(() => {
    if (SLIDES.length <= 1) return
    [(current + 1) % SLIDES.length, (current - 1 + SLIDES.length) % SLIDES.length].forEach(i => {
      if (SLIDES[i]) {
        const img = new Image()
        img.src = SLIDES[i].visual.poster
      }
    })
  }, [current, SLIDES])

  if (SLIDES.length === 0 || !slide) {
    return <div className="bg-dark" style={{ height: 'clamp(620px, 100vh, 940px)' }} />
  }

  const bgVariants = {
    enter: (dir: number) => ({ opacity: 0, scale: 1.05, x: dir > 0 ? '1%' : '-1%' }),
    center: {
      opacity: 1, scale: 1, x: '0%',
      transition: { duration: 0.95, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: (dir: number) => ({
      opacity: 0, scale: 0.98, x: dir > 0 ? '-1%' : '1%',
      transition: { duration: 0.55, ease: [0.55, 0, 1, 0.45] },
    }),
  }

  const contentVariants = {
    enter: (dir: number) => ({ opacity: 0, y: 25, filter: 'blur(4px)' }),
    center: {
      opacity: 1, y: 0, filter: 'blur(0px)',
      transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 },
    },
    exit: (dir: number) => ({
      opacity: 0, y: -12, filter: 'blur(3px)',
      transition: { duration: 0.30 },
    }),
  }

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: 'clamp(620px, 100vh, 940px)' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* BACKGROUND GRAPHICS */}
      {/* Mobile background (portrait poster centered) */}
      <AnimatePresence mode="sync" custom={direction}>
        <motion.div
          key={`bg-mobile-${slide.id}`}
          custom={direction}
          variants={bgVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 md:hidden"
          style={{
            backgroundImage: `url(${failedBgs[slide.id + '-mob'] ? PLACEHOLDER_BACKDROP : slide.rawPoster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            willChange: 'transform, opacity',
          }}
        />
      </AnimatePresence>

      {/* Desktop background (wide banner) */}
      <AnimatePresence mode="sync" custom={direction}>
        <motion.div
          key={`bg-desktop-${slide.id}`}
          custom={direction}
          variants={bgVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 hidden md:block"
          style={{
            backgroundImage: `url(${failedBgs[slide.id + '-desk'] ? PLACEHOLDER_BACKDROP : slide.visual.poster})`,
            backgroundSize: 'cover',
            backgroundPosition: slide.visual.bgPosition,
            backgroundRepeat: 'no-repeat',
            willChange: 'transform, opacity',
          }}
        />
      </AnimatePresence>

      {/* OVERLAYS */}
      {/* Left side readability gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 hidden md:block"
        style={{
          background: 'linear-gradient(to right, rgba(5,6,12,0.99) 0%, rgba(5,6,12,0.95) 30%, rgba(5,6,12,0.70) 55%, rgba(5,6,12,0.2) 80%, transparent 100%)',
        }}
      />
      {/* Mobile vertical layout gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 md:hidden"
        style={{
          background: 'linear-gradient(to top, rgba(5,6,12,1) 0%, rgba(5,6,12,0.85) 45%, rgba(5,6,12,0.5) 70%, rgba(5,6,12,0.2) 100%)',
        }}
      />

      {/* Bottom transition gradient to body */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
        style={{
          height: '24%',
          background: 'linear-gradient(to top, rgba(7,8,16,1) 0%, rgba(7,8,16,0.6) 50%, transparent 100%)',
        }}
      />

      {/* Ambient glow matching slide's type/accent */}
      <AnimatePresence>
        <motion.div
          key={`glow-${slide.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `radial-gradient(ellipse 60% 80% at -5% 60%, ${slide.glowColor} 0%, transparent 70%)`,
          }}
        />
      </AnimatePresence>

      {/* Film grain noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-10"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'grain\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.82\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23grain)\'/%3E%3C/svg%3E")',
          backgroundSize: '180px',
        }}
      />

      {/* CONTENT ROW */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="container-tv w-full pb-20 pt-24 md:pb-28">
          <div className="max-w-[660px] xl:max-w-[740px] bg-[#070810]/75 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-[6px] shadow-[0_12px_45px_rgba(0,0,0,0.8)] relative overflow-hidden">
            {/* Absolute Ambient subtle color tint card backing */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ background: `radial-gradient(circle at top left, ${slide.accentColor}, transparent)` }} />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`content-${slide.id}`}
                custom={direction}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="relative z-10"
              >
                {/* Floating/Inline IMDb badge */}
                <div className="absolute top-0 right-0 flex items-center gap-1 bg-yellow-400/10 border border-yellow-400/20 rounded-lg px-2.5 py-1 text-xs">
                  <svg className="w-3.5 h-3.5 fill-yellow-400" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-yellow-400 font-extrabold font-cinzel text-xs leading-none">{slide.rating}</span>
                </div>

                {/* Badge Panel */}
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-3 mb-3"
                >
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black tracking-[0.12em] uppercase bg-white/5 border border-white/10"
                    style={{
                      background: `${slide.accentColor}15`,
                      borderColor: `${slide.accentColor}40`,
                      color: slide.accentColor,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: slide.accentColor,
                        boxShadow: `0 0 8px ${slide.accentColor}`,
                      }}
                    />
                    {isTelugu ? slide.badge.te : slide.badge.en}
                  </span>
                  <span className="text-[9px] font-extrabold tracking-[0.14em] uppercase text-gray-400">
                    {isTelugu ? slide.type.te : slide.type.en}
                  </span>
                </motion.div>

                {/* OTT/TV Availability Badges at the top */}
                {slide.ott && slide.ott.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="flex items-center gap-2 mb-4"
                  >
                    <span className="text-gray-500 text-[9px] font-extrabold uppercase tracking-widest">
                      {isTelugu ? 'ఇందులో లభ్యం:' : 'Available on:'}
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                      {slide.ott.map((item: any) => (
                        <OttBadge
                          key={item.platform}
                          platform={item.platform}
                          isTeluguDub={item.isTeluguDub}
                          isTeluguSub={item.isTeluguSub}
                          url={item.url}
                          isPremium={item.isPremium}
                          hidePrefix={true}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Main title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="font-cinzel font-black leading-[1.1] mb-4 tracking-wide text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
                  style={{
                    fontSize: 'clamp(28px, 4.8vw, 60px)',
                    background: 'linear-gradient(135deg, #ffffff 0%, #FFF5CC 40%, #FFD700 70%, #FFA500 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {isTelugu ? slide.title.te : slide.title.en}
                </motion.h1>

                {/* Meta info panel (clean, solid borderless row) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="flex items-center gap-3.5 mb-4 text-xs font-semibold text-gray-300 flex-wrap"
                >
                  <span>{slide.year}</span>
                  <span className="text-white/10">•</span>
                  <span>{isTelugu ? slide.runtime.te : slide.runtime.en}</span>

                  {slide.dubAvail && (
                    <>
                      <span className="text-white/10">•</span>
                      <span className="inline-flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[9px] font-black px-2 py-0.5 rounded">
                        తె DUB
                      </span>
                    </>
                  )}
                </motion.div>

                {/* Genres */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 mb-4 flex-wrap"
                >
                  {slide.genres.map((g: string, i: number) => (
                    <span
                      key={g}
                      className="px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider border uppercase"
                      style={{
                        background: i === 0 ? `${slide.accentColor}12` : 'rgba(255,255,255,0.02)',
                        borderColor: i === 0 ? `${slide.accentColor}25` : 'rgba(255,255,255,0.06)',
                        color: i === 0 ? slide.accentColor : '#9CA3AF',
                      }}
                    >
                      {g}
                    </span>
                  ))}
                </motion.div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="text-gray-400 leading-relaxed mb-6 line-clamp-3 max-w-[600px] text-xs md:text-sm font-medium"
                >
                  {isTelugu ? slide.desc.te : slide.desc.en}
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="flex gap-3 flex-wrap"
                >
                  {/* Watch Trailer CTA */}
                  <button
                    onClick={() => {
                      if (slide.trailer) {
                        setActiveTrailerUrl(slide.trailer)
                      }
                    }}
                    disabled={!slide.trailer}
                    className={`group relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-cinzel font-bold text-xs tracking-[0.08em] text-black overflow-hidden transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${!slide.trailer ? 'opacity-50 cursor-not-allowed bg-gray-600' : ''}`}
                    style={{
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                      boxShadow: slide.trailer ? '0 6px 20px rgba(255,215,0,0.25), 0 2px 4px rgba(0,0,0,0.3)' : 'none',
                    }}
                  >
                    <svg className="w-3.5 h-3.5 fill-black flex-none" viewBox="0 0 24 24">
                      <polygon points="8 5 19 12 8 19" />
                    </svg>
                    {isTelugu ? 'ట్రైలర్ చూడండి' : 'Watch Trailer'}
                    {slide.trailer && (
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)',
                        }}
                      />
                    )}
                  </button>

                  {/* More Details */}
                  <Link
                    href={`/content/${slide.slug}`}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-rajdhani font-bold text-xs tracking-[0.08em] text-white border border-white/10 hover:border-white/20 bg-white/[0.03] transition-all duration-300 hover:-translate-y-0.5 active:scale-95 shadow-md"
                  >
                    <svg className="w-3.5 h-3.5 text-gray-400 flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {isTelugu ? 'పూర్తి వివరాలు' : 'More Details'}
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slide Indicators Dot panel */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 z-20 hidden xl:flex flex-col gap-2.5">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              className="relative group flex items-center justify-center w-5"
              aria-label={s.title.en}
            >
              <motion.div
                animate={{
                  height: i === current ? 42 : 10,
                  opacity: i === current ? 1 : 0.28,
                }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-[3px] rounded-full"
                style={{
                  background: i === current
                    ? `linear-gradient(180deg, ${slide.accentColor}, #FFD700)`
                    : '#ffffff',
                  boxShadow: i === current ? `0 0 12px ${slide.accentColor}` : 'none',
                }}
              />
              {/* Slide name tooltip */}
              <div className="absolute right-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div
                  className="rounded-lg px-3 py-1.5 border border-white/10"
                  style={{ background: 'rgba(7,8,16,0.96)', backdropFilter: 'blur(12px)' }}
                >
                  <p className="text-white text-[11px] font-bold font-rajdhani whitespace-nowrap">
                    {s.title.en}
                  </p>
                  <p className="text-gray-500 text-[9px] font-rajdhani uppercase tracking-wider">{s.type.en}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* TRAILER MODAL */}
      <AnimatePresence>
        {activeTrailerUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setActiveTrailerUrl(null)}
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
                onClick={() => setActiveTrailerUrl(null)}
              >
                ✕
              </button>

              <iframe
                src={getYouTubeEmbedUrl(activeTrailerUrl)!}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}