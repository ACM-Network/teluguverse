'use client'
import { motion } from 'framer-motion'

const STATS = [
  { num: '50,000+', label: 'Titles in Database', labelTe: 'డేటాబేస్‌లో శీర్షికలు' },
  { num: '2.8M+', label: 'Active Users', labelTe: 'యాక్టివ్ వినియోగదారులు' },
  { num: '15,000+', label: 'Telugu Dubbed', labelTe: 'తెలుగు డబ్ అందుబాటులో' },
  { num: '320+', label: 'OTT Platforms', labelTe: 'OTT వేదికలు' },
]

export default function StatsBar() {
  return (
    <div className="bg-surface border-y border-border relative z-10">
      <div className="container-tv py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {STATS.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`text-center py-2 ${i < STATS.length - 1 ? 'border-r border-border' : ''}`}>
              <p className="font-cinzel text-2xl font-black gradient-text-cinema">{s.num}</p>
              <p className="text-gray-400 text-xs font-bold font-rajdhani uppercase tracking-wider mt-1">{s.label}</p>
              <p className="font-telugu text-gray-600 text-[10px] mt-0.5">{s.labelTe}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
