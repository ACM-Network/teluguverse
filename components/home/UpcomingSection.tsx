'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import PremiumIcon from '@/components/ui/PremiumIcon'

const MOCK_UPCOMING = [
  { id: '1', title: 'Ramayana', titleTe: 'రామాయణం', days: 45, genre: 'Mythological', year: 2025, color: '#F59E0B', status: 'POST-PRODUCTION', logo: (color: string) => <span className="text-5xl filter drop-shadow-[0_4px_12px_rgba(245,158,11,0.25)] select-none">🏹</span> },
  { id: '2', title: 'Coolie', titleTe: 'కూలీ', days: 23, genre: 'Action Thriller', year: 2025, color: '#DC2626', status: 'FILMING', logo: (color: string) => <span className="text-5xl filter drop-shadow-[0_4px_12px_rgba(220,38,38,0.25)] select-none">🕶️</span> },
  { id: '3', title: 'Dragon Ball: DAIMA S2', titleTe: 'డ్రాగన్ బాల్ DAIMA', days: 180, genre: 'Anime', year: 2025, color: '#FF8C00', status: 'TEASER OUT', logo: (color: string) => <span className="text-5xl filter drop-shadow-[0_4px_12px_rgba(255,140,0,0.25)] select-none">🐉</span> },
  { id: '4', title: 'House of the Dragon S3', titleTe: 'హౌస్ ఆఫ్ ది డ్రాగన్', days: 280, genre: 'Fantasy', year: 2026, color: '#3B82F6', status: 'PRE-PRODUCTION', logo: (color: string) => <span className="text-5xl filter drop-shadow-[0_4px_12px_rgba(59,130,246,0.25)] select-none">🏰</span> },
  { id: '5', title: 'Hari Hara Veera Mallu', titleTe: 'హరి హర వీర మల్లు', days: 60, genre: 'Historical', year: 2025, color: '#F59E0B', status: 'FILMING', logo: (color: string) => <span className="text-5xl filter drop-shadow-[0_4px_12px_rgba(245,158,11,0.25)] select-none">⚔️</span> },
  { id: '6', title: 'Kalki 2898 Part 2', titleTe: 'కల్కి 2898 పార్ట్ 2', days: 480, genre: 'Sci-Fi Epic', year: 2026, color: '#8B5CF6', status: 'ANNOUNCED', logo: (color: string) => <span className="text-5xl filter drop-shadow-[0_4px_12px_rgba(139,92,246,0.25)] select-none">🕉️</span> },
  { id: '7', title: 'The Raja Saab', titleTe: 'ది రాజా సాబ్', days: 75, genre: 'Horror Comedy', year: 2025, color: '#8B5CF6', status: 'TEASER OUT', logo: (color: string) => <span className="text-5xl filter drop-shadow-[0_4px_12px_rgba(139,92,246,0.25)] select-none">🔮</span> },
  { id: '8', title: 'Vishwambhara', titleTe: 'విశ్వంభర', days: 90, genre: 'Fantasy', year: 2025, color: '#06B6D4', status: 'POST-PRODUCTION', logo: (color: string) => <span className="text-5xl filter drop-shadow-[0_4px_12px_rgba(6,182,212,0.25)] select-none">☄️</span> },
  { id: '9', title: 'They Call Him OG', titleTe: 'ఓజీ', days: 120, genre: 'Action', year: 2025, color: '#EF4444', status: 'FILMING', logo: (color: string) => <span className="text-5xl filter drop-shadow-[0_4px_12px_rgba(239,68,68,0.25)] select-none">🔫</span> },
  { id: '10', title: 'Spirit', titleTe: 'స్పిరిట్', days: 380, genre: 'Crime Action', year: 2026, color: '#3B82F6', status: 'ANNOUNCED', logo: (color: string) => <span className="text-5xl filter drop-shadow-[0_4px_12px_rgba(59,130,246,0.25)] select-none">👮</span> },
  { id: '11', title: 'Superman', titleTe: 'సూపర్‌మ్యాన్', days: 110, genre: 'Superhero', year: 2025, color: '#10B981', status: 'POST-PRODUCTION', logo: (color: string) => <span className="text-5xl filter drop-shadow-[0_4px_12px_rgba(16,185,129,0.25)] select-none">🦸</span> },
  { id: '12', title: 'The Fantastic Four', titleTe: 'ఫెంటాస్టిక్ ఫోర్', days: 190, genre: 'Superhero', year: 2025, color: '#3B82F6', status: 'POST-PRODUCTION', logo: (color: string) => <span className="text-5xl filter drop-shadow-[0_4px_12px_rgba(59,130,246,0.25)] select-none">🚀</span> },
  { id: '13', title: 'Avengers: Doomsday', days: 600, genre: 'Superhero', year: 2026, color: '#EF4444', status: 'ANNOUNCED', logo: (color: string) => <span className="text-5xl filter drop-shadow-[0_4px_12px_rgba(239,68,68,0.25)] select-none">💥</span> },
  { id: '14', title: 'The Batman Part II', days: 640, genre: 'Crime Thriller', year: 2026, color: '#374151', status: 'PRE-PRODUCTION', logo: (color: string) => <span className="text-5xl filter drop-shadow-[0_4px_12px_rgba(55,65,81,0.25)] select-none">🦇</span> },
  { id: '15', title: 'Avatar: Fire and Ash', days: 200, genre: 'Sci-Fi', year: 2025, color: '#F59E0B', status: 'FILMING', logo: (color: string) => <span className="text-5xl filter drop-shadow-[0_4px_12px_rgba(245,158,11,0.25)] select-none">🌋</span> },
  { id: '16', title: 'Minecraft Movie', days: 85, genre: 'Adventure', year: 2025, color: '#22C55E', status: 'POST-PRODUCTION', logo: (color: string) => <span className="text-5xl filter drop-shadow-[0_4px_12px_rgba(34,197,94,0.25)] select-none">🧱</span> },
  { id: '17', title: 'Squid Game S3', days: 220, genre: 'Thriller', year: 2025, color: '#EF4444', status: 'POST-PRODUCTION', logo: (color: string) => <span className="text-5xl filter drop-shadow-[0_4px_12px_rgba(239,68,68,0.25)] select-none">🦑</span> },
  { id: '18', title: 'All of Us Are Dead S2', days: 260, genre: 'Horror', year: 2025, color: '#8B5CF6', status: 'FILMING', logo: (color: string) => <span className="text-5xl filter drop-shadow-[0_4px_12px_rgba(139,92,246,0.25)] select-none">🧟</span> },
  { id: '19', title: 'Solo Leveling S2', days: 15, genre: 'Anime', year: 2025, color: '#06B6D4', status: 'TEASER OUT', logo: (color: string) => <span className="text-5xl filter drop-shadow-[0_4px_12px_rgba(6,182,212,0.25)] select-none">⚡</span> },
  { id: '20', title: 'One Punch Man S3', days: 140, genre: 'Anime', year: 2025, color: '#FF8C00', status: 'FILMING', logo: (color: string) => <span className="text-5xl filter drop-shadow-[0_4px_12px_rgba(255,140,0,0.25)] select-none">👊</span> },
  { id: '21', title: 'Stranger Things S5', days: 300, genre: 'Sci-Fi', year: 2025, color: '#EF4444', status: 'POST-PRODUCTION', logo: (color: string) => <span className="text-5xl filter drop-shadow-[0_4px_12px_rgba(239,68,68,0.25)] select-none">🕯️</span> },
  { id: '22', title: 'Wednesday S2', days: 240, genre: 'Supernatural', year: 2025, color: '#374151', status: 'FILMING', logo: (color: string) => <span className="text-5xl filter drop-shadow-[0_4px_12px_rgba(55,65,81,0.25)] select-none">🕸️</span> }
]

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
  const [time, setTime] = useState({ h: 12, m: 30, s: 0 })

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
        {MOCK_UPCOMING.map((item, i) => (
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
              style={{ background: `linear-gradient(135deg, ${item.color}20 0%, ${item.color}02 100%)` }}
            >
              {/* Star grid overlay pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              {/* Glowing aura behind vector logo */}
              <div 
                className="absolute w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none transition-transform duration-500 group-hover:scale-125"
                style={{ background: item.color }}
              />

              {/* Floating artwork */}
              <div className="z-10 relative">{item.logo(item.color)}</div>

              {/* Status Pill (absolute top-3 left-3) */}
              <div className="absolute top-3 left-3 z-20">
                <span 
                  className="bg-black/80 border border-white/10 px-2.5 py-0.5 rounded-lg text-[8px] font-black font-rajdhani tracking-widest uppercase flex items-center gap-1.5"
                  style={{ color: item.color }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {item.status}
                </span>
              </div>

              {/* Glassmorphism Countdown Timer Panel */}
              <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl py-2.5 px-3 flex justify-between gap-1 z-20 shadow-lg">
                <CountdownUnit value={item.days} label="Days" color={item.color} />
                <div className="w-px h-6 bg-white/10 self-center" />
                <CountdownUnit value={time.h} label="Hrs" color={item.color} />
                <div className="w-px h-6 bg-white/10 self-center" />
                <CountdownUnit value={time.m} label="Min" color={item.color} />
                <div className="w-px h-6 bg-white/10 self-center" />
                <CountdownUnit value={time.s} label="Sec" color={item.color} />
              </div>
            </div>

            {/* Lower Details Block */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <p className="text-white text-base font-bold font-rajdhani tracking-wide truncate group-hover:text-yellow-400 transition-colors duration-300">
                  {item.title}
                </p>
                <p className="font-telugu text-gray-500 text-xs truncate leading-none">
                  {item.titleTe}
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto">
                <span className="text-[10px] font-bold text-gray-400 font-rajdhani uppercase tracking-wider">
                  {item.genre} • {item.year}
                </span>
                <span className="text-[9px] font-black font-rajdhani text-yellow-400/80 uppercase tracking-widest flex items-center gap-1 hover:text-yellow-400 transition-colors">
                  NOTIFY ME <PremiumIcon name="arrow-right" size={10} className="stroke-[2.5]" />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
