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
    <div className="bg-dark-2/65 backdrop-blur-md border-y border-white/5 relative z-10 select-none">
      <div className="container-tv py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
          {STATS.map((s, i) => (
            <motion.div 
              key={s.label} 
              initial={{ opacity: 0, y: 12 }} 
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className={`text-center py-2.5 px-4 ${i < STATS.length - 1 ? 'md:border-r md:border-white/5' : ''}`}
            >
              <p className="font-cinzel text-base md:text-xl font-extrabold tracking-widest gradient-text-cinema leading-tight uppercase">
                {s.num}
              </p>
              <p className="text-gray-300 text-[10px] md:text-xs font-bold font-rajdhani uppercase tracking-[0.12em] mt-1.5 leading-none">
                {s.label}
              </p>
              <p className="font-telugu text-gray-500 text-[10px] mt-1 leading-normal">
                {s.labelTe}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

