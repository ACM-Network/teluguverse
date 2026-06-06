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

const GENRE_BACKDROPS: Record<string, string> = {
  action: 'https://image.tmdb.org/t/p/w500/i0Y0wP8H6SRgjr6QmuwbtQbS24D.jpg', // RRR
  adventure: 'https://image.tmdb.org/t/p/w500/xJHokZ82w2iVvnh84Pa2QGcd3N1.jpg', // Interstellar
  fantasy: 'https://image.tmdb.org/t/p/w500/whNjsTOUVg2lZLCKgGhnACnmV8E.jpg', // Baahubali 2
  'sci-fi': 'https://image.tmdb.org/t/p/w500/o8XSR1SONnjcsv84NRu6Mwsl5io.jpg', // Kalki 2898 AD
  mythology: 'https://image.tmdb.org/t/p/w500/evUpfs4dw7AuZ5k8dkePVMFSg0T.jpg', // HanuMan
  'super-hero': 'https://image.tmdb.org/t/p/w500/7RyGgVw3LyjmdvOk7mM5iB8e8gc.jpg', // Endgame
  thriller: 'https://image.tmdb.org/t/p/w500/tVFRpFw3xTedgPGqxW0AOI8Qhh0.jpg', // Inception
  romance: 'https://image.tmdb.org/t/p/w500/dIWwZWjMjzoP1qiPgOiWltw0nJ0.jpg', // Your Name
  comedy: 'https://image.tmdb.org/t/p/w500/5SDMPORslLXaYPx7S1kRqsBJYI3.jpg', // Ala Vaikunthapurramuloo
  drama: 'https://image.tmdb.org/t/p/w500/6JdOkSgd8wkAQbT6Ncib4DrnyiS.jpg', // Rangasthalam
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
          const backdrop = GENRE_BACKDROPS[genre.slug] || ''
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
                {/* Backdrop Image Background */}
                {backdrop && (
                  <div className="absolute inset-0 w-full h-full select-none pointer-events-none z-0">
                    <Image
                      src={backdrop}
                      alt={genre.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover opacity-35 group-hover:opacity-55 transition-opacity duration-500"
                      loading="lazy"
                    />
                  </div>
                )}

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
