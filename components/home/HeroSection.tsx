'use client'
import { movies } from '@/prisma/data/movies'
import { animes } from '@/prisma/data/animes'
import { series } from '@/prisma/data/series'
import { hollywood } from '@/prisma/data/hollywood'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useStore } from '@/store/useStore'
import { PLACEHOLDER_BACKDROP } from '@/lib/utils'

const OTT_COLORS: Record<string, string> = {
  Netflix: '#E50914',
  Hotstar: '#1B74E4',
  'Prime Video': '#00A8E0',
  Crunchyroll: '#F47521',
  Viki: '#1DA462',
  ZEE5: '#7B2FBE',
  SonyLIV: '#F97316',
  aha: '#FF5000',
  'Sun NXT': '#EF4444',
  'ETV Win': '#EAB308',
}

const OTT_DISPLAY_NAMES: Record<string, string> = {
  NETFLIX: 'Netflix',
  AMAZON_PRIME: 'Prime Video',
  PRIME_VIDEO: 'Prime Video',
  JIO_HOTSTAR: 'JioHotstar',
  HOTSTAR: 'Hotstar',
  ZEE5: 'ZEE5',
  SONY_LIV: 'SonyLIV',
  CRUNCHYROLL: 'Crunchyroll',
  AHA: 'aha',
  SUN_NXT: 'Sun NXT',
  ETV_WIN: 'ETV Win',
}

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

/* ─── Main component ─────────────────────────────────────────────── */
const ALL_CONTENT = [...movies, ...animes, ...series, ...hollywood]
const FLAGSHIP_SLUGS = [
  'rrr',
  'baahubali-2-the-conclusion',
  'kalki-2898-ad',
  'pushpa-the-rule',
  'avengers-endgame',
  'spider-man-no-way-home',
  'loki',
  'one-piece'
]
const CONTENT = FLAGSHIP_SLUGS.map(slug => ALL_CONTENT.find(item => item.slug === slug)).filter(Boolean) as any[]

const SLIDES = CONTENT.map((item, index) => ({
  id: String(index + 1),

  slug: item.slug,

  title: item.title,

  desc: item.description,

  genres: item.genres ?? ['Action'],

  rating: item.imdbRating?.toString() ?? '8.0',

  year: item.year?.toString() ?? '2024',

  runtime: {
    en:
      'runtime' in item && item.runtime
        ? `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}m`
        : `${'totalEpisodes' in item ? item.totalEpisodes : 12} Episodes`,

    te:
      'runtime' in item && item.runtime
        ? `${Math.floor(item.runtime / 60)}గం ${item.runtime % 60}ని`
        : `${'totalEpisodes' in item ? item.totalEpisodes : 12} ఎపిసోడ్స్`,
  },

  type: {
    en:
      item.type === 'ANIME'
        ? 'ANIME'
        : 'MOVIE',

    te:
      item.type === 'ANIME'
        ? 'అనిమే'
        : 'సినిమా',
  },

  badge: getHeroBadge(item),

  ott: item.ottPlatforms 
    ? item.ottPlatforms.map((o: any) => {
        const plat = typeof o === 'string' ? o : o.platform
        return OTT_DISPLAY_NAMES[plat] || plat
      })
    : ['Netflix'],

  dubAvail: item.teluguDubAvail ?? false,

  accentColor:
    item.type === 'ANIME'
      ? '#DC2626'
      : '#E50914',

  glowColor:
    item.type === 'ANIME'
      ? 'rgba(220,38,38,0.30)'
      : 'rgba(229,9,20,0.30)',

  visual: {
    poster: item.banner || item.poster,

    bgPosition: 'center center',
  },

  rawPoster: item.poster,
}))

const SLIDE_DURATION = 7000

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [failedBgs, setFailedBgs] = useState<Record<string, boolean>>({})
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { toggleWatchlist, watchlist, language } = useStore()

  const slide = SLIDES[current]

  useEffect(() => {
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
  }, [slide.id, slide.visual.poster, slide.rawPoster])

  const isTelugu = language === 'te'

  const goTo = useCallback((idx: number, dir: 1 | -1 = 1) => {
    setDirection(dir)
    setCurrent(idx)
  }, [])

  const next  = useCallback(() => goTo((current + 1) % SLIDES.length, 1), [current, goTo])
  const prev_ = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length, -1), [current, goTo])

  /* Auto-advance */
  useEffect(() => {
    if (isPaused) return
    timerRef.current = setTimeout(next, SLIDE_DURATION)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, isPaused, next])

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft')  prev_()
      if (e.key === ' ')          { e.preventDefault(); setIsPaused(p => !p) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev_])

  /* Preload adjacent slide images */
  useEffect(() => {
    [(current + 1) % SLIDES.length, (current - 1 + SLIDES.length) % SLIDES.length].forEach(i => {
      const img = new Image()
      img.src = SLIDES[i].visual.poster
    })
  }, [current])

  /* ── animation variants ── */
  const bgVariants = {
    enter: (dir: number) => ({ opacity: 0, scale: 1.07, x: dir > 0 ? '2.5%' : '-2.5%' }),
    center: {
      opacity: 1, scale: 1, x: '0%',
      transition: { duration: 1.15, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: (dir: number) => ({
      opacity: 0, scale: 0.97, x: dir > 0 ? '-2.5%' : '2.5%',
      transition: { duration: 0.65, ease: [0.55, 0, 1, 0.45] },
    }),
  }

  const contentVariants = {
    enter: (dir: number) => ({ opacity: 0, y: 30, x: dir > 0 ? 24 : -24, filter: 'blur(5px)' }),
    center: {
      opacity: 1, y: 0, x: 0, filter: 'blur(0px)',
      transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.18 },
    },
    exit: (dir: number) => ({
      opacity: 0, y: -14, x: dir > 0 ? -20 : 20, filter: 'blur(4px)',
      transition: { duration: 0.38 },
    }),
  }

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: 'clamp(620px, 100vh, 940px)' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >

      {/* ══════════════════════════════════════════════
          LAYER 1 — Full-bleed cinematic background
      ══════════════════════════════════════════════ */}
      {/* Mobile background (portrait poster) - hidden on md and up */}
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
            backgroundImage: `url(${failedBgs[slide.id + '-mob'] ? PLACEHOLDER_BACKDROP : (slide.rawPoster || slide.visual.poster)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            willChange: 'transform, opacity',
          }}
        />
      </AnimatePresence>

      {/* Desktop background (wide banner) - hidden below md */}
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

      {/* ══════════════════════════════════════════════
          LAYER 2 — Stacked cinematic gradient overlays
      ══════════════════════════════════════════════ */}

      {/* Primary left readability gradient */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(to right, rgba(5,6,12,0.99) 0%, rgba(5,6,12,0.92) 25%, rgba(5,6,12,0.65) 50%, rgba(5,6,12,0.2) 78%, transparent 100%)',
        }}
      />

      {/* Bottom-to-top fade — merges seamlessly into the rest of the page */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
        style={{
          height: '62%',
          background:
            'linear-gradient(to top, rgba(5,6,12,1) 0%, rgba(5,6,12,0.9) 20%, rgba(5,6,12,0.4) 55%, transparent 100%)',
        }}
      />

      {/* Top navbar fade */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none z-10"
        style={{
          height: '220px',
          background: 'linear-gradient(to bottom, rgba(5,6,12,0.85) 0%, rgba(5,6,12,0.3) 60%, transparent 100%)',
        }}
      />

      {/* Accent color atmospheric glow — left side, matches slide */}
      <AnimatePresence>
        <motion.div
          key={`glow-${slide.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `radial-gradient(ellipse 65% 85% at -5% 65%, ${slide.glowColor} 0%, transparent 70%)`,
          }}
        />
      </AnimatePresence>

      {/* Floating cinematic dust particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        <div className="absolute w-1 h-1 rounded-full bg-white/20 animate-float-particle left-[8%] bottom-[12%]" style={{ animationDelay: '0s', animationDuration: '14s' }} />
        <div className="absolute w-[1.5px] h-[1.5px] rounded-full bg-yellow-400/25 animate-float-particle left-[24%] bottom-[22%]" style={{ animationDelay: '3s', animationDuration: '19s' }} />
        <div className="absolute w-2 h-2 rounded-full bg-white/10 animate-float-particle left-[55%] bottom-[8%]" style={{ animationDelay: '1s', animationDuration: '16s' }} />
        <div className="absolute w-1 h-1 rounded-full bg-yellow-400/15 animate-float-particle left-[75%] bottom-[16%]" style={{ animationDelay: '5s', animationDuration: '24s' }} />
        <div className="absolute w-[1.2px] h-[1.2px] rounded-full bg-white/15 animate-float-particle left-[40%] bottom-[28%]" style={{ animationDelay: '7s', animationDuration: '13s' }} />
      </div>

      {/* Cinematic film-grain noise */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay z-10"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'grain\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.82\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23grain)\'/%3E%3C/svg%3E")',
          backgroundSize: '180px',
        }}
      />

      {/* Edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{ boxShadow: 'inset 0 0 240px rgba(5,6,12,0.6)' }}
      />

      {/* ══════════════════════════════════════════════
          LAYER 3 — Text content (left-aligned)
      ══════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="container-tv w-full pb-28 pt-20">
          <div className="max-w-[680px] xl:max-w-[760px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`content-${slide.id}`}
                custom={direction}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.10 }}
                  className="flex items-center gap-3 mb-5"
                >
                  <span
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black font-rajdhani tracking-[0.14em] uppercase"
                    style={{
                      background: `${slide.accentColor}22`,
                      border: `1px solid ${slide.accentColor}55`,
                      color: slide.accentColor,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: slide.accentColor,
                        boxShadow: `0 0 8px ${slide.accentColor}`,
                        animation: 'pulse 2s ease-in-out infinite',
                      }}
                    />
                    {isTelugu ? slide.badge.te : slide.badge.en}
                  </span>
                  <span className="text-[11px] font-bold font-rajdhani tracking-[0.16em] uppercase text-gray-500">
                    {isTelugu ? slide.type.te : slide.type.en}
                  </span>
                </motion.div>

                {/* Telugu subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.17 }}
                  className="font-telugu text-base lg:text-lg font-light mb-2 leading-relaxed"
                  style={{
                    color: `${slide.accentColor}cc`,
                    textShadow: `0 2px 20px ${slide.accentColor}44`,
                  }}
                >
                  {slide.title.te}
                </motion.p>

                {/* Main title */}
                <motion.h1
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="font-cinzel font-black leading-[0.95] mb-5"
                  style={{
                    fontSize: 'clamp(42px, 6vw, 88px)',
                    background: 'linear-gradient(140deg, #ffffff 0%, #FFD700 55%, #FFA500 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: `drop-shadow(0 4px 32px ${slide.accentColor}50)`,
                  }}
                >
                  {isTelugu ? slide.title.te : slide.title.en}
                </motion.h1>

                {/* Rating + meta */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.28 }}
                  className="flex items-center gap-3 mb-4 flex-wrap"
                >
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                    style={{
                      background: 'rgba(255,215,0,0.12)',
                      border: '1px solid rgba(255,215,0,0.28)',
                    }}
                  >
                    <svg className="w-3.5 h-3.5 fill-yellow-400" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-yellow-400 font-black font-cinzel text-sm leading-none">{slide.rating}</span>
                    <span className="text-gray-500 text-xs font-rajdhani">/10</span>
                  </div>

                  <span className="text-gray-600">·</span>
                  <span className="text-gray-200 text-sm font-semibold font-rajdhani">{slide.year}</span>
                  <span className="text-gray-600">·</span>
                  <span className="text-gray-200 text-sm font-semibold font-rajdhani">{isTelugu ? slide.runtime.te : slide.runtime.en}</span>

                  {slide.dubAvail && (
                    <>
                      <span className="text-gray-600">·</span>
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-black font-rajdhani tracking-wide"
                        style={{
                          background: 'rgba(255,215,0,0.12)',
                          border: '1px solid rgba(255,215,0,0.30)',
                          color: '#FFD700',
                        }}
                      >
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                        తె DUB
                      </span>
                    </>
                  )}
                </motion.div>

                {/* Genre chips */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.32 }}
                  className="flex items-center gap-2 mb-5 flex-wrap"
                >
                  {slide.genres.map((g: string, i: number) => (
                    <span
                      key={g}
                      className="px-3 py-1 rounded-full text-[11px] font-bold font-rajdhani tracking-wide border"
                      style={{
                        background: i === 0 ? `${slide.accentColor}18` : 'rgba(255,255,255,0.06)',
                        borderColor: i === 0 ? `${slide.accentColor}45` : 'rgba(255,255,255,0.12)',
                        color: i === 0 ? slide.accentColor : '#9CA3AF',
                      }}
                    >
                      {g}
                    </span>
                  ))}
                </motion.div>

                {/* Telugu description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.36 }}
                  className="font-telugu text-gray-200 leading-[1.9] mb-6 line-clamp-3 max-w-[620px]"
                  style={{
                    fontSize: 'clamp(14px, 1.1vw, 16px)',
                    textShadow: '0 1px 12px rgba(0,0,0,0.95)',
                  }}
                >
                  {isTelugu ? slide.desc.te : slide.desc.en}
                </motion.p>

                {/* OTT platforms */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.40 }}
                  className="flex items-center gap-2 mb-7 flex-wrap"
                >
                  <span className="text-gray-600 text-[11px] font-semibold font-rajdhani uppercase tracking-widest">
                    {isTelugu ? 'ఓటీటీలో' : 'Watch on'}
                  </span>
                  {slide.ott.map((platform: string) => (
                    <span
                      key={platform}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold font-rajdhani border"
                      style={{
                        background: `${OTT_COLORS[platform] ?? '#9CA3AF'}18`,
                        borderColor: `${OTT_COLORS[platform] ?? '#9CA3AF'}40`,
                        color: OTT_COLORS[platform] ?? '#9CA3AF',
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: OTT_COLORS[platform] ?? '#9CA3AF' }}
                      />
                      {platform}
                    </span>
                  ))}
                </motion.div>

                {/* CTA buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.44, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="flex gap-4 flex-wrap"
                >
                  {/* Watch Now */}
                  <Link
                    href={`/content/${slide.slug}`}
                    className="group relative flex items-center gap-2.5 px-8 py-4 min-h-[54px] rounded-xl font-cinzel font-bold text-sm tracking-[0.08em] text-white overflow-hidden transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #E50914 0%, #b5000b 100%)',
                      boxShadow: '0 8px 32px rgba(229,9,20,0.45), 0 2px 8px rgba(0,0,0,0.6)',
                    }}
                  >
                    {/* Watch Trailer */}
                    <svg className="w-4 h-4 fill-white flex-none" viewBox="0 0 24 24">
                      <polygon points="10 8 16 12 10 16" fill="currentColor" />
                    </svg>
                    {isTelugu ? 'ట్రైలర్ చూడండి' : 'Watch Trailer'}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.14) 50%, transparent 65%)',
                      }}
                    />
                  </Link>

                  {/* More Details */}
                  <Link
                    href={`/content/${slide.slug}`}
                    className="flex items-center gap-2.5 px-7 py-3.5 min-h-[54px] rounded-xl font-rajdhani font-bold text-sm tracking-[0.08em] text-white border border-white/22 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/12 hover:border-white/35 active:scale-95"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      backdropFilter: 'blur(12px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
                    }}
                  >
                    <svg
                      className="w-4 h-4 opacity-75 flex-none"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {isTelugu ? 'వివరాలు' : 'More Details'}
                  </Link>

                  {/* Watchlist */}
                  <button
                    onClick={() => toggleWatchlist(slide.id)}
                    className={`flex items-center gap-2 px-6 py-3.5 min-h-[54px] rounded-xl font-rajdhani font-bold text-sm tracking-[0.08em] border transition-all duration-300 hover:-translate-y-0.5 active:scale-95 ${
                      watchlist.includes(slide.id)
                        ? 'bg-yellow-500/22 border-yellow-500/55 text-yellow-400'
                        : 'border-white/15 text-gray-200 hover:border-yellow-400/45 hover:text-yellow-400'
                    }`}
                    style={{
                      background: watchlist.includes(slide.id) ? undefined : 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    {watchlist.includes(slide.id) ? (
                      <>
                        <svg className="w-4 h-4 flex-none" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                        {isTelugu ? 'సేవ్ అయింది' : 'Saved'}
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        {isTelugu ? 'వాచ్‌లిస్ట్' : 'Watchlist'}
                      </>
                    )}
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        {/* ══════════════════════════════════════════════
          LAYER 5 — Right vertical dot indicators
      ══════════════════════════════════════════════ */}
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
            {/* Tooltip */}
            <div className="absolute right-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div
                className="rounded-lg px-3 py-1.5 whitespace-nowrap border border-white/10"
                style={{ background: 'rgba(7,8,16,0.94)', backdropFilter: 'blur(12px)' }}
              >
                <p className="text-white text-[11px] font-bold font-rajdhani">
                  {s.title.en}
                </p>
                <p className="text-gray-500 text-[9px] font-rajdhani uppercase tracking-wide">{s.type.en}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
</div>
    </section>
  )
}