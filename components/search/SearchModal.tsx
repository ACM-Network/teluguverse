'use client'
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { useSearch } from '@/hooks/useSearch'

const TYPE_COLORS: Record<string, string> = {
  MOVIE: '#E50914', ANIME: '#a855f7', SERIES: '#3b82f6', KDRAMA: '#ec4899',
  CARTOON: '#22c55e', HOLLYWOOD: '#f59e0b', DOCUMENTARY: '#06b6d4'
}
const TYPE_EMOJIS: Record<string, string> = {
  MOVIE: '🎬', ANIME: '⚡', SERIES: '📺', KDRAMA: '🌸', CARTOON: '🎭', HOLLYWOOD: '🎪', DOCUMENTARY: '📽️'
}

export default function SearchModal() {
  const { isSearchOpen, closeSearch } = useStore()
  const { query, setQuery, suggestions, trendingSearches, recentSearches, isLoading, addRecentSearch, clearRecentSearches } = useSearch()
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isSearchOpen) { setTimeout(() => inputRef.current?.focus(), 100) }
    else { setQuery('') }
  }, [isSearchOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch()
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); isSearchOpen ? closeSearch() : useStore.getState().openSearch() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isSearchOpen])

  const handleSearch = (q: string) => {
    if (!q.trim()) return
    addRecentSearch(q)
    router.push(`/search?q=${encodeURIComponent(q)}`)
    closeSearch()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch(query)
  }

  const FILTER_CHIPS = ['Movies', 'Anime', 'K-Dramas', 'Series', 'Telugu Dub ✓', '2024', '2023', 'Netflix', 'Prime', 'Hotstar']

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex flex-col"
          style={{ background: 'rgba(7,8,16,0.97)', backdropFilter: 'blur(24px)' }}
          onClick={(e) => e.target === e.currentTarget && closeSearch()}>

          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.05 }} className="w-full max-w-3xl mx-auto px-6 pt-28">

            {/* Search Input */}
            <div className="relative mb-5">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</div>
              <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="Search movies, anime, series... / సినిమాలు వెతకండి..."
                className="w-full bg-white/5 border-2 border-yellow-400/30 focus:border-yellow-400/70 rounded-2xl py-5 pl-14 pr-20 text-white text-xl font-rajdhani outline-none transition-all placeholder:text-gray-600"
                style={{ boxShadow: '0 0 40px rgba(255,215,0,0.1)' }} />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xl transition-colors">✕</button>
              )}
              <button onClick={() => handleSearch(query)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-3 py-1.5 rounded-lg text-sm transition-all font-rajdhani">
                Go
              </button>
            </div>

            {/* Filter chips */}
            <div className="flex gap-2 flex-wrap mb-6">
              {FILTER_CHIPS.map((chip) => (
                <button key={chip} onClick={() => handleSearch(chip)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold font-rajdhani tracking-wide text-gray-300 bg-white/5 border border-white/10 hover:border-yellow-400/50 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all">
                  {chip}
                </button>
              ))}
            </div>

            {/* Suggestions when typing */}
            {query.length >= 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
                {isLoading ? (
                  <div className="space-y-2">
                    {[1,2,3].map(i => <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />)}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {suggestions.content.map((item) => (
                      <Link key={item.id} href={`/content/${item.slug}`} onClick={() => { addRecentSearch(item.titleEnglish); closeSearch() }}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/10">
                        <div className="w-10 h-14 rounded-lg flex items-center justify-center text-xl flex-none"
                          style={{ background: `${TYPE_COLORS[item.type]}22`, border: `1px solid ${TYPE_COLORS[item.type]}33` }}>
                          {TYPE_EMOJIS[item.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold font-rajdhani truncate group-hover:text-yellow-400 transition-colors">{item.titleEnglish}</p>
                          {item.titleTelugu && <p className="text-gray-500 text-xs font-telugu">{item.titleTelugu}</p>}
                        </div>
                        <div className="flex items-center gap-3 flex-none">
                          {item.imdbRating && <span className="text-yellow-400 text-sm font-bold font-rajdhani">★ {item.imdbRating}</span>}
                          <span className="text-xs font-bold px-2 py-0.5 rounded font-rajdhani" style={{ background: `${TYPE_COLORS[item.type]}20`, color: TYPE_COLORS[item.type] }}>
                            {item.type}
                          </span>
                          {item.year && <span className="text-gray-500 text-xs">{item.year}</span>}
                        </div>
                      </Link>
                    ))}
                    {suggestions.queries.map((q, i) => (
                      <button key={i} onClick={() => handleSearch(q)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-left">
                        <span className="text-gray-500">🔍</span>
                        <span className="text-gray-300 font-rajdhani">{q}</span>
                        <span className="ml-auto text-gray-600 text-xs">Search</span>
                      </button>
                    ))}
                    {suggestions.content.length === 0 && suggestions.queries.length === 0 && (
                      <p className="text-gray-500 text-center py-6 font-rajdhani">No results for "<span className="text-yellow-400">{query}</span>"</p>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Default: Recent + Trending */}
            {query.length < 2 && (
              <div className="grid grid-cols-2 gap-8">
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-gray-400 text-xs font-bold font-rajdhani tracking-widest uppercase">Recent Searches</p>
                      <button onClick={clearRecentSearches} className="text-gray-600 text-xs hover:text-yellow-400 transition-colors font-rajdhani">Clear</button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((s, i) => (
                        <button key={i} onClick={() => handleSearch(s)}
                          className="w-full flex items-center gap-3 py-2 text-left text-gray-300 hover:text-yellow-400 transition-colors font-rajdhani text-sm">
                          <span className="text-gray-600">🕐</span> {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {trendingSearches.length > 0 && (
                  <div>
                    <p className="text-gray-400 text-xs font-bold font-rajdhani tracking-widest uppercase mb-3">🔥 Trending Searches</p>
                    <div className="space-y-1">
                      {trendingSearches.slice(0, 8).map((s, i) => (
                        <button key={i} onClick={() => handleSearch(s.query)}
                          className="w-full flex items-center gap-3 py-2 text-left text-gray-300 hover:text-yellow-400 transition-colors font-rajdhani text-sm">
                          <span className={`font-cinzel font-black text-base ${i < 3 ? 'text-yellow-400' : 'text-gray-600'}`}>{i + 1}</span>
                          <span className="flex-1">{s.query}</span>
                          <span className="text-gray-600 text-xs">{s.count.toLocaleString()}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Close hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 text-gray-600 text-xs font-rajdhani">
            <span className="border border-gray-700 rounded px-2 py-1">ESC</span>
            <span>to close</span>
            <span className="border border-gray-700 rounded px-2 py-1">↵</span>
            <span>to search</span>
            <span className="border border-gray-700 rounded px-2 py-1">⌘K</span>
            <span>to open</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
