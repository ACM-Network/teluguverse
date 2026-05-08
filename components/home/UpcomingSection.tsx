'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'

const MOCK_UPCOMING = [
  { id:'1',title:'Ramayana',emoji:'🏹',days:45,genre:'Mythological',year:2025,color:'#f59e0b' },
  { id:'2',title:'Coolie',emoji:'🚂',days:23,genre:'Action',year:2025,color:'#dc2626' },
  { id:'3',title:'Dragon Ball: DAIMA S2',emoji:'🔵',days:7,genre:'Anime',year:2025,color:'#f59e0b' },
  { id:'4',title:'House of the Dragon S3',emoji:'🐉',days:89,genre:'Fantasy Series',year:2025,color:'#1e40af' },
  { id:'5',title:'Pushpa 3',emoji:'🌹',days:180,genre:'Action',year:2026,color:'#ef4444' },
  { id:'6',title:'Kalki 2898 Part 2',emoji:'⚡',days:365,genre:'Sci-Fi',year:2026,color:'#8b5cf6' },
]

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <span className="font-cinzel text-base font-black text-yellow-400 block leading-none">{String(value).padStart(2,'0')}</span>
      <span className="text-gray-600 text-[9px] uppercase tracking-wider font-rajdhani">{label}</span>
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
    <div>
      <SectionHeader title="Upcoming Releases" titleTe="రాబోయే విడుదలలు" href="/upcoming" icon="📅" />
      <div className="cards-scroll">
        {MOCK_UPCOMING.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.08 }}
            className="flex-none w-52 rounded-xl overflow-hidden bg-surface border border-border hover:border-yellow-400/30 hover:-translate-y-1 transition-all cursor-pointer group">
            <div className="h-32 flex items-center justify-center relative" style={{ background:`linear-gradient(135deg,${item.color}18,${item.color}08)` }}>
              <span className="text-5xl group-hover:scale-110 transition-transform">{item.emoji}</span>
              <div className="absolute bottom-2 left-2 right-2 bg-black/80 rounded-lg py-2 px-2 flex justify-center gap-3 backdrop-blur-sm">
                <CountdownUnit value={item.days} label="Days" />
                <CountdownUnit value={time.h} label="Hrs" />
                <CountdownUnit value={time.m} label="Min" />
                <CountdownUnit value={time.s} label="Sec" />
              </div>
            </div>
            <div className="p-3">
              <p className="text-white text-sm font-bold font-rajdhani">{item.title}</p>
              <p className="text-gray-500 text-xs font-rajdhani mt-1">{item.genre} • {item.year}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
