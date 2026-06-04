'use client'
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { useSearch } from '@/hooks/useSearch'
import ContentCard from '@/components/ui/ContentCard'
import PremiumIcon from '@/components/ui/PremiumIcon'

const TYPE_COLORS: Record<string, string> = {
  MOVIE: '#E50914', ANIME: '#a855f7', SERIES: '#3b82f6', KDRAMA: '#ec4899',
  CARTOON: '#22c55e', HOLLYWOOD: '#f59e0b', DOCUMENTARY: '#06b6d4'
}

export default function SearchModal() {
  const { isSearchOpen, closeSearch } = useStore()
  const { query, setQuery, suggestions, trendingSearches, recentSearches, isLoading, addRecentSearch, clearRecentSearches } = useSearch()
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isSearchOpen) { setTimeout(() => inputRef.current?.focus(), 100) }
    else { setQuery('') }
  }, [isSearchOpen, setQuery])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch()
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); isSearchOpen ? closeSearch() : useStore.getState().openSearch() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isSearchOpen, closeSearch])

  const handleSearch = (q: string) => {
    if (!q.trim()) return
    addRecentSearch(q)
    router.push(`/search?q=${encodeURIComponent(q)}`)
    closeSearch()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch(query)
  }

  const FILTER_CHIPS = ['Movies', 'Anime', 'K-Dramas', 'Series', '2024', '2023', 'Netflix', 'Prime', 'JioHotstar']

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex flex-col overflow-y-auto backdrop-blur-[30px]"
          style={{ background: 'rgba(7,8,16,0.92)' }}
          onClick={(e) => e.target === e.currentTarget && closeSearch()}>

          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.05 }} className="w-full max-w-5xl mx-auto px-6 pt-24 pb-12">

            {/* Search Input */}
            <div className="relative mb-5 max-w-3xl mx-auto">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">
                <PremiumIcon name="search" size={18} />
              </span>
              <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="Search movies, anime, series... / సినిమాలు వెతకండి..."
                className="w-full bg-white/[0.03] backdrop-blur-md border border-white/10 focus:border-white/25 rounded-2xl py-[18px] pl-14 pr-20 text-white text-lg font-rajdhani outline-none transition-all placeholder:text-gray-500 shadow-2xl focus:shadow-[0_0_30px_rgba(255,255,255,0.05)]" />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button onClick={() => handleSearch(query)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-200 text-black font-bold px-3.5 py-1.5 rounded-xl text-sm transition-all font-rajdhani">
                Go
              </button>
            </div>

            {/* Filter chips */}
            <div className="flex gap-2 flex-wrap mb-8 justify-center max-w-3xl mx-auto">
              {FILTER_CHIPS.map((chip) => (
                <button key={chip} onClick={() => handleSearch(chip)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold font-rajdhani tracking-wide text-gray-300 bg-white/5 border border-white/10 hover:border-white/25 hover:text-white hover:bg-white/[0.08] transition-all">
                  {chip}
                </button>
              ))}
            </div>

            {/* Suggestions when typing */}
            {query.length >= 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 overflow-y-auto max-h-[65vh] scrollbar-none pr-1">
                {isLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="aspect-[2/3] rounded-2xl bg-white/5 animate-pulse border border-white/5" />
                    ))}
                  </div>
                ) : (() => {
                  const moviesRes = suggestions.content.filter(x => x.type === 'MOVIE' || x.type === 'HOLLYWOOD');
                  const animeRes = suggestions.content.filter(x => x.type === 'ANIME');
                  const seriesRes = suggestions.content.filter(x => x.type === 'SERIES' || x.type === 'KDRAMA');
                  const universeRes = suggestions.universes || [];
                  const totalCount = moviesRes.length + animeRes.length + seriesRes.length + universeRes.length;

                  if (totalCount === 0 && suggestions.queries.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md shadow-2xl text-center max-w-md mx-auto">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                          <PremiumIcon name="search" size={24} />
                        </div>
                        <h4 className="text-white text-base font-bold font-rajdhani tracking-wide uppercase">No Matches Found</h4>
                        <p className="text-gray-400 font-telugu text-sm mt-1">సరైన ఫలితాలు లభించలేదు. మరొక పదం ప్రయత్నించండి.</p>
                        <p className="text-gray-500 text-xs font-rajdhani mt-3">We couldn&apos;t find any matches for &quot;{query}&quot;. Check spelling or try searching genres or universes.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-8 pb-10">
                      {/* Universes */}
                      {universeRes.length > 0 && (
                        <div>
                          <p className="text-gray-500 text-[10px] font-black tracking-widest uppercase mb-3 flex items-center gap-1.5">
                            <PremiumIcon name="universe" size={12} /> Universes
                          </p>
                          <div className="flex gap-2.5 flex-wrap">
                            {universeRes.map((uni: any) => (
                              <Link key={uni.id} href={`/universe/${uni.id}`} onClick={() => { addRecentSearch(uni.name); closeSearch() }}
                                className="px-4 py-2.5 rounded-xl border font-bold text-xs tracking-wide transition-all hover:scale-[1.02] font-rajdhani flex items-center gap-2"
                                style={{
                                  background: `${uni.color || '#06B6D4'}12`,
                                  borderColor: `${uni.color || '#06B6D4'}25`,
                                  color: uni.color || '#06B6D4'
                                }}>
                                <PremiumIcon name="universe" size={12} />
                                <span className="text-white">{uni.name}</span>
                                {uni.nameTe && <span className="text-gray-400 font-normal text-[11px] font-telugu">({uni.nameTe})</span>}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Movies */}
                      {moviesRes.length > 0 && (
                        <div>
                          <p className="text-gray-400 text-xs font-black tracking-widest uppercase mb-4 flex items-center gap-2 font-rajdhani">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> Movies / సినిమాలు ({moviesRes.length})
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {moviesRes.map((item, i) => (
                              <div key={item.id} onClickCapture={() => { addRecentSearch(item.titleEnglish); closeSearch() }} className="hover:scale-[1.03] transition-all">
                                <ContentCard content={item as any} index={i} size="sm" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Anime */}
                      {animeRes.length > 0 && (
                        <div>
                          <p className="text-gray-400 text-xs font-black tracking-widest uppercase mb-4 flex items-center gap-2 font-rajdhani">
                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" /> Anime / అనిమే ({animeRes.length})
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {animeRes.map((item, i) => (
                              <div key={item.id} onClickCapture={() => { addRecentSearch(item.titleEnglish); closeSearch() }} className="hover:scale-[1.03] transition-all">
                                <ContentCard content={item as any} index={i} size="sm" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Series */}
                      {seriesRes.length > 0 && (
                        <div>
                          <p className="text-gray-400 text-xs font-black tracking-widest uppercase mb-4 flex items-center gap-2 font-rajdhani">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Web Series & Shows / సిరీస్ ({seriesRes.length})
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {seriesRes.map((item, i) => (
                              <div key={item.id} onClickCapture={() => { addRecentSearch(item.titleEnglish); closeSearch() }} className="hover:scale-[1.03] transition-all">
                                <ContentCard content={item as any} index={i} size="sm" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Query suggestions */}
                      {suggestions.queries.length > 0 && (
                        <div className="border-t border-white/5 pt-5">
                          <p className="text-gray-500 text-[10px] font-black tracking-widest uppercase mb-3 flex items-center gap-1.5">
                            <PremiumIcon name="search" size={12} /> Search Suggestions
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {suggestions.queries.map((q, i) => (
                              <button key={i} onClick={() => handleSearch(q)}
                                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 font-semibold font-rajdhani text-xs transition-colors flex items-center gap-1.5">
                                <PremiumIcon name="search" size={10} /> {q}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </motion.div>
            )}

            {/* Default: Recent + Trending */}
            {query.length < 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                      <p className="text-gray-400 text-xs font-bold font-rajdhani tracking-widest uppercase flex items-center gap-2">
                        <PremiumIcon name="clock" size={12} /> Recent Searches
                      </p>
                      <button onClick={clearRecentSearches} className="text-gray-600 text-xs hover:text-white transition-colors font-rajdhani">Clear</button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((s, i) => (
                        <button key={i} onClick={() => handleSearch(s)}
                          className="w-full flex items-center gap-3 py-2 text-left text-gray-300 hover:text-white transition-colors font-rajdhani text-sm">
                          <PremiumIcon name="clock" size={12} /> {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {trendingSearches.length > 0 && (
                  <div>
                    <div className="mb-3 border-b border-white/5 pb-2">
                      <p className="text-gray-400 text-xs font-bold font-rajdhani tracking-widest uppercase flex items-center gap-2">
                        <PremiumIcon name="trending" size={12} /> Trending Searches
                      </p>
                    </div>
                    <div className="space-y-1">
                      {trendingSearches.slice(0, 8).map((s, i) => (
                        <button key={i} onClick={() => handleSearch(s.query)}
                          className="w-full flex items-center gap-3 py-2 text-left text-gray-300 hover:text-white transition-colors font-rajdhani text-sm">
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
            <span className="border border-gray-700 rounded px-2 py-1">Enter</span>
            <span>to search</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
