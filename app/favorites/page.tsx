'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useStore } from '@/store/useStore'
import { ContentItem } from '@/types'
import ContentCard from '@/components/ui/ContentCard'
import SectionHeader from '@/components/ui/SectionHeader'
import PremiumIcon from '@/components/ui/PremiumIcon'

export default function FavoritesPage() {
  const { favorites, toggleFavorite, user } = useStore()
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    if (!user) return
    setLoading(true)
    fetch('/api/user/favorites', { headers: { Authorization: `Bearer ${useStore.getState().token}` } })
      .then(r => r.json())
      .then(d => { setItems(d.map((f: any) => f.content)); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  const filtered = filter ? items.filter(i => i.type === filter) : items

  if (!user) return (
    <div className="min-h-screen bg-dark flex items-center justify-center pt-16 text-center px-4">
      <div className="flex flex-col items-center justify-center p-8 bg-surface-2/40 border border-white/5 rounded-3xl backdrop-blur-md">
        <PremiumIcon name="favorite" size={60} className="mb-6 text-red-500/50" />
        <h2 className="font-cinzel text-2xl font-bold text-white mb-3">Sign In to View Favorites</h2>
        <p className="font-telugu text-gray-500 mb-6">మీకు నచ్చిన వాటిని చూడటానికి లాగిన్ చేయండి</p>
        <Link href="/auth/login"
          className="px-8 py-3 rounded-xl font-cinzel font-bold text-black text-sm transition-transform duration-300 hover:scale-[1.03] active:scale-95"
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
          title="My Favorites" 
          titleTe={`నాకు నచ్చినవి • ${items.length} titles`}
          icon="favorite"
          description="A curated showcase of your absolute favorite movies, anime, and series."
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
          <div className="text-center py-16 px-6 flex flex-col items-center justify-center bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md shadow-2xl max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-5 text-2xl border border-red-500/20 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
              ♥
            </div>
            <h3 className="font-rajdhani text-lg font-bold text-white uppercase tracking-wider">
              {items.length === 0 ? 'Your Favorites is Empty' : 'No Matches Found'}
            </h3>
            <p className="font-telugu text-gray-500 text-sm mt-1 mb-6">
              {items.length === 0 ? 'మీకు ఇష్టమైన కంటెంట్‌ను ఇక్కడ భద్రపరుచుకోండి' : 'ఈ ఫిల్టర్ కింద కంటెంట్ లేదు'}
            </p>
            {items.length === 0 && (
              <Link href="/search" className="px-6 py-2.5 rounded-xl font-rajdhani font-bold bg-yellow-500 hover:bg-yellow-400 text-black text-xs uppercase tracking-wider transition-all duration-300 hover:scale-[1.03]">
                Explore Catalog
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
                    onClick={() => {
                      toggleFavorite(item.id)
                      setItems(prev => prev.filter(p => p.id !== item.id))
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-black/85 border border-white/20 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 hover:border-red-500 hover:scale-105 z-30 shadow-lg"
                    title="Remove from favorites"
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
