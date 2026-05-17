'use client'
import { motion } from 'framer-motion'

const STATS = [
  {
    num: 'DISCOVER',
    label: 'MOVIES • ANIME • SERIES',
    labelTe: 'కొత్త వినోదాన్ని కనుగొనండి',
  },
  {
    num: 'WHERE TO WATCH',
    label: 'FIND OTT AVAILABILITY',
    labelTe: 'ఏ OTTలో ఉందో తెలుసుకోండి',
  },
  {
    num: 'TELUGU DUBS',
    label: 'DUBBED & SUBTITLED CONTENT',
    labelTe: 'తెలుగు డబ్బింగ్ & సబ్‌టైటిల్స్',
  },
  {
    num: 'TRENDING NOW',
    label: 'LATEST POPULAR CONTENT',
    labelTe: 'ప్రస్తుతం ట్రెండింగ్ వినోదం',
  },
]

export default function StatsBar() {
  return (
    <div className="bg-surface border-y border-border relative z-10">
      <div className="container-tv py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {STATS.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`text-center py-2 ${i < STATS.length - 1 ? 'border-r border-border' : ''}`}>
              <p className="font-cinzel text-lg md:text-2xl font-black gradient-text-cinema leading-tight"></p>
              <p className="text-gray-400 text-xs font-bold font-rajdhani uppercase tracking-wider mt-1">{s.label}</p>
              <p className="font-telugu text-gray-600 text-[10px] mt-0.5">{s.labelTe}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
