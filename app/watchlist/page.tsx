'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useStore } from '@/store/useStore'
import { ContentItem } from '@/types'

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
      <div>
        <div className="text-7xl mb-6">📋</div>
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
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-cinzel text-4xl font-black text-white mb-1">📋 My Watchlist</h1>
            <p className="font-telugu text-gray-500">నా వాచ్‌లిస్ట్ • {items.length} titles</p>
          </div>
          {items.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {[{v:'',l:'All'},{v:'MOVIE',l:'Movies'},{v:'ANIME',l:'Anime'},{v:'SERIES',l:'Series'},{v:'KDRAMA',l:'K-Drama'}].map(tab => (
                <button key={tab.v} onClick={() => setFilter(tab.v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-rajdhani border transition-all ${filter===tab.v?'bg-yellow-500/20 border-yellow-500/50 text-yellow-400':'bg-surface border-border text-gray-400 hover:border-yellow-400/30'}`}>
                  {tab.l}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({length:12}).map((_,i) => <div key={i} className="aspect-[2/3] rounded-xl bg-surface shimmer" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-8xl mb-6">🎬</div>
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
                <motion.div key={item.id} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.9}} transition={{delay:i*0.04}}
                  className="relative group">
                  <Link href={`/content/${item.slug}`}>
                    <div className="aspect-[2/3] rounded-xl overflow-hidden border border-border hover:border-yellow-400/40 transition-all group-hover:-translate-y-1">
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2"
                        style={{background:`linear-gradient(135deg,${TYPE_COLORS[item.type]||'#FFD700'}18,${TYPE_COLORS[item.type]||'#FFD700'}05)`}}>
                        <span className="text-4xl">{TYPE_EMOJIS[item.type]||'🎬'}</span>
                        <span className="text-xs font-bold text-center px-2 text-gray-400 font-rajdhani line-clamp-2">{item.titleEnglish}</span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3"
                        style={{background:'linear-gradient(to top,rgba(7,8,16,1) 0%,transparent 100%)'}}>
                        <p className="text-white text-xs font-bold font-rajdhani truncate">{item.titleEnglish}</p>
                        {item.titleTelugu && <p className="font-telugu text-gray-500 text-[10px] truncate">{item.titleTelugu}</p>}
                        <div className="flex items-center gap-1 mt-1">
                          {item.imdbRating && <span className="text-yellow-400 text-[10px] font-bold">★ {item.imdbRating}</span>}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <button onClick={() => toggleWatchlist(item.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/80 border border-white/20 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/80 hover:border-red-500/50"
                    title="Remove from watchlist">
                    ✕
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
