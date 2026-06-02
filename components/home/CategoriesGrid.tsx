'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
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
  'action',
  'adventure',
  'fantasy',
  'sci-fi',
  'mythology',
  'super-hero',
  'thriller',
  'romance',
  'comedy',
  'drama'
]

const STATIC_FALLBACK: Genre[] = [
  { id: 'action', name: 'Action', nameTe: 'యాక్షన్', slug: 'action', color: '#E50914', icon: '⚔️' },
  { id: 'adventure', name: 'Adventure', nameTe: 'అడ్వెంచర్', slug: 'adventure', color: '#10B981', icon: '🗺️' },
  { id: 'fantasy', name: 'Fantasy', nameTe: 'ఫాంటసీ', slug: 'fantasy', color: '#8B5CF6', icon: '🔮' },
  { id: 'sci-fi', name: 'Sci-Fi', nameTe: 'సైన్స్ ఫిక్షన్', slug: 'sci-fi', color: '#06B6D4', icon: '🚀' },
  { id: 'mythology', name: 'Mythology', nameTe: 'పౌరాణిక', slug: 'mythology', color: '#FFD700', icon: '🕉️' },
  { id: 'super-hero', name: 'Superhero', nameTe: 'సూపర్ హీరో', slug: 'super-hero', color: '#EF4444', icon: '🦸' },
  { id: 'thriller', name: 'Thriller', nameTe: 'థ్రిల్లర్', slug: 'thriller', color: '#F59E0B', icon: '🎭' },
  { id: 'romance', name: 'Romance', nameTe: 'రొమాన్స్', slug: 'romance', color: '#EC4899', icon: '❤️' },
  { id: 'comedy', name: 'Comedy', nameTe: 'కామెడీ', slug: 'comedy', color: '#22C55E', icon: '😂' },
  { id: 'drama', name: 'Drama', nameTe: 'డ్రామా', slug: 'drama', color: '#3B82F6', icon: '🎬' },
]

export default function CategoriesGrid() {
  const [genres, setGenres] = useState<Genre[]>(STATIC_FALLBACK)

  useEffect(() => {
    fetch('/api/genres')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Keep exactly the 10 featured genres in the correct order
          const filtered = FEATURED_SLUGS.map(slug => {
            const found = data.find(g => g.slug === slug)
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
          const color = genre.color || '#FFD700'
          return (
            <motion.div
              key={genre.slug}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.4 }}
            >
              <Link
                href={`/search?genre=${genre.slug}`}
                className="relative flex flex-col items-center justify-center p-4 rounded-2xl bg-surface/30 border border-white/5 hover:bg-surface/50 transition-all duration-500 group text-center cursor-pointer overflow-hidden h-[120px]"
                style={{
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${color}40`
                  e.currentTarget.style.boxShadow = `0 0 25px ${color}15`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.25)'
                }}
              >
                {/* Icon or emoji */}
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/5 group-hover:bg-white/10 group-hover:border-white/10 group-hover:scale-110 transition-all duration-500 text-xl z-10"
                >
                  {genre.icon || '🎬'}
                </div>

                <div className="flex flex-col gap-0.5 mt-2 z-10">
                  <span className="text-white text-sm font-bold font-rajdhani tracking-wide group-hover:text-yellow-400 transition-colors">
                    {genre.name}
                  </span>
                  <span className="font-telugu text-gray-500 text-[10px]">
                    {genre.nameTe}
                  </span>
                </div>

                {/* Accent glow matching the genre color */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"
                  style={{
                    background: `radial-gradient(circle 60px at 50% 50%, ${color}15, transparent 100%)`,
                  }}
                />
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
