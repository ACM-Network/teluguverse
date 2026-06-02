'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import PremiumIcon from '@/components/ui/PremiumIcon'

const TYPE_COLORS: Record<string, string> = {
  MOVIE: '#E50914',
  ANIME: '#A855F7',
  SERIES: '#3B82F6',
  KDRAMA: '#EC4899',
  CARTOON: '#22C55E',
  HOLLYWOOD: '#F59E0B',
  DOCUMENTARY: '#06B6D4',
}

function getUpcomingSvg(type: string, genres: string[], color: string) {
  const isSuperHero = genres.some(g => g.toLowerCase().includes('super') || g.toLowerCase().includes('hero'))
  const isSciFi = genres.some(g => g.toLowerCase().includes('sci') || g.toLowerCase().includes('space'))
  
  if (isSuperHero) {
    return (
      <svg className="w-16 h-16 animate-pulse" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <circle cx="12" cy="12" r="8" strokeLinecap="round" />
        <circle cx="12" cy="12" r="4" fill={`${color}22`} />
        <path d="M12 2v20M2 12h20" opacity="0.3" strokeLinecap="round" />
      </svg>
    )
  }
  if (isSciFi || type === 'HOLLYWOOD') {
    return (
      <svg className="w-16 h-16 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="4" fill={`${color}22`} />
      </svg>
    )
  }
  if (type === 'ANIME') {
    return (
      <svg className="w-16 h-16 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
        <polygon points="10 8 16 12 10 16" fill={color} />
      </svg>
    )
  }
  if (type === 'SERIES' || type === 'KDRAMA') {
    return (
      <svg className="w-16 h-16 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M12 2c5 0 9 4 9 9s-9 11-9 11-9-6-9-11 4-9 9-9z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 6c3 0 5 2 5 5s-5 7-5 7" opacity="0.4" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg className="w-16 h-16 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <path d="M4 22V2M20 22V2M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
      <circle cx="12" cy="12" r="5" strokeDasharray="2 2" opacity="0.5" />
    </svg>
  )
}

function Countdown({ days, color }: { days: number; color: string }) {
  const [secs, setSecs] = useState(Math.max(0, days * 86400))
  
  useEffect(() => {
    setSecs(Math.max(0, days * 86400))
  }, [days])

  useEffect(() => {
    const t = setInterval(() => setSecs(s => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])

  const d = Math.floor(secs / 86400)
  const h = Math.floor((secs % 86400) / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  
  return (
    <div className="flex gap-2.5 justify-center py-1 sm:py-2">
      {[{ v: d, l: 'Days' }, { v: h, l: 'Hrs' }, { v: m, l: 'Min' }, { v: s, l: 'Sec' }].map(({ v, l }) => (
        <div key={l} className="text-center flex-1">
          <span 
            className="font-cinzel text-base sm:text-lg font-black block leading-none"
            style={{ color, textShadow: `0 0 8px ${color}50` }}
          >
            {String(v).padStart(2, '0')}
          </span>
          <span className="text-gray-400 text-[8px] sm:text-[9px] uppercase tracking-wider font-rajdhani font-bold mt-1 block leading-none">{l}</span>
        </div>
      ))}
    </div>
  )
}

export default function UpcomingPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetch('/api/content/upcoming?limit=40')
      .then(r => r.json())
      .then(d => {
        setItems(Array.isArray(d) ? d : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filter ? items.filter(i => i.type === filter) : items

  return (
    <div className="min-h-screen bg-dark pt-28 pb-16 select-none z-10">
      <div className="container-tv">
        <SectionHeader
          title="Upcoming Releases"
          titleTe="రాబోయేవి"
          icon="upcoming"
          description="Never miss a release. Follow real-time countdown clocks for highly anticipated movies, anime, and dramas."
        />

        {/* Filter controls */}
        <div className="flex gap-2.5 flex-wrap mb-10">
          {[
            { v: '', l: 'All', icon: '' },
            { v: 'MOVIE', l: 'Movies', icon: 'movies' },
            { v: 'ANIME', l: 'Anime', icon: 'anime' },
            { v: 'SERIES', l: 'Series', icon: 'series' },
            { v: 'KDRAMA', l: 'K-Drama', icon: 'kdrama' }
          ].map(tab => (
            <button
              key={tab.v}
              onClick={() => setFilter(tab.v)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold font-rajdhani tracking-wider uppercase transition-all duration-300 border flex items-center gap-2 ${
                filter === tab.v
                  ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400 shadow-[0_4px_20px_rgba(255,215,0,0.1)]'
                  : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-yellow-400/30 hover:text-yellow-400'
              }`}
            >
              {tab.icon && <PremiumIcon name={tab.icon} size={12} />}
              {tab.l}
            </button>
          ))}
        </div>

        {/* Grid layout */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-surface border border-white/5 rounded-2xl h-[400px] shimmer" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-rajdhani text-lg">
            No upcoming releases found matching this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => {
                const color = TYPE_COLORS[item.type] || '#FFD700'
                const releaseDateVal = item.releaseDate ? new Date(item.releaseDate) : new Date()
                const diffMs = releaseDateVal.getTime() - new Date().getTime()
                const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
                const genreSlugs = item.genres?.map((g: any) => g.genre?.slug || '') || []
                const primaryGenre = item.genres?.[0]?.genre?.name || 'Entertainment'
                const renderSvg = getUpcomingSvg(item.type, genreSlugs, color)
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04, duration: 0.35 }}
                    className="bg-surface border border-white/5 rounded-2xl overflow-hidden hover:border-yellow-400/30 hover:-translate-y-1.5 transition-all duration-300 group shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between"
                    style={{ minHeight: '400px' }}
                  >
                    {/* Art Panel */}
                    <div
                      className="h-44 flex items-center justify-center relative overflow-hidden flex-none"
                      style={{ background: `linear-gradient(135deg, ${color}20 0%, ${color}02 100%)` }}
                    >
                      {/* Star grid overlay pattern */}
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                      {/* Glowing aura behind vector logo */}
                      <div 
                        className="absolute w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none transition-transform duration-500 group-hover:scale-125"
                        style={{ background: color }}
                      />

                      {/* SVG graphic symbol */}
                      <div className="z-10 group-hover:scale-105 transition-transform duration-500 relative">
                        {renderSvg}
                      </div>
                      
                      {/* Absolute type status */}
                      <div className="absolute top-3 left-3 z-20">
                        <span
                          className="text-[9px] font-black px-2.5 py-0.5 rounded-lg font-rajdhani border tracking-wider bg-black/80"
                          style={{ color, borderColor: `${color}25` }}
                        >
                          {item.type}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 z-20">
                        <span className="bg-black/85 border border-white/10 px-2.5 py-0.5 rounded-lg text-[8px] font-black font-rajdhani tracking-widest text-gray-300 uppercase flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          {item.status}
                        </span>
                      </div>

                      {/* Glass countdown banner */}
                      <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl py-2.5 px-3 z-20 shadow-lg">
                        <Countdown days={daysLeft} color={color} />
                      </div>
                    </div>

                    {/* Details Panel */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-white font-bold font-cinzel text-base leading-snug group-hover:text-yellow-400 transition-colors duration-300 truncate">
                          {item.titleEnglish}
                        </h3>
                        <p className="font-telugu text-yellow-500/70 text-xs mt-0.5">{item.titleTelugu || ''}</p>
                        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mt-2 font-rajdhani">
                          {item.descriptionEnglish || 'No description available.'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
                        <span className="text-gray-400 text-xs font-rajdhani font-bold uppercase tracking-wider">
                          {primaryGenre} • {item.year}
                        </span>
                        <button className="text-[10px] font-black font-rajdhani px-4 py-2.5 rounded-xl border border-yellow-400/25 text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400/40 active:scale-95 transition-all shadow-md">
                          Remind Me
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
