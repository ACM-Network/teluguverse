'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useStore } from '@/store/useStore'
import { ContentItem } from '@/types'
import ContentCard from '@/components/ui/ContentCard'
import SectionHeader from '@/components/ui/SectionHeader'
import PremiumIcon from '@/components/ui/PremiumIcon'

const TYPE_COLORS: Record<string,string> = { MOVIE:'#E50914',ANIME:'#a855f7',SERIES:'#3b82f6',KDRAMA:'#ec4899',CARTOON:'#22c55e',HOLLYWOOD:'#f59e0b',DOCUMENTARY:'#06b6d4' }
const TYPE_EMOJIS: Record<string,string> = { MOVIE:'🎬',ANIME:'⚡',SERIES:'📺',KDRAMA:'🌸',CARTOON:'🎭',HOLLYWOOD:'🎪',DOCUMENTARY:'📽️' }

export default function WatchlistPage() {
  const { watchlist, toggleWatchlist, user } = useStore()
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    if (!user) return
    setLoading(true)
    fetch('/api/user/watchlist', { headers: { Authorization: `Bearer ${useStore.getState().token}` } })
      .then(r => r.json())
      .then(d => { setItems(d.map((w: any) => w.content)); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  const filtered = filter ? items.filter(i => i.type === filter) : items

  if (!user) return (
    <div className="min-h-screen bg-dark flex items-center justify-center pt-16 text-center px-4">
      <div className="flex flex-col items-center justify-center">
        <PremiumIcon name="watchlist" size={60} className="mb-6 text-yellow-500/50" />
        <h2 className="font-cinzel text-2xl font-bold text-white mb-3">Sign In to View Watchlist</h2>
        <p className="font-telugu text-gray-500 mb-6">మీ వాచ్‌లిస్ట్ చూడటానికి లాగిన్ చేయండి</p>
        <Link href="/auth/login"
          className="px-8 py-3 rounded-xl font-cinzel font-bold text-black text-sm"
          style={{background:'linear-gradient(135deg,#FFD700,#FFA500)'}}>
          Sign In
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark pt-24 pb-16">
      <div className="container-tv">
        <SectionHeader 
          title="My Watchlist" 
          titleTe={`నా వాచ్‌లిస్ట్ • ${items.length} titles`}
          icon="watchlist"
          description="Keep track of all the movies, anime, and series you plan to watch."
        />

        {items.length > 0 && (
          <div className="flex gap-2.5 flex-wrap mb-10">
            {[
              { v: '', l: 'All', icon: '' },
              { v: 'MOVIE', l: 'Movies', icon: 'movies' },
              { v: 'ANIME', l: 'Anime', icon: 'anime' },
              { v: 'SERIES', l: 'Series', icon: 'series' },
              { v: 'KDRAMA', l: 'K-Drama', icon: 'kdrama' }
            ].map(tab => (
              <button 
                key={tab.v} 
                onClick={() => setFilter(tab.v)}
                className={`px-4.5 py-2.5 rounded-xl text-xs font-bold font-rajdhani tracking-wider uppercase transition-all duration-300 border flex items-center gap-2 ${
                  filter === tab.v
                    ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400 shadow-[0_4px_15px_rgba(255,215,0,0.08)]'
                    : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-yellow-400/20 hover:text-yellow-400'
                }`}
              >
                {tab.icon && <PremiumIcon name={tab.icon} size={12} />}
                {tab.l}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({length:12}).map((_,i) => <div key={i} className="aspect-[2/3] rounded-xl bg-surface shimmer" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center justify-center">
            <PremiumIcon name="movies" size={64} className="mb-6 text-yellow-500/50" />
            <h2 className="font-cinzel text-2xl font-bold text-white mb-3">
              {items.length === 0 ? 'Your watchlist is empty' : 'No items match filter'}
            </h2>
            <p className="font-telugu text-gray-500 mb-8">
              {items.length === 0 ? 'చూడాలనుకున్న కంటెంట్ వాచ్‌లిస్ట్‌కు జోడించండి' : 'ఈ ఫిల్టర్‌కు సరిపోయే కంటెంట్ లేదు'}
            </p>
            {items.length === 0 && (
              <Link href="/search" className="px-8 py-3 rounded-xl font-cinzel font-bold text-black text-sm"
                style={{background:'linear-gradient(135deg,#FFD700,#FFA500)'}}>
                Browse Content
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            <AnimatePresence>
              {filtered.map((item, i) => (
                <div key={item.id} className="relative group">
                  <ContentCard content={item} index={i} size="lg" />
                  <button 
                    onClick={() => toggleWatchlist(item.id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-black/85 border border-white/20 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 hover:border-red-500 hover:scale-105 z-30 shadow-lg"
                    title="Remove from watchlist"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
