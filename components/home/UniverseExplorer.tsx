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

const UNIVERSE_POSTERS: Record<string, string[]> = {
  mcu: [
    'https://image.tmdb.org/t/p/w185/78lPtwv72eTNqFW9COBYI0dWDJa.jpg', // Iron Man
    'https://image.tmdb.org/t/p/w185/or06450m4efRLGaOIXOUferXPv1.jpg', // Avengers Endgame
    'https://image.tmdb.org/t/p/w185/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg', // Avengers Infinity War
  ],
  dc: [
    'https://image.tmdb.org/t/p/w185/qJ2tW6WMUDux911r6m7haRef0WH.jpg', // The Dark Knight
    'https://image.tmdb.org/t/p/w185/74xTEgt7R36Fpooo50r9T25onhq.jpg', // The Batman
    'https://image.tmdb.org/t/p/w185/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg', // Placeholder / generic
  ],
  baahubali: [
    'https://image.tmdb.org/t/p/w185/96gAy2mIY75m91R9233667ZsUIu.jpg', // Baahubali Beginning
    'https://image.tmdb.org/t/p/w185/4D7wV02423M3UjPzQL8gV2z874z.jpg', // Baahubali 2 Conclusion
    'https://image.tmdb.org/t/p/w185/96gAy2mIY75m91R9233667ZsUIu.jpg', // Baahubali 1
  ],
  onepiece: [
    'https://image.tmdb.org/t/p/w185/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg', // One Piece
    'https://image.tmdb.org/t/p/w185/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg', // One Piece Movie
    'https://image.tmdb.org/t/p/w185/fHpKWq9ayzSk8nSwqRuaAUemRKh.jpg', // One Piece Stampede
  ],
  monsterverse: [
    'https://image.tmdb.org/t/p/w185/pgqQM014nFOx251z279a4uR20rZ.jpg', // Godzilla vs Kong
    'https://image.tmdb.org/t/p/w185/fRy9t9ZqE7V7qF6400a40V14.jpg', // Godzilla King of Monsters
    'https://image.tmdb.org/t/p/w185/r25ZicnUzAk03t734Jkcl97g.jpg', // Kong Skull Island
  ],
  lcu: [
    'https://image.tmdb.org/t/p/w185/bCBAw165o5O6V0J1tVtx7Xn9UxN.jpg', // Kaithi
    'https://image.tmdb.org/t/p/w185/1icwY5GgLw5F275o1L7y0bW.jpg', // Vikram / Leo
    'https://image.tmdb.org/t/p/w185/bCBAw165o5O6V0J1tVtx7Xn9UxN.jpg', // Kaithi secondary
  ],
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
            <Link
              href={`/universe/${u.key}`}
              className="block relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/10] cursor-pointer group border transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_18px_40px_rgba(0,0,0,0.6)]"
              style={{ background: u.gradient, borderColor: 'rgba(255,255,255,0.05)' }}
            >
              {/* Hover border glow */}
              <div
                className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-current opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-30"
                style={{ color: u.border }}
              />

              {/* Franchise collage artwork */}
              <div className="absolute inset-0 flex justify-center items-center gap-1.5 opacity-[0.25] group-hover:opacity-[0.45] transition-opacity duration-500 scale-[0.8] group-hover:scale-[0.9] transition-transform duration-500 select-none pointer-events-none z-0 pb-10">
                {/* Left poster */}
                <img
                  src={UNIVERSE_POSTERS[u.key]?.[0]}
                  alt=""
                  className="w-12 aspect-[2/3] object-cover rounded-lg shadow-md -rotate-12 translate-x-2.5 translate-y-2 border border-white/5"
                />
                {/* Center poster */}
                <img
                  src={UNIVERSE_POSTERS[u.key]?.[1]}
                  alt=""
                  className="w-14 aspect-[2/3] object-cover rounded-lg shadow-xl z-10 border border-white/10"
                />
                {/* Right poster */}
                <img
                  src={UNIVERSE_POSTERS[u.key]?.[2]}
                  alt=""
                  className="w-12 aspect-[2/3] object-cover rounded-lg shadow-md rotate-12 -translate-x-2.5 translate-y-2 border border-white/5"
                />
              </div>

              {/* Gradient bottom plate */}
              <div
                className="absolute bottom-0 left-0 right-0 p-4 z-20"
                style={{ background: 'linear-gradient(to top, rgba(7,8,16,0.98) 0%, rgba(7,8,16,0.75) 60%, transparent 100%)' }}
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

              {/* Hover backglow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
                style={{ background: `radial-gradient(circle at 50% 40%, ${u.color}15, transparent 65%)` }}
              />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
