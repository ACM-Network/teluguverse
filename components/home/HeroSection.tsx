'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useStore } from '@/store/useStore'

/* ─── Slide data ─────────────────────────────────────────────────── */
const SLIDES = [
  {
    id: '1',
    slug: 'kalki-2898-ad',
    title: 'Kalki 2898 AD',
    titleTe: 'కల్కి 2898 AD',
    desc: 'భవిష్యత్తులో 2898 సంవత్సరంలో ప్రపంచం చీకటి అధికారాల పట్టులో ఉంది. కల్కి అవతారం రావాలని పురాణాలు చెప్తున్నాయి. భైరా అనే యోధుడు ఒక అద్భుతమైన ప్రయాణం చేస్తాడు.',
    genres: ['Sci-Fi', 'Mythology', 'Action'],
    rating: '9.1',
    votes: '2.4L',
    year: '2024',
    runtime: '3h 1m',
    type: 'TELUGU MOVIE',
    badge: '🔥 Trending #1',
    ott: ['Netflix', 'Hotstar'],
    dubAvail: true,
    accentColor: '#FF6B00',
    bgGrad: 'linear-gradient(125deg, #2a0e00 0%, #1a0800 35%, #0d0510 65%, #070810 100%)',
    glowColor: 'rgba(255,107,0,0.18)',
    glowColor2: 'rgba(255,165,0,0.10)',
    // Using CSS art / emoji as placeholder — in production swap with real poster URL
    visual: { emoji: '🔥', bg: 'linear-gradient(145deg,#3d1200,#1f0800,#0d0204)' },
  },
  {
    id: '2',
    slug: 'attack-on-titan',
    title: 'Attack on Titan',
    titleTe: 'ఎరేన్ యగర్ పోరాటం',
    desc: 'భీమాకార రాక్షసులకు వ్యతిరేకంగా మానవుల చివరి పోరాటం. గోడల లోపల జీవించిన మానవులు స్వేచ్ఛ కోసం ప్రాణాలు పణంగా పెడతారు. ఎరేన్ యొక్క నిజమైన లక్ష్యం ఏమిటి?',
    genres: ['Action', 'Dark Fantasy', 'Post-Apocalyptic'],
    rating: '9.0',
    votes: '5.1L',
    year: '2013–2023',
    runtime: '94 Episodes',
    type: 'ANIME',
    badge: '⭐ Top Rated',
    ott: ['Crunchyroll', 'Netflix'],
    dubAvail: true,
    accentColor: '#DC2626',
    bgGrad: 'linear-gradient(125deg, #200000 0%, #140000 35%, #0a020d 65%, #070810 100%)',
    glowColor: 'rgba(220,38,38,0.20)',
    glowColor2: 'rgba(185,28,28,0.10)',
    visual: { emoji: '⚔️', bg: 'linear-gradient(145deg,#2d0000,#140000,#060208)' },
  },
  {
    id: '3',
    slug: 'squid-game',
    title: 'Squid Game',
    titleTe: 'స్క్విడ్ గేమ్',
    desc: 'ఆర్థిక ఇబ్బందులతో ఉన్న వ్యక్తులు ఒక రహస్య మరణ ఆటలో పాల్గొంటారు. గెలుపు అంటే కోట్ల రూపాయలు — ఓటమి అంటే మరణం. ఈ ఆట ఆపగలరా?',
    genres: ['Thriller', 'Drama', 'Survival'],
    rating: '8.7',
    votes: '9.2L',
    year: '2021–2024',
    runtime: 'S2: 7 Eps',
    type: 'K-DRAMA',
    badge: '🌟 Global Hit',
    ott: ['Netflix'],
    dubAvail: true,
    accentColor: '#EC4899',
    bgGrad: 'linear-gradient(125deg, #1a0018 0%, #10000e 35%, #080210 65%, #070810 100%)',
    glowColor: 'rgba(236,72,153,0.18)',
    glowColor2: 'rgba(168,85,247,0.10)',
    visual: { emoji: '🦑', bg: 'linear-gradient(145deg,#260020,#100012,#050208)' },
  },
  {
    id: '4',
    slug: 'pushpa-the-rule',
    title: 'Pushpa: The Rule',
    titleTe: 'పుష్ప: ది రూల్',
    desc: 'పుష్పరాజ్ సామ్రాజ్యం మరింత విస్తరిస్తోంది. శంకర్ IPS తో తీవ్రమైన ఘర్షణ, ప్రేమ మరియు అధికారం మధ్య సంఘర్షణ. "పుష్ప నేల మీద ఉన్నా — జ్వాలలు రేపుతాడు!"',
    genres: ['Action', 'Crime', 'Drama'],
    rating: '8.5',
    votes: '3.8L',
    year: '2024',
    runtime: '3h 20m',
    type: 'TELUGU MOVIE',
    badge: '💥 Blockbuster',
    ott: ['Amazon Prime'],
    dubAvail: true,
    accentColor: '#EF4444',
    bgGrad: 'linear-gradient(125deg, #1a0500 0%, #0f0200 35%, #08040d 65%, #070810 100%)',
    glowColor: 'rgba(239,68,68,0.18)',
    glowColor2: 'rgba(245,158,11,0.10)',
    visual: { emoji: '🌹', bg: 'linear-gradient(145deg,#2d0800,#180400,#060108)' },
  },
  {
    id: '5',
    slug: 'goblin',
    title: 'Goblin',
    titleTe: 'గాబ్లిన్: ది లోన్లీ గాడ్',
    desc: '930 సంవత్సరాల అమరత్వం పొందిన మంత్రగాడు తన జీవితాన్ని ముగించే "కంచె" కోసం వెతుకుతాడు. ఆ కంచె ఒక యువతి — ప్రేమ మరియు విధి యొక్క అద్భుతమైన కలయిక.',
    genres: ['Fantasy', 'Romance', 'Supernatural'],
    rating: '8.9',
    votes: '4.5L',
    year: '2016–2017',
    runtime: '16 Episodes',
    type: 'K-DRAMA',
    badge: '💜 Fan Favorite',
    ott: ['Netflix', 'Viki'],
    dubAvail: true,
    accentColor: '#7C3AED',
    bgGrad: 'linear-gradient(125deg, #0e0020 0%, #07001a 35%, #050212 65%, #070810 100%)',
    glowColor: 'rgba(124,58,237,0.20)',
    glowColor2: 'rgba(139,92,246,0.10)',
    visual: { emoji: '🔮', bg: 'linear-gradient(145deg,#180030,#0a0018,#040210)' },
  },
]

const OTT_COLORS: Record<string, string> = {
  Netflix: '#E50914', Hotstar: '#1B74E4', 'Amazon Prime': '#00A8E0',
  Crunchyroll: '#F47521', Viki: '#1DA462', ZEE5: '#7B2FBE',
}

/* ─── Progress bar ───────────────────────────────────────────────── */
function ProgressBar({ active, duration, paused }: { active: boolean; duration: number; paused: boolean }) {
  return (
    <div className="h-0.5 w-full bg-white/10 rounded-full overflow-hidden">
      {active && (
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg,#FFD700,#FFA500)' }}
          initial={{ width: '0%' }}
          animate={{ width: paused ? undefined : '100%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      )}
    </div>
  )
}

/* ─── Floating orb ───────────────────────────────────────────────── */
function FloatingOrb({ color, size, x, y, delay, duration }: { color: string; size: number; x: string; y: string; delay: number; duration: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, left: x, top: y, background: color, filter: `blur(${size * 0.55}px)` }}
      animate={{ y: [0, -30, 0], opacity: [0.12, 0.22, 0.12], scale: [1, 1.12, 1] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

/* ─── Main component ─────────────────────────────────────────────── */
const SLIDE_DURATION = 7000

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev]       = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [direction, setDirection] = useState<1 | -1>(1)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { toggleWatchlist, watchlist } = useStore()

  const slide = SLIDES[current]

  const goTo = useCallback((idx: number, dir: 1 | -1 = 1) => {
    setPrev(current)
    setDirection(dir)
    setCurrent(idx)
  }, [current])

  const next = useCallback(() => goTo((current + 1) % SLIDES.length, 1), [current, goTo])
  const prev_ = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length, -1), [current, goTo])

  // Auto-advance
  useEffect(() => {
    if (isPaused) return
    timerRef.current = setTimeout(next, SLIDE_DURATION)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, isPaused, next])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft')  prev_()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev_])

  const contentVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60, filter: 'blur(4px)' }),
    center: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40, filter: 'blur(4px)', transition: { duration: 0.4 } }),
  }

  const bgVariants = {
    enter: { opacity: 0, scale: 1.06 },
    center: { opacity: 1, scale: 1, transition: { duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit:   { opacity: 0, scale: 0.97, transition: { duration: 0.6 } },
  }

  const visualVariants = {
    enter: { opacity: 0, scale: 0.88, x: 80 },
    center: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit:   { opacity: 0, scale: 1.06, x: -60, transition: { duration: 0.5 } },
  }

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: 'clamp(600px, 100vh, 920px)' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >

      {/* ── BG layer ── */}
      <AnimatePresence mode="sync" custom={direction}>
        <motion.div
          key={`bg-${slide.id}`}
          custom={direction}
          variants={bgVariants}
          initial="enter" animate="center" exit="exit"
          className="absolute inset-0"
          style={{ background: slide.bgGrad }}
        />
      </AnimatePresence>

      {/* ── Floating orbs ── */}
      <AnimatePresence>
        <motion.div key={`orbs-${slide.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }} className="absolute inset-0 pointer-events-none overflow-hidden">
          <FloatingOrb color={slide.glowColor}  size={520} x="5%"  y="10%"  delay={0}   duration={8}  />
          <FloatingOrb color={slide.glowColor2} size={380} x="60%" y="0%"   delay={1.5} duration={10} />
          <FloatingOrb color={slide.glowColor}  size={280} x="45%" y="55%"  delay={0.8} duration={7}  />
          <FloatingOrb color={slide.glowColor2} size={200} x="80%" y="30%"  delay={2}   duration={9}  />
        </motion.div>
      </AnimatePresence>

      {/* ── Cinematic grain overlay ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '180px' }} />

      {/* ── Left gradient vignette ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(7,8,16,0.97) 0%, rgba(7,8,16,0.75) 45%, rgba(7,8,16,0.25) 70%, rgba(7,8,16,0.05) 100%)' }} />
      {/* ── Bottom fade ── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: '45%', background: 'linear-gradient(to top, rgba(7,8,16,1) 0%, rgba(7,8,16,0.7) 40%, transparent 100%)' }} />
      {/* ── Top fade ── */}
      <div className="absolute top-0 left-0 right-0 h-36 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(7,8,16,0.5) 0%, transparent 100%)' }} />

      {/* ── Right side visual (poster art) ── */}
      <div className="absolute right-0 top-0 bottom-0 w-[55%] pointer-events-none overflow-hidden hidden lg:block">
        <AnimatePresence mode="sync" custom={direction}>
          <motion.div
            key={`visual-${slide.id}`}
            custom={direction}
            variants={visualVariants}
            initial="enter" animate="center" exit="exit"
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Poster card */}
            <div className="relative w-[340px] h-[480px] rounded-2xl overflow-hidden shadow-2xl"
              style={{ boxShadow: `0 40px 120px ${slide.accentColor}30, 0 0 0 1px ${slide.accentColor}25` }}>
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ background: slide.visual.bg }}>
                <span className="text-[140px] select-none" style={{ filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.8))' }}>
                  {slide.visual.emoji}
                </span>
              </div>
              {/* Poster shimmer */}
              <div className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${slide.accentColor}08 0%, transparent 60%, ${slide.accentColor}05 100%)` }} />
              {/* Poster bottom label */}
              <div className="absolute bottom-0 left-0 right-0 p-4"
                style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.9),transparent)' }}>
                <p className="font-cinzel text-white font-black text-base leading-tight">{slide.title}</p>
                <p className="font-telugu text-xs mt-1" style={{ color: slide.accentColor }}>{slide.titleTe}</p>
              </div>
            </div>
            {/* Poster reflection */}
            <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[340px] h-24 rounded-2xl opacity-20"
              style={{ background: slide.visual.bg, filter: 'blur(16px)', transform: 'translateX(-50%) scaleY(-0.35) translateY(90%)' }} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Main content ── */}
      <div className="container-tv relative z-10 h-full flex items-center">
        <div className="w-full max-w-[640px] pb-8 pt-20">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`content-${slide.id}`}
              custom={direction}
              variants={contentVariants}
              initial="enter" animate="center" exit="exit"
            >

              {/* Badge row */}
              <div className="flex items-center gap-3 mb-5">
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black font-rajdhani tracking-[0.12em] uppercase"
                  style={{ background: `${slide.accentColor}20`, border: `1px solid ${slide.accentColor}50`, color: slide.accentColor }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: slide.accentColor }} />
                  {slide.badge}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                  className="text-[11px] font-bold font-rajdhani tracking-[0.15em] uppercase text-gray-500">
                  {slide.type}
                </motion.span>
              </div>

              {/* Telugu subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
                className="font-telugu text-lg font-light mb-2 leading-relaxed"
                style={{ color: `${slide.accentColor}bb` }}>
                {slide.titleTe}
              </motion.p>

              {/* Main title */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="font-cinzel font-black leading-[1.0] mb-4"
                style={{
                  fontSize: 'clamp(36px, 5.5vw, 76px)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #FFD700 50%, #FFA500 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: 'none',
                  filter: `drop-shadow(0 4px 24px ${slide.accentColor}40)`,
                }}>
                {slide.title}
              </motion.h1>

              {/* Rating + meta row */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}
                className="flex items-center gap-3 mb-4 flex-wrap">
                {/* Star rating */}
                <div className="flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/25 rounded-lg px-3 py-1.5">
                  <span className="text-yellow-400 text-base leading-none">★</span>
                  <span className="text-yellow-400 font-black font-cinzel text-base leading-none">{slide.rating}</span>
                  <span className="text-gray-500 text-xs font-rajdhani font-semibold">/ 10</span>
                </div>
                <span className="text-gray-600 text-sm">·</span>
                <span className="text-gray-300 text-sm font-semibold font-rajdhani">{slide.year}</span>
                <span className="text-gray-600 text-sm">·</span>
                <span className="text-gray-300 text-sm font-semibold font-rajdhani">{slide.runtime}</span>
                {slide.dubAvail && (
                  <>
                    <span className="text-gray-600 text-sm">·</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-black font-rajdhani tracking-wide bg-yellow-400/12 border border-yellow-400/30 text-yellow-400">
                      తె DUB ✓
                    </span>
                  </>
                )}
              </motion.div>

              {/* Genres */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }}
                className="flex items-center gap-2 mb-5 flex-wrap">
                {slide.genres.map((g, i) => (
                  <span key={g}
                    className="px-3 py-1 rounded-full text-xs font-bold font-rajdhani tracking-wide border"
                    style={{
                      background: i === 0 ? `${slide.accentColor}15` : 'rgba(255,255,255,0.05)',
                      borderColor: i === 0 ? `${slide.accentColor}40` : 'rgba(255,255,255,0.1)',
                      color: i === 0 ? slide.accentColor : '#9CA3AF',
                    }}>
                    {g}
                  </span>
                ))}
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.36 }}
                className="font-telugu text-gray-300 leading-[1.9] mb-6 line-clamp-3"
                style={{ fontSize: 'clamp(13px, 1.3vw, 15px)' }}>
                {slide.desc}
              </motion.p>

              {/* OTT platforms */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.40 }}
                className="flex items-center gap-2 mb-7 flex-wrap">
                <span className="text-gray-600 text-xs font-semibold font-rajdhani uppercase tracking-widest mr-1">Watch on</span>
                {slide.ott.map(platform => (
                  <span key={platform}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-rajdhani border"
                    style={{
                      background: `${OTT_COLORS[platform] || '#9CA3AF'}15`,
                      borderColor: `${OTT_COLORS[platform] || '#9CA3AF'}35`,
                      color: OTT_COLORS[platform] || '#9CA3AF',
                    }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: OTT_COLORS[platform] || '#9CA3AF' }} />
                    {platform}
                  </span>
                ))}
              </motion.div>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex gap-3 flex-wrap">

                <Link href={`/content/${slide.slug}`}
                  className="group relative flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-cinzel font-bold text-sm tracking-wide text-white overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg,#E50914,#b5000b)', boxShadow: '0 8px 32px rgba(229,9,20,0.4), 0 2px 8px rgba(0,0,0,0.5)' }}>
                  <span className="relative z-10 flex items-center gap-2.5">
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    Watch Now
                  </span>
                  {/* Shine */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.12) 50%,transparent 60%)' }} />
                </Link>

                <Link href={`/content/${slide.slug}`}
                  className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-rajdhani font-bold text-sm tracking-wide text-white border border-white/20 bg-white/6 hover:bg-white/12 hover:border-white/35 transition-all duration-300 backdrop-blur-sm hover:-translate-y-0.5"
                  style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
                  <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  More Details
                </Link>

                <button
                  onClick={() => toggleWatchlist(slide.id)}
                  className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-rajdhani font-bold text-sm tracking-wide border transition-all duration-300 hover:-translate-y-0.5 ${
                    watchlist.includes(slide.id)
                      ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                      : 'border-white/15 text-gray-300 hover:border-yellow-400/40 hover:text-yellow-400 bg-white/5'
                  }`}>
                  {watchlist.includes(slide.id)
                    ? <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Saved</>
                    : <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg> Watchlist</>
                  }
                </button>
              </motion.div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Bottom controls bar ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-5 pt-3" style={{ background: 'linear-gradient(to top,rgba(7,8,16,0.6) 0%,transparent 100%)' }}>
        <div className="container-tv flex items-end gap-6">

          {/* Progress + thumbnails */}
          <div className="flex-1 flex flex-col gap-3">
            {/* Slide progress bars */}
            <div className="flex gap-1.5 max-w-xs">
              {SLIDES.map((s, i) => (
                <button key={s.id} onClick={() => goTo(i, i > current ? 1 : -1)} className="flex-1 group">
                  <ProgressBar active={i === current} duration={SLIDE_DURATION} paused={isPaused} />
                  {i !== current && (
                    <div className="h-0.5 w-full rounded-full mt-0 bg-white/20 -mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              ))}
            </div>

            {/* Current slide info */}
            <div className="flex items-center gap-3">
              <span className="font-cinzel text-white font-bold text-sm">{String(current + 1).padStart(2, '0')}</span>
              <span className="text-gray-600 text-xs font-rajdhani">/</span>
              <span className="text-gray-600 text-xs font-rajdhani">{String(SLIDES.length).padStart(2, '0')}</span>
              <span className="w-px h-3 bg-gray-700 mx-1" />
              <span className="text-gray-400 text-xs font-semibold font-rajdhani">{slide.title}</span>
            </div>
          </div>

          {/* Thumbnail navigation (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all duration-300 backdrop-blur-md ${
                  i === current
                    ? 'border-yellow-400/50 bg-yellow-400/10'
                    : 'border-white/10 bg-black/40 hover:border-white/25 hover:bg-white/8'
                }`}>
                <span className="text-base leading-none">{s.visual.emoji}</span>
                <div className="text-left hidden lg:block">
                  <p className={`text-[11px] font-bold font-rajdhani leading-none transition-colors ${i === current ? 'text-yellow-400' : 'text-gray-300'}`}>
                    {s.title.length > 14 ? s.title.slice(0, 14) + '…' : s.title}
                  </p>
                  <p className="text-gray-600 text-[9px] font-rajdhani mt-0.5 uppercase tracking-wide">{s.type}</p>
                </div>
                {i === current && (
                  <div className="w-1 h-1 rounded-full bg-yellow-400 ml-1 animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Prev / Next arrows */}
          <div className="flex items-center gap-1.5">
            <button onClick={prev_}
              className="w-9 h-9 rounded-full border border-white/15 bg-black/40 hover:border-white/35 hover:bg-white/10 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:-translate-y-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setIsPaused(p => !p)}
              className="w-9 h-9 rounded-full border border-white/15 bg-black/40 hover:border-yellow-400/35 hover:bg-yellow-400/10 backdrop-blur-sm flex items-center justify-center text-white transition-all">
              {isPaused
                ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              }
            </button>
            <button onClick={next}
              className="w-9 h-9 rounded-full border border-white/15 bg-black/40 hover:border-white/35 hover:bg-white/10 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:-translate-y-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Vertical side indicator (desktop) ── */}
      <div className="absolute right-5 top-1/2 -translate-y-1/2 flex-col gap-2 z-20 hidden xl:flex">
        {SLIDES.map((s, i) => (
          <button key={s.id} onClick={() => goTo(i, i > current ? 1 : -1)}
            className="relative flex items-center justify-center group">
            <motion.div
              animate={{ height: i === current ? 36 : 8, opacity: i === current ? 1 : 0.3 }}
              transition={{ duration: 0.3 }}
              className="w-1 rounded-full"
              style={{ background: i === current ? slide.accentColor : '#fff' }}
            />
            {/* Tooltip */}
            <div className="absolute right-5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1.5 whitespace-nowrap">
                <p className="text-white text-[11px] font-bold font-rajdhani">{s.title}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

    </section>
  )
}
