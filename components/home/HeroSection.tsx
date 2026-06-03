'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useStore } from '@/store/useStore'
import { PLACEHOLDER_BACKDROP, PLACEHOLDER_POSTER } from '@/lib/utils'
import OttBadge from '@/components/ui/OttBadge'

interface HeroSectionProps {
  slides: any[]
}

const tvPlatforms = ['DISNEY_CHANNEL', 'HUNGAMA_TV', 'CARTOON_NETWORK', 'POGO', 'SONIC', 'NICK', 'SONY_YAY', 'ETV_BAL_BHARAT', 'TV', 'AVAILABLE_ON_TV']

function getHeroBadge(item: any) {
  const isTrendingBacked = (item.popularityScore && item.popularityScore >= 95) || (item.trendingScore && item.trendingScore >= 95)
  if (isTrendingBacked) return { en: 'Trending', te: 'ట్రెండింగ్' }
  if (item.isFeatured) return { en: 'Featured', te: 'ఫీచర్డ్' }
  if (item.imdbRating && item.imdbRating >= 8.2) return { en: "Editor's Pick", te: "ఎడిటర్స్ ఛాయిస్" }
  return { en: 'Recommended', te: 'సిఫార్సు చేయబడింది' }
}

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null
  if (url.includes('youtube.com/embed/')) return url
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : url
}

// Resolution optimizer: replace original with w780/w500 on mobile devices
function getHeroBackdropUrl(url: string, isMobile: boolean) {
  if (!url) return url
  if (isMobile && url.includes('/original/')) {
    return url.replace('/original/', '/w780/')
  }
  return url
}

export default function HeroSection({ slides = [] }: HeroSectionProps) {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [failedBgs, setFailedBgs] = useState<Record<string, boolean>>({})
  const [activeTrailerUrl, setActiveTrailerUrl] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { toggleWatchlist, watchlist, language } = useStore()
  const isTelugu = language === 'te'

  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  // Listen to viewport width to serve optimized lower-res backgrounds
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const rawSlides = slides || []

  const SLIDES = rawSlides.map((item: any) => {
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
        isPremium: s.isPremium,
      }))
    }

    return {
      id: item.id,
      slug: item.slug,
      title: { en: item.titleEnglish, te: item.titleTelugu || item.titleEnglish },
      desc: { en: item.descriptionEnglish, te: item.descriptionTelugu || item.descriptionEnglish },
      genres: (item.genres || []).map((g: any) => g.genre?.name).filter(Boolean),
      rating: item.imdbRating?.toFixed(1) ?? '8.0',
      year: item.year?.toString() ?? '2024',
      runtime: {
        en: item.runtime ? `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}m` : `${item.totalEpisodes || 12} Episodes`,
        te: item.runtime ? `${Math.floor(item.runtime / 60)}గం ${item.runtime % 60}ని` : `${item.totalEpisodes || 12} ఎపిసోడ్స్`,
      },
      type: {
        en: item.type,
        te: item.type === 'ANIME' ? 'అనిమే' : item.type === 'MOVIE' ? 'సినిమా' : 'సిరీస్',
      },
      badge: getHeroBadge(item),
      ott: displayPlatforms,
      dubAvail: item.teluguDubAvail ?? false,
      accentColor: item.type === 'ANIME' ? '#A855F7' : '#FFD700',
      glowColor: item.type === 'ANIME' ? 'rgba(168,85,247,0.25)' : 'rgba(255,215,0,0.15)',
      visual: {
        poster: item.banner || item.poster || PLACEHOLDER_BACKDROP,
        bgPosition: 'center center',
      },
      rawPoster: item.poster || PLACEHOLDER_POSTER,
      trailer: item.trailer,
    }
  })

  const SLIDE_DURATION = 7500
  const slide = SLIDES[current]

  const goTo = useCallback((idx: number, dir: 1 | -1 = 1) => {
    setDirection(dir)
    setCurrent(idx)
  }, [])

  const next = useCallback(() => {
    if (SLIDES.length > 0) goTo((current + 1) % SLIDES.length, 1)
  }, [current, goTo, SLIDES.length])

  const prev_ = useCallback(() => {
    if (SLIDES.length > 0) goTo((current - 1 + SLIDES.length) % SLIDES.length, -1)
  }, [current, goTo, SLIDES.length])

  // Touch handlers for responsive swipes
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const diff = touchStartX.current - touchEndX.current
    const threshold = 60
    if (diff > threshold) {
      next()
    } else if (diff < -threshold) {
      prev_()
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  useEffect(() => {
    if (isPaused || SLIDES.length <= 1) return
    timerRef.current = setTimeout(next, SLIDE_DURATION)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, isPaused, next, SLIDES.length])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev_()
      if (e.key === ' ') { e.preventDefault(); setIsPaused(p => !p) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev_])

  if (SLIDES.length === 0 || !slide) {
    return <div className="bg-dark" style={{ height: 'clamp(620px, 100vh, 940px)' }} />
  }

  // Animation variants optimized for high performance: no translations/scales on mobile background
  const bgVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: isMobile ? 1 : 1.04,
      x: isMobile ? 0 : (dir > 0 ? '0.8%' : '-0.8%')
    }),
    center: {
      opacity: 1,
      scale: 1,
      x: '0%',
      transition: { duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    exit: (dir: number) => ({
      opacity: 0,
      scale: isMobile ? 1 : 0.98,
      x: isMobile ? 0 : (dir > 0 ? '-0.8%' : '0.8%'),
      transition: { duration: 0.5, ease: [0.55, 0, 1, 0.45] }
    }),
  }

  // Optimized content animation (no blur filters to prevent layout calculations)
  const contentVariants = {
    enter: { opacity: 0, y: 15 },
    center: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.08 }
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.22 } },
  }

  const deskImgUrl = getHeroBackdropUrl(slide.visual.poster, isMobile)
  const mobImgUrl = getHeroBackdropUrl(slide.rawPoster || slide.visual.poster, isMobile)

  return (
    <section
      className="relative overflow-hidden bg-dark select-none"
      style={{ height: 'clamp(620px, 100vh, 940px)' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Mobile background */}
      <AnimatePresence mode="sync" custom={direction}>
        <motion.div
          key={`bg-mobile-${slide.id}`}
          custom={direction}
          variants={bgVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 md:hidden z-0"
          style={{ willChange: 'opacity' }}
        >
          <Image
            src={failedBgs[slide.id + '-mob'] ? PLACEHOLDER_BACKDROP : mobImgUrl}
            alt=""
            fill
            priority={current === 0}
            sizes="100vw"
            quality={65}
            className="object-cover"
            onError={() => setFailedBgs(prev => ({ ...prev, [slide.id + '-mob']: true }))}
          />
        </motion.div>
      </AnimatePresence>

      {/* Desktop background */}
      <AnimatePresence mode="sync" custom={direction}>
        <motion.div
          key={`bg-desktop-${slide.id}`}
          custom={direction}
          variants={bgVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 hidden md:block z-0"
          style={{ willChange: 'transform, opacity' }}
        >
          <Image
            src={failedBgs[slide.id + '-desk'] ? PLACEHOLDER_BACKDROP : deskImgUrl}
            alt=""
            fill
            priority={current === 0}
            sizes="100vw"
            quality={80}
            className="object-cover"
            style={{ objectPosition: slide.visual.bgPosition }}
            onError={() => setFailedBgs(prev => ({ ...prev, [slide.id + '-desk']: true }))}
          />
        </motion.div>
      </AnimatePresence>

      {/* Left readability gradient (desktop) — seam-free */}
      <div
        className="absolute inset-0 pointer-events-none z-10 hidden md:block"
        style={{
          background: 'linear-gradient(to right, #070810 0%, rgba(7,8,16,0.94) 28%, rgba(7,8,16,0.65) 55%, rgba(7,8,16,0.15) 80%, rgba(7,8,16,0) 100%)',
        }}
      />
      {/* Mobile vertical gradient — seam-free */}
      <div
        className="absolute inset-0 pointer-events-none z-10 md:hidden"
        style={{
          background: 'linear-gradient(to top, #070810 0%, rgba(7,8,16,0.88) 40%, rgba(7,8,16,0.5) 65%, rgba(7,8,16,0) 100%)',
        }}
      />

      {/* Bottom blend into page body — seam-free with pixel overlap to avoid rendering artifacts */}
      <div
        className="absolute bottom-[-2px] left-0 right-0 pointer-events-none z-10"
        style={{
          height: '28%',
          background: 'linear-gradient(to top, #070810 0%, rgba(7,8,16,0.7) 45%, rgba(7,8,16,0) 100%)',
        }}
      />

      {/* Ambient accent glow */}
      <AnimatePresence>
        <motion.div
          key={`glow-${slide.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `radial-gradient(ellipse 55% 75% at -5% 60%, ${slide.glowColor} 0%, rgba(7,8,16,0) 70%)`,
          }}
        />
      </AnimatePresence>

      {/* Film grain noise */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-10"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'grain\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.82\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23grain)\'/%3E%3C/svg%3E")',
          backgroundSize: '180px',
        }}
      />

      {/* CONTENT — sits directly over backdrop, NO glass card */}
      <div className="absolute inset-0 z-20 flex items-end md:items-center">
        <div className="container-tv w-full pb-28 md:pb-32 pt-32 md:pt-40">
          <div className="max-w-[660px] xl:max-w-[740px] relative">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`content-${slide.id}`}
                custom={direction}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="relative z-10 hero-content-text"
              >
                {/* Badge row */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 }}
                  className="flex items-center gap-3 mb-3"
                >
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black tracking-[0.12em] uppercase"
                    style={{
                      background: `${slide.accentColor}15`,
                      borderColor: `${slide.accentColor}40`,
                      color: slide.accentColor,
                      border: `1px solid ${slide.accentColor}40`,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: slide.accentColor, boxShadow: `0 0 8px ${slide.accentColor}` }}
                    />
                    {isTelugu ? slide.badge.te : slide.badge.en}
                  </span>
                  <span className="text-[9px] font-extrabold tracking-[0.14em] uppercase text-gray-400">
                    {isTelugu ? slide.type.te : slide.type.en}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="font-cinzel font-black leading-[1.08] mb-4 tracking-wide"
                  style={{
                    fontSize: 'clamp(30px, 5vw, 64px)',
                    background: 'linear-gradient(135deg, #ffffff 0%, #FFF5CC 40%, #FFD700 70%, #FFA500 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.8))',
                  }}
                >
                  {isTelugu ? slide.title.te : slide.title.en}
                </motion.h1>

                {/* Meta row */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="flex items-center gap-3 mb-4 text-xs font-semibold text-gray-300 flex-wrap"
                >
                  {/* IMDb Rating */}
                  <span className="flex items-center gap-1 bg-yellow-400/10 border border-yellow-400/20 rounded-lg px-2 py-0.5">
                    <svg className="w-3 h-3 fill-yellow-400" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-yellow-400 font-extrabold font-cinzel text-[11px]">{slide.rating}</span>
                  </span>
                  <span className="text-white/15">•</span>
                  <span>{slide.year}</span>
                  <span className="text-white/15">•</span>
                  <span>{isTelugu ? slide.runtime.te : slide.runtime.en}</span>
                  {slide.dubAvail && (
                    <>
                      <span className="text-white/15">•</span>
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
                  transition={{ delay: 0.18 }}
                  className="flex items-center gap-2 mb-4 flex-wrap"
                >
                  {slide.genres.slice(0, 4).map((g: string, i: number) => (
                    <span
                      key={g}
                      className="px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider border uppercase"
                      style={{
                        background: i === 0 ? `${slide.accentColor}12` : 'rgba(255,255,255,0.03)',
                        borderColor: i === 0 ? `${slide.accentColor}25` : 'rgba(255,255,255,0.08)',
                        color: i === 0 ? slide.accentColor : '#9CA3AF',
                      }}
                    >
                      {g}
                    </span>
                  ))}
                </motion.div>

                {/* OTT Availability */}
                {slide.ott && slide.ott.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2 mb-5"
                  >
                    <span className="text-gray-500 text-[9px] font-extrabold uppercase tracking-widest">
                      {isTelugu ? 'ఇందులో:' : 'On:'}
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

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.22 }}
                  className="text-gray-400 leading-relaxed mb-7 line-clamp-3 max-w-[580px] text-[13px] md:text-sm font-medium"
                >
                  {isTelugu ? slide.desc.te : slide.desc.en}
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="flex gap-3 flex-wrap"
                >
                  <button
                    onClick={() => { if (slide.trailer) setActiveTrailerUrl(slide.trailer) }}
                    disabled={!slide.trailer}
                    className={`group relative flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-cinzel font-bold text-[13px] tracking-[0.06em] text-black overflow-hidden transition-all duration-300 active:scale-95 ${!slide.trailer ? 'opacity-50 cursor-not-allowed bg-gray-600' : 'hover:-translate-y-0.5'}`}
                    style={{
                      background: slide.trailer ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' : undefined,
                      boxShadow: slide.trailer ? '0 6px 24px rgba(255,215,0,0.3), 0 2px 4px rgba(0,0,0,0.3)' : 'none',
                    }}
                  >
                    <svg className="w-4 h-4 fill-black flex-none" viewBox="0 0 24 24">
                      <polygon points="8 5 19 12 8 19" />
                    </svg>
                    {isTelugu ? 'ట్రైలర్ చూడండి' : 'Watch Trailer'}
                    {slide.trailer && (
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)' }}
                      />
                    )}
                  </button>

                  <Link
                    href={`/content/${slide.slug}`}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-rajdhani font-bold text-[13px] tracking-[0.06em] text-white border border-white/10 hover:border-white/25 bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                  >
                    <svg className="w-4 h-4 text-gray-400 flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {isTelugu ? 'పూర్తి వివరాలు' : 'More Details'}
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slide indicators */}
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
              <div className="absolute right-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div
                  className="rounded-lg px-3 py-1.5 border border-white/10"
                  style={{ background: 'rgba(7,8,16,0.96)', backdropFilter: 'blur(12px)' }}
                >
                  <p className="text-white text-[11px] font-bold font-rajdhani whitespace-nowrap">{s.title.en}</p>
                  <p className="text-gray-500 text-[9px] font-rajdhani uppercase tracking-wider">{s.type.en}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Trailer Modal */}
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
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
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