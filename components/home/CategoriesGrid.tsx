'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import SectionHeader from '@/components/ui/SectionHeader'

interface Genre {
  id: string
  name: string
  nameTe: string
  slug: string
  color: string | null
  icon: string | null
}

const FEATURED_SLUGS = [
  'action', 'adventure', 'fantasy', 'sci-fi', 'mythology',
  'super-hero', 'thriller', 'romance', 'comedy', 'drama'
]

const STATIC_FALLBACK: Genre[] = [
  { id: 'action', name: 'Action', nameTe: 'యాక్షన్', slug: 'action', color: '#E50914', icon: null },
  { id: 'adventure', name: 'Adventure', nameTe: 'అడ్వెంచర్', slug: 'adventure', color: '#10B981', icon: null },
  { id: 'fantasy', name: 'Fantasy', nameTe: 'ఫాంటసీ', slug: 'fantasy', color: '#8B5CF6', icon: null },
  { id: 'sci-fi', name: 'Sci-Fi', nameTe: 'సైన్స్ ఫిక్షన్', slug: 'sci-fi', color: '#06B6D4', icon: null },
  { id: 'mythology', name: 'Mythology', nameTe: 'పౌరాణిక', slug: 'mythology', color: '#FFD700', icon: null },
  { id: 'super-hero', name: 'Superhero', nameTe: 'సూపర్ హీరో', slug: 'super-hero', color: '#EF4444', icon: null },
  { id: 'thriller', name: 'Thriller', nameTe: 'థ్రిల్లర్', slug: 'thriller', color: '#F97316', icon: null },
  { id: 'romance', name: 'Romance', nameTe: 'రొమాన్స్', slug: 'romance', color: '#EC4899', icon: null },
  { id: 'comedy', name: 'Comedy', nameTe: 'కామెడీ', slug: 'comedy', color: '#22C55E', icon: null },
  { id: 'drama', name: 'Drama', nameTe: 'డ్రామా', slug: 'drama', color: '#3B82F6', icon: null },
]

const GENRE_POSTERS: Record<string, string[]> = {
  action: [
    'https://image.tmdb.org/t/p/w185/vZ466h515Tj54tJ222yZYt5sbzn.jpg', // John Wick
    'https://image.tmdb.org/t/p/w185/or06450m4efRLGaOIXOUferXPv1.jpg', // Avengers: Endgame
    'https://image.tmdb.org/t/p/w185/w46Vw53641Rx49642I7mi4Qn1ve.jpg', // Gladiator
  ],
  adventure: [
    'https://image.tmdb.org/t/p/w185/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg', // Interstellar
    'https://image.tmdb.org/t/p/w185/gDzOcq0pfeCeqMBwKIJlSmQpjkZ.jpg', // Lord of the Rings
    'https://image.tmdb.org/t/p/w185/vSNxAJTlD0r02V9sPYpOjqDZXUK.jpg', // Avatar: Way of Water
  ],
  fantasy: [
    'https://image.tmdb.org/t/p/w185/4D7wV02423M3UjPzQL8gV2z874z.jpg', // Harry Potter
    'https://image.tmdb.org/t/p/w185/96gAy2mIY75m91R9233667ZsUIu.jpg', // Baahubali 1
    'https://image.tmdb.org/t/p/w185/xf8PbyQcR5ucXErmZNzdKR0s8ya.jpg', // Avatar
  ],
  'sci-fi': [
    'https://image.tmdb.org/t/p/w185/lh4aG01seRxrScrJ6NZr64lEB4L.jpg', // Matrix
    'https://image.tmdb.org/t/p/w185/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg', // Interstellar
    'https://image.tmdb.org/t/p/w185/tVFRpFw3xTedgPGqxW0AOI8Qhh0.jpg', // Inception
  ],
  mythology: [
    'https://image.tmdb.org/t/p/w185/cTLLcl8g5vYyZ4P9Wd92W414e8J.jpg', // Kantara
    'https://image.tmdb.org/t/p/w185/rstcAnBeCkxNQjNp3YXrF6IP1tW.jpg', // HanuMan
    'https://image.tmdb.org/t/p/w185/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg', // Adipurush
  ],
  'super-hero': [
    'https://image.tmdb.org/t/p/w185/or06450m4efRLGaOIXOUferXPv1.jpg', // Endgame
    'https://image.tmdb.org/t/p/w185/78lPtwv72eTNqFW9COBYI0dWDJa.jpg', // Iron Man
    'https://image.tmdb.org/t/p/w185/qJ2tW6WMUDux911r6m7haRef0WH.jpg', // The Dark Knight
  ],
  thriller: [
    'https://image.tmdb.org/t/p/w185/qJ2tW6WMUDux911r6m7haRef0WH.jpg', // The Dark Knight
    'https://image.tmdb.org/t/p/w185/74xTEgt7R36Fpooo50r9T25onhq.jpg', // The Batman
    'https://image.tmdb.org/t/p/w185/tVFRpFw3xTedgPGqxW0AOI8Qhh0.jpg', // Inception
  ],
  romance: [
    'https://image.tmdb.org/t/p/w185/dB4EDhre2dsC2kxYDavyKWqLQwi.jpg', // Your Name
    'https://image.tmdb.org/t/p/w185/yVtx7Xn9UxNJqvG2BkvhCcmed9S.jpg', // Titanic
    'https://image.tmdb.org/t/p/w185/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg', // La La Land
  ],
  comedy: [
    'https://image.tmdb.org/t/p/w185/fcKH1NQzoTXiYO1OrhaFFwTKhBp.jpg', // 3 Idiots
    'https://image.tmdb.org/t/p/w185/zg19Paur3lVVSh8J4LJVO1wgBIg.jpg', // The Hangover
    'https://image.tmdb.org/t/p/w185/3UoNmOT7E7o7FcGmzTMmcw1WGGU.jpg', // Jathi Ratnalu
  ],
  drama: [
    'https://image.tmdb.org/t/p/w185/arw2tEZmZ5q27wVvSy2tcB6Jzfs.jpg', // Forrest Gump
    'https://image.tmdb.org/t/p/w185/9cqN0z4U7K65RDP5gZ74VBja2b3.jpg', // Shawshank Redemption
    'https://image.tmdb.org/t/p/w185/3bhkrj68VMMlBzR2dqsSy4gfdAS.jpg', // The Godfather
  ],
}

// Genre-specific CSS patterns for visual richness
const GENRE_PATTERNS: Record<string, (color: string) => React.ReactNode> = {
  action: (c) => (
    <svg className="absolute inset-0 w-full h-full opacity-[0.12]" viewBox="0 0 100 100">
      <defs>
        <pattern id="action-p" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M10 0L20 10L10 20L0 10Z" fill="none" stroke={c} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#action-p)" />
      <line x1="0" y1="50" x2="100" y2="50" stroke={c} strokeWidth="0.8" strokeDasharray="4 6" />
      <line x1="50" y1="0" x2="50" y2="100" stroke={c} strokeWidth="0.8" strokeDasharray="4 6" />
    </svg>
  ),
  adventure: (c) => (
    <svg className="absolute inset-0 w-full h-full opacity-[0.12]" viewBox="0 0 100 100">
      <path d="M10 80 L30 30 L50 60 L70 20 L90 70" fill="none" stroke={c} strokeWidth="1.2" />
      <path d="M0 85 L100 85" stroke={c} strokeWidth="0.5" />
      <circle cx="50" cy="15" r="6" fill="none" stroke={c} strokeWidth="0.8" />
    </svg>
  ),
  fantasy: (c) => (
    <svg className="absolute inset-0 w-full h-full opacity-[0.12]" viewBox="0 0 100 100">
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const x = 50 + 30 * Math.cos((angle * Math.PI) / 180)
        const y = 50 + 30 * Math.sin((angle * Math.PI) / 180)
        return <circle key={i} cx={x} cy={y} r="4" fill="none" stroke={c} strokeWidth="0.5" />
      })}
      <circle cx="50" cy="50" r="12" fill="none" stroke={c} strokeWidth="0.8" />
      <circle cx="50" cy="50" r="25" fill="none" stroke={c} strokeWidth="0.4" strokeDasharray="3 3" />
    </svg>
  ),
  'sci-fi': (c) => (
    <svg className="absolute inset-0 w-full h-full opacity-[0.12]" viewBox="0 0 100 100">
      <defs>
        <pattern id="scifi-grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="none" stroke={c} strokeWidth="0.3" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#scifi-grid)" />
      <circle cx="50" cy="50" r="20" fill="none" stroke={c} strokeWidth="0.8" />
      <circle cx="50" cy="50" r="8" fill={`${c}10`} stroke={c} strokeWidth="0.5" />
    </svg>
  ),
  mythology: (c) => (
    <svg className="absolute inset-0 w-full h-full opacity-[0.12]" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="35" fill="none" stroke={c} strokeWidth="0.8" />
      <circle cx="50" cy="50" r="28" fill="none" stroke={c} strokeWidth="0.4" strokeDasharray="5 5" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * 45 * Math.PI) / 180
        return <line key={i} x1="50" y1="50" x2={50 + 35 * Math.cos(a)} y2={50 + 35 * Math.sin(a)} stroke={c} strokeWidth="0.3" />
      })}
    </svg>
  ),
  'super-hero': (c) => (
    <svg className="absolute inset-0 w-full h-full opacity-[0.12]" viewBox="0 0 100 100">
      <polygon points="50,10 61,40 95,40 67,58 78,90 50,70 22,90 33,58 5,40 39,40" fill="none" stroke={c} strokeWidth="0.8" />
      <circle cx="50" cy="48" r="10" fill="none" stroke={c} strokeWidth="0.5" />
    </svg>
  ),
  thriller: (c) => (
    <svg className="absolute inset-0 w-full h-full opacity-[0.12]" viewBox="0 0 100 100">
      <path d="M20 80 Q30 10, 50 50 Q70 90, 80 20" fill="none" stroke={c} strokeWidth="1" />
      <line x1="10" y1="50" x2="90" y2="50" stroke={c} strokeWidth="0.3" strokeDasharray="2 4" />
      <circle cx="50" cy="50" r="3" fill={c} fillOpacity="0.3" />
    </svg>
  ),
  romance: (c) => (
    <svg className="absolute inset-0 w-full h-full opacity-[0.12]" viewBox="0 0 100 100">
      <path d="M50 85 C50 85 15 55 15 35 C15 20 30 15 50 30 C70 15 85 20 85 35 C85 55 50 85 50 85Z" fill="none" stroke={c} strokeWidth="1" />
    </svg>
  ),
  comedy: (c) => (
    <svg className="absolute inset-0 w-full h-full opacity-[0.12]" viewBox="0 0 100 100">
      <circle cx="50" cy="45" r="28" fill="none" stroke={c} strokeWidth="0.8" />
      <circle cx="40" cy="38" r="3" fill={c} fillOpacity="0.4" />
      <circle cx="60" cy="38" r="3" fill={c} fillOpacity="0.4" />
      <path d="M35 52 Q50 65 65 52" fill="none" stroke={c} strokeWidth="1" />
    </svg>
  ),
  drama: (c) => (
    <svg className="absolute inset-0 w-full h-full opacity-[0.12]" viewBox="0 0 100 100">
      <rect x="20" y="20" width="60" height="45" rx="3" fill="none" stroke={c} strokeWidth="0.8" />
      <rect x="25" y="68" width="50" height="8" rx="1" fill="none" stroke={c} strokeWidth="0.5" />
      <line x1="35" y1="20" x2="35" y2="0" stroke={c} strokeWidth="0.5" />
      <circle cx="35" cy="0" r="3" fill="none" stroke={c} strokeWidth="0.5" />
    </svg>
  ),
}

export default function CategoriesGrid() {
  const [genres, setGenres] = useState<Genre[]>(STATIC_FALLBACK)

  useEffect(() => {
    fetch('/api/genres')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const filtered = FEATURED_SLUGS.map(slug => {
            const found = data.find((g: Genre) => g.slug === slug)
            return found || STATIC_FALLBACK.find(s => s.slug === slug)
          }).filter(Boolean) as Genre[]
          setGenres(filtered)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="relative">
      <SectionHeader
        title="Discover By Genre"
        titleTe="శైలి వారీగా చూడండి"
        description="Filter and find content based on your favorite genre and mood"
        icon="genres"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
        {genres.map((genre, i) => {
          const color = genre.color || '#3B82F6'
          const pattern = GENRE_PATTERNS[genre.slug]
          const posters = GENRE_POSTERS[genre.slug] || []
          return (
            <motion.div
              key={genre.slug}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.04, 0.35), duration: 0.45 }}
            >
              <Link
                href={`/search?genre=${genre.slug}`}
                className="relative flex flex-col items-center justify-end rounded-2xl overflow-hidden group cursor-pointer h-[180px] border border-white/[0.04] hover:border-transparent transition-all duration-500"
                style={{
                  background: `linear-gradient(145deg, ${color}28 0%, rgba(7,8,16,0.65) 100%)`,
                }}
              >
                {/* Poster Collage Background */}
                {posters.length > 0 && (
                  <div className="absolute inset-0 flex justify-center items-center gap-1.5 opacity-[0.60] group-hover:opacity-[0.80] transition-opacity duration-500 scale-[0.85] group-hover:scale-95 transition-transform duration-500 select-none pointer-events-none z-0 pb-8">
                    {/* Left poster */}
                    <Image
                      src={posters[0]}
                      alt=""
                      width={48}
                      height={72}
                      className="w-12 h-18 object-cover rounded-lg shadow-md -rotate-12 translate-x-2.5 translate-y-2 border border-white/5"
                      unoptimized
                    />
                    {/* Center poster */}
                    <Image
                      src={posters[1]}
                      alt=""
                      width={56}
                      height={84}
                      className="w-14 h-21 object-cover rounded-lg shadow-xl z-10 border border-white/10"
                      unoptimized
                    />
                    {/* Right poster */}
                    <Image
                      src={posters[2]}
                      alt=""
                      width={48}
                      height={72}
                      className="w-12 h-18 object-cover rounded-lg shadow-md rotate-12 -translate-x-2.5 translate-y-2 border border-white/5"
                      unoptimized
                    />
                  </div>
                )}

                {/* Abstract pattern grid overlay */}
                <div className="absolute inset-0 group-hover:opacity-[0.12] transition-opacity duration-500 z-10 select-none pointer-events-none">
                  {pattern ? pattern(color) : null}
                </div>

                {/* Top glow */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 z-0"
                  style={{ background: color }}
                />

                {/* Gradient bottom plate to shield title text */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1/2 z-20"
                  style={{
                    background: `linear-gradient(to top, rgba(7,8,16,0.9) 0%, rgba(7,8,16,0.3) 60%, rgba(7,8,16,0) 100%)`,
                  }}
                />

                {/* Content text */}
                <div className="relative z-30 p-4 pb-5 text-center w-full">
                  <h3
                    className="text-white text-sm font-bold font-rajdhani tracking-wide group-hover:scale-105 transition-transform duration-300"
                    style={{ color: 'white' }}
                  >
                    {genre.name}
                  </h3>
                  <p className="font-telugu text-[10px] mt-0.5 opacity-60" style={{ color }}>
                    {genre.nameTe}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px] transform translate-y-[2px] group-hover:translate-y-0 transition-transform duration-300 z-30"
                  style={{ background: color }}
                />
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
