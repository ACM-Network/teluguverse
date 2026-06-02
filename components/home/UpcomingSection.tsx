'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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

function getUpcomingEmoji(title: string, genres: string[]): string {
  const t = title.toLowerCase()
  const g = genres.map(x => x.toLowerCase())
  if (t.includes('ramayana') || t.includes('rama')) return '🏹'
  if (t.includes('coolie') || t.includes('rajini')) return '🕶️'
  if (t.includes('dragon ball') || t.includes('dbz') || t.includes('goku') || g.includes('anime')) return '🐉'
  if (t.includes('house of the dragon') || t.includes('dragon')) return '🏰'
  if (t.includes('mallu') || t.includes('veera')) return '⚔️'
  if (t.includes('kalki')) return '🕉️'
  if (t.includes('raja saab') || g.includes('horror')) return '🔮'
  if (t.includes('vishwambhara') || g.includes('fantasy')) return '☄️'
  if (t.includes('og') || g.includes('action')) return '🔫'
  if (t.includes('spirit') || t.includes('police') || t.includes('cop')) return '👮'
  if (
    t.includes('superman') ||
    t.includes('batman') ||
    t.includes('avengers') ||
    t.includes('marvel') ||
    t.includes('spider') ||
    g.includes('super-hero') ||
    g.includes('superhero')
  ) return '🦸'
  if (t.includes('fantastic four') || t.includes('space')) return '🚀'
  if (t.includes('doomsday') || t.includes('secret wars')) return '💥'
  if (t.includes('avatar')) return '🌋'
  if (t.includes('minecraft')) return '🧱'
  if (t.includes('squid game')) return '🦑'
  if (t.includes('dead') || t.includes('zombie')) return '🧟'
  if (t.includes('solo leveling') || t.includes('leveling')) return '⚡'
  if (t.includes('punch')) return '👊'
  if (t.includes('stranger')) return '🕯️'
  if (t.includes('wednesday')) return '🕸️'
  return '🎬'
}

function CountdownUnit({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="text-center flex-1">
      <span 
        className="font-cinzel text-base sm:text-lg font-black block leading-none"
        style={{ color, textShadow: `0 0 8px ${color}50` }}
      >
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-gray-400 text-[8px] uppercase tracking-wider font-rajdhani font-bold mt-1 block leading-none">{label}</span>
    </div>
  )
}

export default function UpcomingSection() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [time, setTime] = useState({ h: 12, m: 30, s: 0 })

  useEffect(() => {
    fetch('/api/content/upcoming?limit=12')
      .then(r => r.json())
      .then(d => {
        setItems(Array.isArray(d) ? d : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev
        s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) h = 23
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])

  if (loading) {
    return (
      <div className="relative">
        <SectionHeader
          title="Upcoming Releases"
          titleTe="రాబోయే విడుదలలు"
          href="/upcoming"
          icon="upcoming"
          description="Get real-time countdown clocks for the most anticipated movies and series"
        />
        <div className="cards-scroll gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-none w-64 h-80 rounded-2xl bg-surface border border-white/5 shimmer" />
          ))}
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="relative">
      <SectionHeader
        title="Upcoming Releases"
        titleTe="రాబోయే విడుదలలు"
        href="/upcoming"
        icon="upcoming"
        description="Get real-time countdown clocks for the most anticipated movies and series"
      />
      <div className="cards-scroll">
        {items.map((item, i) => {
          const color = TYPE_COLORS[item.type] || '#FFD700'
          const releaseDateVal = item.releaseDate ? new Date(item.releaseDate) : new Date()
          const diffMs = releaseDateVal.getTime() - new Date().getTime()
          const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
          const genreSlugs = item.genres?.map((g: any) => g.genre?.slug || '') || []
          const primaryGenre = item.genres?.[0]?.genre?.name || 'Entertainment'
          const emoji = getUpcomingEmoji(item.titleEnglish, genreSlugs)

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="flex-none w-64 rounded-2xl overflow-hidden bg-surface border border-white/5 hover:border-yellow-400/30 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex flex-col"
            >
              {/* Upper Card Art Block */}
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

                {/* Floating artwork */}
                <div className="z-10 relative text-5xl filter drop-shadow-[0_4px_12px_rgba(255,255,255,0.15)] select-none">
                  {emoji}
                </div>

                {/* Status Pill (absolute top-3 left-3) */}
                <div className="absolute top-3 left-3 z-20">
                  <span 
                    className="bg-black/80 border border-white/10 px-2.5 py-0.5 rounded-lg text-[8px] font-black font-rajdhani tracking-widest uppercase flex items-center gap-1.5"
                    style={{ color }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    {item.status}
                  </span>
                </div>

                {/* Glassmorphism Countdown Timer Panel */}
                <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl py-2.5 px-3 flex justify-between gap-1 z-20 shadow-lg">
                  <CountdownUnit value={daysLeft} label="Days" color={color} />
                  <div className="w-px h-6 bg-white/10 self-center" />
                  <CountdownUnit value={time.h} label="Hrs" color={color} />
                  <div className="w-px h-6 bg-white/10 self-center" />
                  <CountdownUnit value={time.m} label="Min" color={color} />
                  <div className="w-px h-6 bg-white/10 self-center" />
                  <CountdownUnit value={time.s} label="Sec" color={color} />
                </div>
              </div>

              {/* Lower Details Block */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <p className="text-white text-base font-bold font-rajdhani tracking-wide truncate group-hover:text-yellow-400 transition-colors duration-300">
                    {item.titleEnglish}
                  </p>
                  <p className="font-telugu text-gray-500 text-xs truncate leading-none">
                    {item.titleTelugu || ''}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto">
                  <span className="text-[10px] font-bold text-gray-400 font-rajdhani uppercase tracking-wider">
                    {primaryGenre} • {item.year}
                  </span>
                  <span className="text-[9px] font-black font-rajdhani text-yellow-400/80 uppercase tracking-widest flex items-center gap-1 hover:text-yellow-400 transition-colors">
                    NOTIFY ME <PremiumIcon name="arrow-right" size={10} className="stroke-[2.5]" />
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  )
}
