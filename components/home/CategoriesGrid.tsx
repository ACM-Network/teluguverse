'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import CategoryIcon from '@/components/ui/CategoryIcon'
import SectionHeader from '@/components/ui/SectionHeader'

const CATEGORIES = [
  { name: 'Movies', nameTe: 'సినిమాలు', count: '12,450+', href: '/search?type=MOVIE', color: '#E50914' },
  { name: 'Anime', nameTe: 'అనిమే', count: '8,200+', href: '/search?type=ANIME', color: '#A855F7' },
  { name: 'K-Dramas', nameTe: 'కొరియన్ డ్రామా', count: '3,100+', href: '/search?type=KDRAMA', color: '#EC4899' },
  { name: 'Web Series', nameTe: 'వెబ్ సిరీస్', count: '5,600+', href: '/search?type=SERIES', color: '#3B82F6' },
  { name: 'Cartoons', nameTe: 'కార్టూన్లు', count: '4,300+', href: '/search?type=CARTOON', color: '#22C55E' },
  { name: 'Hollywood', nameTe: 'హాలీవుడ్', count: '9,800+', href: '/search?type=HOLLYWOOD', color: '#F59E0B' },
  { name: 'OTT Originals', nameTe: 'OTT ఒరిజినల్స్', count: '2,100+', href: '/search?sort=popular', color: '#06B6D4' },
  { name: 'Award Winners', nameTe: 'అవార్డ్ విజేతలు', count: '1,200+', href: '/search?sort=rating', color: '#FFD700' },
]

export default function CategoriesGrid() {
  return (
    <div className="relative">
      <SectionHeader 
        title="Browse by Category" 
        titleTe="వర్గం వారీగా చూడండి" 
        description="Explore curated collections across diverse entertainment universes and genres"
      />
      
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mt-6">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
          >
            <Link
              href={cat.href}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-surface border border-white/5 hover:border-yellow-400/35 hover:bg-surface-2 transition-all duration-300 group text-center select-none cursor-pointer relative overflow-hidden"
              style={{
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
              }}
            >
              {/* Category Icon with hover animation container */}
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center bg-white/5 border border-white/5 group-hover:bg-yellow-400/10 group-hover:border-yellow-400/20 group-hover:scale-110 transition-all duration-300"
                style={{
                  boxShadow: 'inset 0 0 10px rgba(255,255,255,0.02)',
                }}
              >
                <CategoryIcon name={cat.name} size={30} />
              </div>

              <div className="flex flex-col gap-0.5 mt-1">
                <span className="text-white text-sm font-bold font-rajdhani tracking-wide group-hover:text-yellow-400 transition-colors">
                  {cat.name}
                </span>
                <span className="font-telugu text-gray-500 text-[10px] tracking-normal leading-normal">
                  {cat.nameTe}
                </span>
              </div>

              <span 
                className="font-bold text-[11px] font-rajdhani mt-2 px-2.5 py-0.5 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors"
                style={{ color: cat.color }}
              >
                {cat.count}
              </span>

              {/* Ambient Glow Effect matching the category color */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
                style={{
                  background: `radial-gradient(circle 50px at 50% 50%, ${cat.color}15, transparent 100%)`,
                }}
              />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

