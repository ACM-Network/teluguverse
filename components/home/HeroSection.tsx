'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useStore } from '@/store/useStore'

const SLIDES = [
  { id: '1', title: 'Kalki 2898 AD', titleTe: 'కల్కి 2898 AD', desc: 'భవిష్యత్తులో, 2898 సంవత్సరంలో, ప్రపంచం చీకటి అధికారాల పట్టులో ఉంది. కల్కి అవతారం రావాలని పురాణాలు చెప్తున్నాయి.', rating: '9.1', year: '2024', runtime: '3h 1m', type: 'TELUGU MOVIE', color: '#ff6b00', bg: 'radial-gradient(ellipse at 70% 50%, #1a0500 0%, #070810 60%)', emoji: '🔥', slug: 'kalki-2898-ad', ott: ['Netflix', 'Hotstar'], badge: 'trending', dubAvail: true },
  { id: '2', title: 'Attack on Titan', titleTe: 'ఎరేన్ యగర్ పోరాటం', desc: 'భీమాకార రాక్షసుల నుండి మానవులు తమ గోడలలో రక్షించుకున్న కథ. ఎరేన్ తన స్వేచ్ఛ కోసం పోరాటం.', rating: '9.0', year: '2013–2023', runtime: '94 Episodes', type: 'ANIME', color: '#dc2626', bg: 'radial-gradient(ellipse at 70% 50%, #1a0000 0%, #070810 60%)', emoji: '⚔️', slug: 'attack-on-titan', ott: ['Crunchyroll'], badge: 'top rated', dubAvail: true },
  { id: '3', title: 'Squid Game', titleTe: 'స్క్విడ్ గేమ్', desc: 'ఆర్థిక ఇబ్బందులతో ఉన్న వ్యక్తులు ఒక రహస్య ఆటలో పాల్గొంటారు. గెలిచినవారికి భారీ బహుమతి, మిగిలినవారికి మరణం.', rating: '8.0', year: '2021', runtime: '9 Episodes', type: 'K-DRAMA', color: '#ec4899', bg: 'radial-gradient(ellipse at 70% 50%, #1a001a 0%, #070810 60%)', emoji: '🦑', slug: 'squid-game', ott: ['Netflix'], badge: 'popular', dubAvail: true },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const { toggleWatchlist, watchlist, language } = useStore()
  const slide = SLIDES[current]

  useEffect(() => {
    if (isPaused) return
    const t = setInterval(() => setCurrent(i => (i + 1) % SLIDES.length), 6000)
    return () => clearInterval(t)
  }, [isPaused])

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden flex items-end pb-20"
      onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>

      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div key={slide.id} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }} className="absolute inset-0" style={{ background: slide.bg }} />
      </AnimatePresence>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 hero-overlay" />
      <div className="absolute bottom-0 left-0 right-0 h-64 hero-overlay-bottom" />

      {/* Accent glow */}
      <div className="absolute right-1/4 top-1/3 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none transition-colors duration-1000"
        style={{ background: slide.color, filter: 'blur(120px)' }} />

      {/* Slide indicators */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
        {SLIDES.map((s, i) => (
          <button key={s.id} onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? 'h-8 w-1.5' : 'h-2 w-1.5 opacity-30'}`}
            style={{ background: i === current ? slide.color : '#fff' }} />
        ))}
      </div>

      {/* Content */}
      <div className="container-tv relative z-10 w-full">
        <AnimatePresence mode="wait">
          <motion.div key={slide.id} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.5 }} className="max-w-2xl">

            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border font-rajdhani text-xs font-bold tracking-widest uppercase"
              style={{ background: `${slide.color}18`, borderColor: `${slide.color}50`, color: slide.color }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: slide.color }} />
              {slide.badge} • {slide.type}
            </motion.div>

            {/* Telugu title */}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
              className="font-telugu text-lg font-light mb-2" style={{ color: `${slide.color}cc` }}>
              {slide.titleTe}
            </motion.p>

            {/* Main title */}
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="font-cinzel text-5xl lg:text-7xl font-black leading-tight mb-3 gradient-text">
              {slide.title}
            </motion.h1>

            {/* Meta */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
              className="flex items-center gap-4 mb-4 text-sm font-rajdhani font-semibold text-gray-300 flex-wrap">
              <span className="flex items-center gap-1.5 text-yellow-400 font-bold text-base">★ {slide.rating}</span>
              <span className="text-gray-600">|</span>
              <span>{slide.year}</span>
              <span className="text-gray-600">|</span>
              <span>{slide.runtime}</span>
              {slide.dubAvail && <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-400/15 text-yellow-400 border border-yellow-400/30">తె DUB ✓</span>}
            </motion.div>

            {/* Description */}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="font-telugu text-gray-300 text-base leading-8 mb-6 line-clamp-3 max-w-xl">
              {slide.desc}
            </motion.p>

            {/* OTT platforms */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
              className="flex items-center gap-2 mb-7">
              {slide.ott.map(platform => (
                <span key={platform} className="px-3 py-1 rounded-lg text-xs font-bold font-rajdhani bg-white/8 border border-white/15 text-gray-300">{platform}</span>
              ))}
            </motion.div>

            {/* Actions */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="flex gap-4 flex-wrap">
              <Link href={`/content/${slide.slug}`}
                className="flex items-center gap-2.5 px-8 py-4 rounded-xl font-cinzel font-bold text-sm tracking-wide text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #E50914, #c0000f)', boxShadow: '0 0 30px rgba(229,9,20,0.4)' }}>
                ▶ Watch Now
              </Link>
              <Link href={`/content/${slide.slug}`}
                className="flex items-center gap-2.5 px-8 py-4 rounded-xl font-rajdhani font-bold text-sm tracking-wide text-white border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-sm">
                ℹ More Info
              </Link>
              <button onClick={() => toggleWatchlist(slide.id)}
                className={`flex items-center gap-2 px-5 py-4 rounded-xl font-rajdhani font-bold text-sm tracking-wide border transition-all ${watchlist.includes(slide.id) ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' : 'border-white/20 text-gray-300 hover:border-yellow-400/40 hover:text-yellow-400 bg-white/5'}`}>
                {watchlist.includes(slide.id) ? '✓' : '+'} Watchlist
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom slide previews */}
      <div className="absolute bottom-6 right-6 lg:flex gap-3 hidden z-20">
        {SLIDES.filter((_, i) => i !== current).map((s) => (
          <button key={s.id} onClick={() => setCurrent(SLIDES.indexOf(s))}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 hover:border-white/25 transition-all backdrop-blur-md group">
            <span className="text-xl">{s.emoji}</span>
            <div className="text-left">
              <p className="text-white text-xs font-bold font-rajdhani group-hover:text-yellow-400 transition-colors">{s.title}</p>
              <p className="text-gray-500 text-[10px] font-rajdhani">{s.type}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
