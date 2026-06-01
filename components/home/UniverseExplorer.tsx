'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'

const UNIVERSES = [
  {
    key: 'mcu',
    name: 'Marvel Cinematic Universe',
    nameTe: 'మార్వెల్ యూనివర్స్',
    count: '33 FILMS',
    grad: 'linear-gradient(135deg, rgba(229, 9, 20, 0.28) 0%, rgba(10, 5, 8, 0.95) 100%)',
    border: 'rgba(229, 9, 20, 0.45)',
    color: '#E50914',
    logo: (color: string) => (
      <svg className="w-16 h-16 opacity-40 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500 z-10" viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="3" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 8L15 28v44l35 20 35-20V28L50 8z" />
        <path d="M50 22L25 36v28l25 14 25-14V36L50 22z" opacity="0.6" />
        <text x="50" y="58" fill={color} fontSize="20" fontWeight="900" fontFamily="var(--font-cinzel)" textAnchor="middle" stroke="none">A</text>
      </svg>
    ),
    bgArt: (color: string) => (
      <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500" style={{ color }}>
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="hexGrid" width="12" height="12" patternUnits="userSpaceOnUse">
              <path d="M6 0 L12 3 L12 9 L6 12 L0 9 L0 3 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#hexGrid)" />
        </svg>
      </div>
    )
  },
  {
    key: 'dc',
    name: 'DC Universe',
    nameTe: 'DC యూనివర్స్',
    count: '15 FILMS',
    grad: 'linear-gradient(135deg, rgba(0, 168, 224, 0.25) 0%, rgba(5, 8, 20, 0.95) 100%)',
    border: 'rgba(0, 168, 224, 0.45)',
    color: '#00A8E0',
    logo: (color: string) => (
      <svg className="w-16 h-16 opacity-40 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500 z-10" viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="3" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="42" />
        <path d="M50 15v70M15 50h70" strokeDasharray="4 4" opacity="0.5" />
        <path d="M28 32h44L50 72L28 32z" fill={`${color}12`} />
        <text x="50" y="58" fill={color} fontSize="20" fontWeight="900" fontFamily="var(--font-cinzel)" textAnchor="middle" stroke="none">DC</text>
      </svg>
    ),
    bgArt: (color: string) => (
      <div className="absolute inset-0 opacity-12 group-hover:opacity-25 transition-opacity duration-500" style={{ color }}>
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.25" strokeDasharray="5 5" />
        </svg>
      </div>
    )
  },
  {
    key: 'rajamouli',
    name: 'Rajamouli Universe',
    nameTe: 'రాజమౌళి యూనివర్స్',
    count: '8 FILMS',
    grad: 'linear-gradient(135deg, rgba(245, 158, 11, 0.28) 0%, rgba(15, 10, 5, 0.95) 100%)',
    border: 'rgba(245, 158, 11, 0.45)',
    color: '#F59E0B',
    logo: (color: string) => (
      <svg className="w-16 h-16 opacity-40 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500 z-10" viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="3" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 25l16 45h44l16-45-20 12-18-22-18 22-20-12z" fill={`${color}10`} />
        <circle cx="50" cy="70" r="5" fill={color} />
        <circle cx="28" cy="25" r="3" fill={color} />
        <circle cx="50" cy="15" r="3" fill={color} />
        <circle cx="72" cy="25" r="3" fill={color} />
      </svg>
    ),
    bgArt: (color: string) => (
      <div className="absolute inset-0 opacity-10 group-hover:opacity-22 transition-opacity duration-500" style={{ color }}>
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <g stroke="currentColor" strokeWidth="0.4">
            {Array.from({ length: 12 }).map((_, idx) => {
              const angle = (idx * 30 * Math.PI) / 180
              const x2 = 50 + 50 * Math.cos(angle)
              const y2 = 50 + 50 * Math.sin(angle)
              return <line key={idx} x1="50" y1="50" x2={x2} y2={y2} />
            })}
          </g>
          <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>
    )
  },
  {
    key: 'onepiece',
    name: 'One Piece World',
    nameTe: 'వన్ పీస్ జగత్తు',
    count: '1000+ EPS',
    grad: 'linear-gradient(135deg, rgba(168, 85, 247, 0.28) 0%, rgba(8, 5, 15, 0.95) 100%)',
    border: 'rgba(168, 85, 247, 0.45)',
    color: '#A855F7',
    logo: (color: string) => (
      <svg className="w-16 h-16 opacity-40 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500 z-10" viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="3" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 15v65M20 45h60" strokeDasharray="4 4" opacity="0.4" />
        <circle cx="50" cy="30" r="12" />
        <path d="M22 55c0 15 12 25 28 25s28-10 28-25" />
        <path d="M14 55h16M70 55h16" />
      </svg>
    ),
    bgArt: (color: string) => (
      <div className="absolute inset-0 opacity-15 group-hover:opacity-28 transition-opacity duration-500" style={{ color }}>
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
          <path d="M0 40 C 20 30, 40 50, 60 40 C 80 30, 100 50, 120 40" />
          <path d="M-20 60 C 10 50, 30 70, 50 60 C 70 50, 90 70, 110 60" />
          <path d="M0 80 C 20 70, 40 90, 60 80 C 80 70, 100 90, 120 80" opacity="0.5" />
        </svg>
      </div>
    )
  },
  {
    key: 'monsterverse',
    name: 'Monsterverse',
    nameTe: 'మాన్స్టర్వర్స్',
    count: '6 FILMS',
    grad: 'linear-gradient(135deg, rgba(34, 197, 94, 0.22) 0%, rgba(5, 10, 8, 0.95) 100%)',
    border: 'rgba(34, 197, 94, 0.45)',
    color: '#22C55E',
    logo: (color: string) => (
      <svg className="w-16 h-16 opacity-40 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500 z-10" viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="3" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 75C25 50 35 25 50 25s25 25 25 50" strokeDasharray="4 4" />
        <path d="M15 80c0-25 15-45 35-45s35 20 35 45H15z" fill={`${color}08`} />
        <path d="M38 45c5-8 19-8 24 0M30 35c8-12 32-12 40 0" opacity="0.7" />
      </svg>
    ),
    bgArt: (color: string) => (
      <div className="absolute inset-0 opacity-10 group-hover:opacity-22 transition-opacity duration-500" style={{ color }}>
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.75">
          <path d="M10 90 L30 15 L50 75 L70 25 L90 85" strokeDasharray="2 2" />
          <path d="M20 90 L40 30 L55 85 L75 35 L85 90" opacity="0.5" />
        </svg>
      </div>
    )
  },
  {
    key: 'telugu',
    name: 'Telugu Cinematic Universe',
    nameTe: 'తెలుగు సినిమా',
    count: '12+ FILMS',
    grad: 'linear-gradient(135deg, rgba(6, 182, 212, 0.28) 0%, rgba(5, 10, 15, 0.95) 100%)',
    border: 'rgba(6, 182, 212, 0.45)',
    color: '#06B6D4',
    logo: (color: string) => (
      <svg className="w-16 h-16 opacity-40 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500 z-10" viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="3" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="35" />
        <circle cx="50" cy="50" r="10" />
        <path d="M50 15v70M15 50h70" />
        <path d="M25 25l50 50M25 75l50-50" opacity="0.5" />
      </svg>
    ),
    bgArt: (color: string) => (
      <div className="absolute inset-0 opacity-10 group-hover:opacity-22 transition-opacity duration-500" style={{ color }}>
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <rect x="5" y="5" width="90" height="90" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>
    )
  }
]

export default function UniverseExplorer() {
  return (
    <div className="relative">
      <SectionHeader
        title="Universe Explorer"
        titleTe="సినిమాటిక్ యూనివర్స్"
        icon="universe"
        description="Traverse across massive entertainment franchises and cinematic universes"
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {UNIVERSES.map((u, i) => (
          <motion.div
            key={u.name}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
          >
            <Link
              href={`/search?universe=${u.key}`}
              className="block relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/10] cursor-pointer group border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
              style={{ background: u.grad, borderColor: 'rgba(255,255,255,0.06)' }}
            >
              {/* Outer border glow on hover */}
              <div 
                className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-current opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-30" 
                style={{ color: u.border }}
              />

              {/* Dynamic stylized background art */}
              {u.bgArt(u.color)}

              {/* Central stylized vector logo */}
              <div className="absolute inset-0 flex items-center justify-center z-10 pt-2 pb-12">
                {u.logo(u.color)}
              </div>

              {/* Gradient Bottom Readability Plate */}
              <div className="absolute bottom-0 left-0 right-0 p-4.5 z-20" style={{ background: 'linear-gradient(to top, rgba(5,6,12,0.98) 0%, rgba(5,6,12,0.7) 65%, transparent 100%)' }}>
                <p className="font-cinzel text-xs font-black text-white leading-tight tracking-wider group-hover:text-yellow-400 transition-colors duration-300 truncate">
                  {u.name}
                </p>
                
                <div className="flex items-center justify-between gap-1.5 mt-1.5 border-t border-white/5 pt-1.5">
                  <span className="font-telugu text-gray-400 text-[10px] truncate leading-none">
                    {u.nameTe}
                  </span>
                  <span className="text-[9px] font-black font-rajdhani uppercase tracking-wider leading-none flex-none" style={{ color: u.color }}>
                    {u.count}
                  </span>
                </div>
              </div>

              {/* Subtle backglow overlay */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
                style={{
                  background: `radial-gradient(circle at 50% 40%, ${u.color}20, transparent 65%)`
                }}
              />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
