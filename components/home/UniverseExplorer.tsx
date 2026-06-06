'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import SectionHeader from '@/components/ui/SectionHeader'

const UNIVERSES = [
  {
    key: 'mcu',
    name: 'Marvel Cinematic Universe',
    nameTe: 'మార్వెల్ యూనివర్స్',
    movies: 28,
    series: 12,
    color: '#E50914',
    border: 'rgba(229,9,20,0.45)',
    gradient: 'linear-gradient(135deg, rgba(229,9,20,0.25) 0%, rgba(150,30,30,0.1) 40%, rgba(7,8,16,0.97) 100%)',
  },
  {
    key: 'dc',
    name: 'DC Universe',
    nameTe: 'DC యూనివర్స్',
    movies: 12,
    series: 3,
    color: '#00A8E0',
    border: 'rgba(0,168,224,0.45)',
    gradient: 'linear-gradient(135deg, rgba(0,168,224,0.22) 0%, rgba(0,60,120,0.08) 40%, rgba(7,8,16,0.97) 100%)',
  },
  {
    key: 'baahubali',
    name: 'Baahubali Universe',
    nameTe: 'బాహుబలి విశ్వం',
    movies: 2,
    series: 2,
    color: '#F59E0B',
    border: 'rgba(245,158,11,0.45)',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.25) 0%, rgba(180,120,10,0.08) 40%, rgba(7,8,16,0.97) 100%)',
  },
  {
    key: 'onepiece',
    name: 'One Piece World',
    nameTe: 'వన్ పీస్ జగత్తు',
    movies: 15,
    series: 1,
    color: '#A855F7',
    border: 'rgba(168,85,247,0.45)',
    gradient: 'linear-gradient(135deg, rgba(168,85,247,0.25) 0%, rgba(100,40,200,0.08) 40%, rgba(7,8,16,0.97) 100%)',
  },
  {
    key: 'monsterverse',
    name: 'Monsterverse',
    nameTe: 'మాన్స్టర్వర్స్',
    movies: 5,
    series: 1,
    color: '#22C55E',
    border: 'rgba(34,197,94,0.45)',
    gradient: 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(15,100,50,0.08) 40%, rgba(7,8,16,0.97) 100%)',
  },
  {
    key: 'lcu',
    name: 'Lokesh Cinematic Universe',
    nameTe: 'లోకేష్ సినిమాటిక్ యూనివర్స్',
    movies: 5,
    series: 1,
    color: '#06B6D4',
    border: 'rgba(6,182,212,0.45)',
    gradient: 'linear-gradient(135deg, rgba(6,182,212,0.25) 0%, rgba(3,90,110,0.08) 40%, rgba(7,8,16,0.97) 100%)',
  },
]

const UNIVERSE_BACKDROPS: Record<string, string> = {
  mcu: 'https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg', // Endgame
  dc: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg', // The Batman
  baahubali: 'https://image.tmdb.org/t/p/w500/whNjsTOUVg2lZLCKgGhnACnmV8E.jpg', // Baahubali 2
  onepiece: 'https://image.tmdb.org/t/p/w500/8ibfhe4P7rhmn3lrPhOZzIJHA2B.jpg', // Film Red
  monsterverse: 'https://image.tmdb.org/t/p/w500/pgqgaUx1cJb5oZQQ5v0tNARCeBp.jpg', // Godzilla vs Kong
  lcu: 'https://image.tmdb.org/t/p/w500/dkIX4dSMuVqjfrPGunBJUR7K3LQ.jpg', // Vikram
}

interface UniverseCardProps {
  u: typeof UNIVERSES[0]
}

function UniverseCard({ u }: UniverseCardProps) {
  const [hasError, setHasError] = useState(false)
  const backdrop = UNIVERSE_BACKDROPS[u.key] || ''

  return (
    <Link
      href={`/universe/${u.key}`}
      className="block relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/10] cursor-pointer group border transition-all duration-500 md:hover:-translate-y-2 md:hover:shadow-[0_18px_40px_rgba(0,0,0,0.6)]"
      style={{ background: u.gradient, borderColor: 'rgba(255,255,255,0.05)' }}
    >
      {/* Hover border glow (desktop only) */}
      <div
        className="absolute inset-0 rounded-2xl border border-transparent md:group-hover:border-current opacity-0 md:group-hover:opacity-100 transition-all duration-500 pointer-events-none z-30"
        style={{ color: u.border }}
      />

      {/* Backdrop Image cover */}
      {backdrop && !hasError && (
        <div className="absolute inset-0 w-full h-full select-none pointer-events-none z-0">
          <Image
            src={backdrop}
            alt={u.name}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover opacity-45 group-hover:opacity-65 transition-opacity duration-500"
            onError={() => setHasError(true)}
            loading="lazy"
          />
        </div>
      )}

      {/* Gradient bottom plate */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4 z-20"
        style={{
          background: 'linear-gradient(to top, rgba(7,8,16,0.95) 0%, rgba(7,8,16,0.5) 60%, rgba(7,8,16,0) 100%)',
        }}
      >
        <p className="font-cinzel text-[11px] font-black text-white leading-tight tracking-wider group-hover:text-yellow-400 transition-colors duration-300 truncate">
          {u.name}
        </p>

        <div className="flex items-center justify-between gap-1.5 mt-1.5 border-t border-white/5 pt-1.5">
          <span className="font-telugu text-gray-400 text-[9px] truncate leading-none">
            {u.nameTe}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-[8px] font-bold font-rajdhani uppercase tracking-wider leading-none" style={{ color: u.color }}>
            {u.movies} {u.movies === 1 && u.key === 'onepiece' ? 'Anime' : 'Movies'}
          </span>
          <span className="text-white/15 text-[8px]">•</span>
          <span className="text-[8px] font-bold font-rajdhani uppercase tracking-wider leading-none" style={{ color: u.color }}>
            {u.series} Series
          </span>
        </div>
      </div>

      {/* Hover backglow (desktop only) */}
      <div
        className="absolute inset-0 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0 hidden md:block"
        style={{ background: `radial-gradient(circle at 50% 40%, ${u.color}15, transparent 65%)` }}
      />
    </Link>
  )
}

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
            transition={{ delay: i * 0.05, duration: 0.45 }}
          >
            <UniverseCard u={u} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
