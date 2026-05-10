'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useStore } from '@/store/useStore'

/* ─── Slide data — real poster images, zero emoji ─────────────────── */
const SLIDES = [
  {
    id: '1',
    slug: 'kalki-2898-ad',
    title: 'Kalki 2898 AD',
    titleTe: 'కల్కి 2898 AD',
    desc: 'భవిష్యత్తులో 2898 సంవత్సరంలో ప్రపంచం చీకటి అధికారాల పట్టులో ఉంది. కల్కి అవతారం రావాలని పురాణాలు చెప్తున్నాయి. భైరా అనే యోధుడు ఒక అద్భుతమైన ప్రయాణం చేస్తాడు.',
    genres: ['Sci-Fi', 'Mythology', 'Action'],
    rating: '9.1',
    year: '2024',
    runtime: '3h 1m',
    type: 'TELUGU MOVIE',
    badge: 'Trending #1',
    ott: ['Netflix', 'Hotstar'],
    dubAvail: true,
    accentColor: '#FF6B00',
    glowColor: 'rgba(255,107,0,0.32)',
    visual: {
      poster: 'https://wallpapercave.com/wp/wp15542527.png',
      bgPosition: 'center top',
    },
  },
  {
    id: '2',
    slug: 'attack-on-titan',
    title: 'Attack on Titan',
    titleTe: 'ఎరేన్ యగర్ పోరాటం',
    desc: 'భీమాకార రాక్షసులకు వ్యతిరేకంగా మానవుల చివరి పోరాటం. గోడల లోపల జీవించిన మానవులు స్వేచ్ఛ కోసం ప్రాణాలు పణంగా పెడతారు. ఎరేన్ యొక్క నిజమైన లక్ష్యం ఏమిటి?',
    genres: ['Action', 'Dark Fantasy', 'Post-Apocalyptic'],
    rating: '9.0',
    year: '2013–2023',
    runtime: '94 Episodes',
    type: 'ANIME',
    badge: 'Top Rated',
    ott: ['Crunchyroll', 'Netflix'],
    dubAvail: true,
    accentColor: '#DC2626',
    glowColor: 'rgba(220,38,38,0.32)',
    visual: {
      poster: 'https://wallpapercave.com/wp/wp8115145.png',
      bgPosition: 'center center',
    },
  },
  {
    id: '3',
    slug: 'squid-game',
    title: 'Squid Game',
    titleTe: 'స్క్విడ్ గేమ్',
    desc: 'ఆర్థిక ఇబ్బందులతో ఉన్న వ్యక్తులు ఒక రహస్య మరణ ఆటలో పాల్గొంటారు. గెలుపు అంటే కోట్ల రూపాయలు — ఓటమి అంటే మరణం. ఈ ఆట ఆపగలరా?',
    genres: ['Thriller', 'Drama', 'Survival'],
    rating: '8.7',
    year: '2021–2024',
    runtime: 'S2: 7 Episodes',
    type: 'K-DRAMA',
    badge: 'Global Hit',
    ott: ['Netflix'],
    dubAvail: true,
    accentColor: '#EC4899',
    glowColor: 'rgba(236,72,153,0.30)',
    visual: {
      poster: 'https://images6.alphacoders.com/119/1191374.jpg',
      bgPosition: 'center center',
    },
  },
  {
    id: '4',
    slug: 'pushpa-the-rule',
    title: 'Pushpa: The Rule',
    titleTe: 'పుష్ప: ది రూల్',
    desc: 'పుష్పరాజ్ సామ్రాజ్యం మరింత విస్తరిస్తోంది. శంకర్ IPS తో తీవ్రమైన ఘర్షణ, ప్రేమ మరియు అధికారం మధ్య సంఘర్షణ. "పుష్ప నేల మీద ఉన్నా — జ్వాలలు రేపుతాడు!"',
    genres: ['Action', 'Crime', 'Drama'],
    rating: '8.5',
    year: '2024',
    runtime: '3h 20m',
    type: 'TELUGU MOVIE',
    badge: 'Blockbuster',
    ott: ['Amazon Prime'],
    dubAvail: true,
    accentColor: '#EF4444',
    glowColor: 'rgba(239,68,68,0.30)',
    visual: {
      poster: 'https://4kwallpapers.com/images/walls/thumbs_3t/17953.jpg',
      bgPosition: 'center 20%',
    },
  },
  {
    id: '5',
    slug: 'goblin',
    title: 'Goblin',
    titleTe: 'గాబ్లిన్: ది లోన్లీ గాడ్',
    desc: '930 సంవత్సరాల అమరత్వం పొందిన మంత్రగాడు తన జీవితాన్ని ముగించే "కంచె" కోసం వెతుకుతాడు. ఆ కంచె ఒక యువతి — ప్రేమ మరియు విధి యొక్క అద్భుతమైన కలయిక.',
    genres: ['Fantasy', 'Romance', 'Supernatural'],
    rating: '8.9',
    year: '2016–2017',
    runtime: '16 Episodes',
    type: 'K-DRAMA',
    badge: 'Fan Favorite',
    ott: ['Netflix', 'Viki'],
    dubAvail: true,
    accentColor: '#7C3AED',
    glowColor: 'rgba(124,58,237,0.30)',
    visual: {
      poster: 'https://wallpapercave.com/wp/wp5709960.jpg',
      bgPosition: 'center top',
    },
  },
]

const OTT_COLORS: Record<string, string> = {
  Netflix: '#E50914',
  Hotstar: '#1B74E4',
  'Amazon Prime': '#00A8E0',
  Crunchyroll: '#F47521',
  Viki: '#1DA462',
  ZEE5: '#7B2FBE',
}

/* ─── Slide progress bar ─────────────────────────────────────────── */
function ProgressBar({
  active,
  duration,
  paused,
  color,
}: {
  active: boolean
  duration: number
  paused: boolean
  color: string
}) {
  return (
    <div className="h-[3px] w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
      {active && (
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, #FFD700)` }}
          initial={{ width: '0%' }}
          animate={{ width: paused ? undefined : '100%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      )}
    </div>
  )
}

/* ─── Poster thumbnail card ──────────────────────────────────────── */
function ThumbCard({
  slide,
  active,
  onClick,
}: {
  slide: (typeof SLIDES)[0]
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex-none rounded-xl overflow-hidden border-2 transition-all duration-300 group"
      style={{
        width: 'clamp(100px, 9vw, 136px)',
        height: '72px',
        borderColor: active ? `${slide.accentColor}CC` : 'rgba(255,255,255,0.10)',
        transform: active ? 'scale(1.06)' : 'scale(1)',
        boxShadow: active ? `0 0 22px ${slide.accentColor}55, 0 4px 20px rgba(0,0,0,0.6)` : '0 2px 12px rgba(0,0,0,0.4)',
      }}
    >
      {/* Poster image */}
      <img
        src={slide.visual.poster}
        alt={slide.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        style={{ objectPosition: slide.visual.bgPosition }}
        loading="lazy"
        draggable={false}
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: active
            ? 'linear-gradient(to top, rgba(7,8,16,0.88) 0%, rgba(7,8,16,0.18) 100%)'
            : 'linear-gradient(to top, rgba(7,8,16,0.92) 0%, rgba(7,8,16,0.45) 100%)',
        }}
      />

      {/* Accent top border line */}
      {active && (
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, ${slide.accentColor}, #FFD700, ${slide.accentColor})` }}
        />
      )}

      {/* Label */}
      <div className="absolute bottom-0 left-0 right-0 px-2 pb-1.5">
        <p
          className="text-[10px] font-black font-rajdhani leading-tight truncate transition-colors"
          style={{ color: active ? '#FFD700' : '#D1D5DB' }}
        >
          {slide.title.length > 15 ? slide.title.slice(0, 15) + '…' : slide.title}
        </p>
        <p className="text-[9px] font-rajdhani uppercase tracking-wide text-gray-600 truncate">
          {slide.type}
        </p>
      </div>

      {/* Active pulse dot */}
      {active && (
        <div
          className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: '#FFD700', boxShadow: '0 0 6px #FFD700' }}
        />
      )}
    </button>
  )
}

/* ─── Main component ─────────────────────────────────────────────── */
const SLIDE_DURATION = 7000

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [direction, setDirection] = useState<1 | -1>(1)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { toggleWatchlist, watchlist } = useStore()

  const slide = SLIDES[current]

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
      <AnimatePresence mode="sync" custom={direction}>
        <motion.div
          key={`bg-${slide.id}`}
          custom={direction}
          variants={bgVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${slide.visual.poster})`,
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
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(7,8,16,0.97) 0%, rgba(7,8,16,0.90) 28%, rgba(7,8,16,0.65) 52%, rgba(7,8,16,0.20) 75%, rgba(7,8,16,0.04) 100%)',
        }}
      />

      {/* Bottom-to-top fade — merges seamlessly into the rest of the page */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '58%',
          background:
            'linear-gradient(to top, rgba(7,8,16,1) 0%, rgba(7,8,16,0.85) 25%, rgba(7,8,16,0.45) 55%, transparent 100%)',
        }}
      />

      {/* Top navbar fade */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: '200px',
          background: 'linear-gradient(to bottom, rgba(7,8,16,0.72) 0%, rgba(7,8,16,0.20) 60%, transparent 100%)',
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
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 80% at -5% 65%, ${slide.glowColor} 0%, transparent 68%)`,
          }}
        />
      </AnimatePresence>

      {/* Cinematic film-grain noise */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.032] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'grain\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.82\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23grain)\'/%3E%3C/svg%3E")',
          backgroundSize: '180px',
        }}
      />

      {/* Edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 200px rgba(7,8,16,0.45)' }}
      />

      {/* ══════════════════════════════════════════════
          LAYER 3 — Text content (left-aligned)
      ══════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="container-tv w-full pb-28 pt-20">
          <div className="max-w-[600px] xl:max-w-[650px]">
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
                    {slide.badge}
                  </span>
                  <span className="text-[11px] font-bold font-rajdhani tracking-[0.16em] uppercase text-gray-500">
                    {slide.type}
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
                  {slide.titleTe}
                </motion.p>

                {/* Main title */}
                <motion.h1
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="font-cinzel font-black leading-[1.0] mb-5"
                  style={{
                    fontSize: 'clamp(34px, 5.8vw, 80px)',
                    background: 'linear-gradient(140deg, #ffffff 0%, #FFD700 55%, #FFA500 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: `drop-shadow(0 4px 32px ${slide.accentColor}50)`,
                  }}
                >
                  {slide.title}
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
                  <span className="text-gray-200 text-sm font-semibold font-rajdhani">{slide.runtime}</span>

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
                  {slide.genres.map((g, i) => (
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
                  className="font-telugu text-gray-300 leading-[2.0] mb-6 line-clamp-3"
                  style={{
                    fontSize: 'clamp(13px, 1.25vw, 15px)',
                    textShadow: '0 1px 12px rgba(0,0,0,0.95)',
                  }}
                >
                  {slide.desc}
                </motion.p>

                {/* OTT platforms */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.40 }}
                  className="flex items-center gap-2 mb-7 flex-wrap"
                >
                  <span className="text-gray-600 text-[11px] font-semibold font-rajdhani uppercase tracking-widest">
                    Watch on
                  </span>
                  {slide.ott.map(platform => (
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
                  className="flex gap-3 flex-wrap"
                >
                  {/* Watch Now */}
                  <Link
                    href={`/content/${slide.slug}`}
                    className="group relative flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-cinzel font-bold text-sm tracking-wide text-white overflow-hidden transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #E50914 0%, #b5000b 100%)',
                      boxShadow: '0 8px 32px rgba(229,9,20,0.45), 0 2px 8px rgba(0,0,0,0.6)',
                    }}
                  >
                    <svg className="w-4 h-4 fill-white flex-none" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Watch Now
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
                    className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-rajdhani font-bold text-sm tracking-wide text-white border border-white/22 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/12 hover:border-white/35 active:scale-95"
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
                    More Details
                  </Link>

                  {/* Watchlist */}
                  <button
                    onClick={() => toggleWatchlist(slide.id)}
                    className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-rajdhani font-bold text-sm tracking-wide border transition-all duration-300 hover:-translate-y-0.5 active:scale-95 ${
                      watchlist.includes(slide.id)
                        ? 'bg-yellow-500/22 border-yellow-500/55 text-yellow-400'
                        : 'border-white/15 text-gray-300 hover:border-yellow-400/45 hover:text-yellow-400'
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
                        Saved
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Watchlist
                      </>
                    )}
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          LAYER 4 — Bottom controls bar
      ══════════════════════════════════════════════ */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 pt-8 pb-4"
        style={{
          background: 'linear-gradient(to top, rgba(7,8,16,0.90) 0%, rgba(7,8,16,0.55) 55%, transparent 100%)',
        }}
      >
        <div className="container-tv flex items-end gap-5">

          {/* Progress bars + counter */}
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            <div className="flex gap-1.5" style={{ maxWidth: '220px' }}>
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => goTo(i, i > current ? 1 : -1)}
                  className="flex-1 py-1.5"
                  aria-label={`Slide ${i + 1}: ${s.title}`}
                >
                  <ProgressBar
                    active={i === current}
                    duration={SLIDE_DURATION}
                    paused={isPaused}
                    color={slide.accentColor}
                  />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-white font-bold text-sm tabular-nums">
                {String(current + 1).padStart(2, '0')}
              </span>
              <span className="text-gray-700 text-xs">/</span>
              <span className="text-gray-600 text-xs font-rajdhani tabular-nums">
                {String(SLIDES.length).padStart(2, '0')}
              </span>
              <span className="w-px h-3 bg-gray-800 mx-1.5" />
              <span className="text-gray-400 text-xs font-semibold font-rajdhani truncate">{slide.title}</span>
            </div>
          </div>

          {/* Poster thumbnail strip */}
          <div className="hidden md:flex items-end gap-2">
            {SLIDES.map((s, i) => (
              <ThumbCard
                key={s.id}
                slide={s}
                active={i === current}
                onClick={() => goTo(i, i > current ? 1 : -1)}
              />
            ))}
          </div>

          {/* Prev / Pause / Next */}
          <div className="flex items-center gap-1.5 flex-none">
            <button
              onClick={prev_}
              aria-label="Previous"
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white transition-all duration-200 hover:border-white/35 hover:bg-white/10 hover:-translate-y-0.5 active:scale-90"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => setIsPaused(p => !p)}
              aria-label={isPaused ? 'Play' : 'Pause'}
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white transition-all duration-200 hover:border-yellow-400/40 hover:bg-yellow-400/12 active:scale-90"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
            >
              {isPaused ? (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              ) : (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
              )}
            </button>

            <button
              onClick={next}
              aria-label="Next"
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white transition-all duration-200 hover:border-white/35 hover:bg-white/10 hover:-translate-y-0.5 active:scale-90"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
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
            aria-label={s.title}
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
                <p className="text-white text-[11px] font-bold font-rajdhani">{s.title}</p>
                <p className="text-gray-500 text-[9px] font-rajdhani uppercase tracking-wide">{s.type}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

    </section>
  )
}