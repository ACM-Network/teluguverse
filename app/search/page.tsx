'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useDebounce } from 'use-debounce'
import ContentCard from '@/components/ui/ContentCard'
import SkeletonCard from '@/components/ui/SkeletonCard'
import { ContentItem } from '@/types'
import SectionHeader from '@/components/ui/SectionHeader'
import PremiumIcon from '@/components/ui/PremiumIcon'
import { TYPE_COLORS } from '@/lib/constants'

const TYPES = ['', 'MOVIE', 'ANIME', 'SERIES', 'KDRAMA', 'CARTOON', 'HOLLYWOOD', 'DOCUMENTARY']
const SORTS = [
  { v: 'trending', l: 'Trending' },
  { v: 'rating', l: 'Top Rated' },
  { v: 'newest', l: 'Newest' },
  { v: 'popular', l: 'Most Popular' },
  { v: 'az', l: 'A-Z' },
]
const YEARS = ['', 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2010, 2005, 2000]
const OTTS = ['', 'NETFLIX', 'AMAZON_PRIME', 'JIO_HOTSTAR', 'ZEE5', 'SONY_LIV', 'AHA', 'CRUNCHYROLL', 'YOUTUBE']
const RATINGS = ['', '9', '8', '7', '6']

const GENRES = [
  { v: '', l: 'Any Genre' },
  { v: 'action', l: 'Action' },
  { v: 'romance', l: 'Romance' },
  { v: 'thriller', l: 'Thriller' },
  { v: 'comedy', l: 'Comedy' },
  { v: 'drama', l: 'Drama' },
  { v: 'sci-fi', l: 'Sci-Fi' },
  { v: 'fantasy', l: 'Fantasy' },
  { v: 'horror', l: 'Horror' },
  { v: 'historical', l: 'Historical' },
  { v: 'mythology', l: 'Mythology' },
  { v: 'crime', l: 'Crime' },
  { v: 'adventure', l: 'Adventure' },
  { v: 'supernatural', l: 'Supernatural' },
  { v: 'family', l: 'Family' },
  { v: 'sports', l: 'Sports' },
  { v: 'super-hero', l: 'Super Hero' },
]

const UNIVERSES = [
  { v: '', l: 'Any Universe' },
  { v: 'mcu', l: 'Marvel Cinematic Universe' },
  { v: 'dc', l: 'DC Universe' },
  { v: 'baahubali', l: 'Baahubali Universe' },
  { v: 'onepiece', l: 'One Piece Universe' },
  { v: 'monsterverse', l: 'MonsterVerse' },
  { v: 'naruto', l: 'Naruto Universe' },
  { v: 'lcu', l: 'Lokesh Cinematic Universe (LCU)' },
]

const PLATFORM_LABELS: Record<string, string> = {
  '': 'Any Platform',
  NETFLIX: 'Netflix',
  AMAZON_PRIME: 'Prime Video',
  JIO_HOTSTAR: 'JioHotstar',
  HOTSTAR: 'JioHotstar',
  ZEE5: 'ZEE5',
  SONY_LIV: 'SonyLIV',
  AHA: 'Aha',
  CRUNCHYROLL: 'Crunchyroll',
  YOUTUBE: 'YouTube',
}

const TYPE_CHIP_DATA = [
  { v: '', l: 'All', icon: '' },
  { v: 'MOVIE', l: 'Movies', icon: 'movies' },
  { v: 'ANIME', l: 'Anime', icon: 'anime' },
  { v: 'SERIES', l: 'Series', icon: 'series' },
  { v: 'KDRAMA', l: 'K-Drama', icon: 'kdrama' },
  { v: 'CARTOON', l: 'Cartoon', icon: 'cartoon' },
  { v: 'HOLLYWOOD', l: 'Hollywood', icon: 'hollywood' },
]

const TRENDING_SEARCHES = ['Pushpa', 'One Piece', 'Avengers', 'Baahubali', 'Naruto', 'K-Drama', 'RRR', 'Loki']

const POPULAR_GENRES = [
  { name: 'Action', slug: 'action', color: '#E50914' },
  { name: 'Fantasy', slug: 'fantasy', color: '#8B5CF6' },
  { name: 'Sci-Fi', slug: 'sci-fi', color: '#06B6D4' },
  { name: 'Romance', slug: 'romance', color: '#EC4899' },
  { name: 'Thriller', slug: 'thriller', color: '#F97316' },
  { name: 'Comedy', slug: 'comedy', color: '#22C55E' },
]

export default function SearchPage() {
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [type, setType] = useState(searchParams.get('type') || '')
  const [genre, setGenre] = useState(searchParams.get('genre') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'trending')
  const [year, setYear] = useState(searchParams.get('year') || '')
  const [ott, setOtt] = useState(searchParams.get('ott') || '')
  const [rating, setRating] = useState(searchParams.get('rating') || '')
  const [universe, setUniverse] = useState(searchParams.get('universe') || '')
  const [page, setPage] = useState(1)

  const [results, setResults] = useState<ContentItem[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const [debouncedQuery] = useDebounce(query, 400)

  const hasActiveFilters = Boolean(debouncedQuery || type || genre || year || ott || rating || universe)

  const buildQuery = useCallback(() => {
    const p = new URLSearchParams()
    if (debouncedQuery) p.set('q', debouncedQuery)
    if (type) p.set('type', type)
    if (genre) p.set('genre', genre)
    if (sort) p.set('sort', sort)
    if (year) p.set('year', year)
    if (ott) p.set('ott', ott)
    if (rating) p.set('rating', rating)
    if (universe) p.set('universe', universe)
    p.set('page', String(page))
    p.set('limit', '24')
    return p.toString()
  }, [debouncedQuery, type, genre, sort, year, ott, rating, universe, page])

  useEffect(() => {
    setLoading(true)
    setPage(1)
  }, [debouncedQuery, type, genre, sort, year, ott, rating, universe])

  useEffect(() => {
    const qs = buildQuery()
    setLoading(true)
    fetch(`/api/search?${qs}`)
      .then(r => r.json())
      .then(d => { setResults(d.items || []); setTotal(d.total || 0); setTotalPages(d.totalPages || 0); setLoading(false) })
      .catch(() => setLoading(false))
  }, [buildQuery])

  const clearAll = () => {
    setQuery('')
    setType('')
    setGenre('')
    setYear('')
    setOtt('')
    setRating('')
    setUniverse('')
  }

  return (
    <div className="min-h-screen bg-dark pt-24 pb-28">
      <div className="container-tv">

        {/* Search bar — prominent, centered */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search movies, anime, series..."
              className="w-full bg-white/[0.03] border border-white/[0.06] focus:border-white/20 focus:bg-white/[0.05] rounded-2xl py-[18px] pl-14 pr-14 text-white font-rajdhani text-base outline-none transition-all duration-300"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Type chips */}
        <div className="flex gap-2.5 flex-wrap mb-6 justify-center">
          {TYPE_CHIP_DATA.map(t => {
            const isActive = type === t.v
            const chipColor = t.v ? TYPE_COLORS[t.v] || '#fff' : '#fff'
            return (
              <button
                key={t.v}
                onClick={() => setType(t.v)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold font-rajdhani tracking-wider uppercase transition-all duration-300 border flex items-center gap-2 ${
                  isActive
                    ? 'text-white shadow-lg'
                    : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/15 hover:text-white'
                }`}
                style={isActive ? {
                  background: `${chipColor}18`,
                  borderColor: `${chipColor}40`,
                  color: chipColor,
                } : undefined}
              >
                {t.icon && <PremiumIcon name={t.icon} size={12} />}
                {t.l}
              </button>
            )
          })}
        </div>

        {/* Genre filter badge if active */}
        {genre && (
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-bold font-rajdhani tracking-wider uppercase">
              <span>Genre: {genre}</span>
              <button
                onClick={() => setGenre('')}
                className="text-gray-400 hover:text-white transition-colors ml-1.5 focus:outline-none"
                title="Clear Genre Filter"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Filters toggle & row */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowFilters(f => !f)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-rajdhani text-gray-400 border border-white/5 hover:border-white/15 hover:text-white transition-all"
          >
            <PremiumIcon name="gear" size={12} />
            Filters
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </button>
          <p className="text-gray-500 text-sm font-rajdhani font-semibold">
            {loading ? 'Searching...' : `${total.toLocaleString()} results`}
          </p>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="flex gap-3 flex-wrap p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                <select value={sort} onChange={e => setSort(e.target.value)}
                  className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm font-rajdhani font-semibold text-gray-300 focus:border-white/20 outline-none transition-all">
                  {SORTS.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
                </select>
                <select value={year} onChange={e => setYear(e.target.value)}
                  className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm font-rajdhani font-semibold text-gray-300 focus:border-white/20 outline-none transition-all">
                  {YEARS.map(y => <option key={String(y)} value={String(y)}>{y || 'Any Year'}</option>)}
                </select>
                <select value={ott} onChange={e => setOtt(e.target.value)}
                  className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm font-rajdhani font-semibold text-gray-300 focus:border-white/20 outline-none transition-all">
                  {OTTS.map(o => <option key={o} value={o}>{PLATFORM_LABELS[o] || o || 'Any Platform'}</option>)}
                </select>
                <select value={rating} onChange={e => setRating(e.target.value)}
                  className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm font-rajdhani font-semibold text-gray-300 focus:border-white/20 outline-none transition-all">
                  {RATINGS.map(r => <option key={r} value={r}>{r ? `${r}+` : 'Any Rating'}</option>)}
                </select>
                <select value={genre} onChange={e => setGenre(e.target.value)}
                  className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm font-rajdhani font-semibold text-gray-300 focus:border-white/20 outline-none transition-all">
                  {GENRES.map(g => <option key={g.v} value={g.v}>{g.l}</option>)}
                </select>
                <select value={universe} onChange={e => setUniverse(e.target.value)}
                  className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm font-rajdhani font-semibold text-gray-300 focus:border-white/20 outline-none transition-all">
                  {UNIVERSES.map(u => <option key={u.v} value={u.v}>{u.l}</option>)}
                </select>
                {hasActiveFilters && (
                  <button onClick={clearAll} className="px-3 py-2 rounded-lg text-xs font-bold font-rajdhani text-red-400 hover:bg-red-400/10 transition-all border border-red-400/20">
                    Clear All
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Discovery sections (when no active search/filters) */}
        {!hasActiveFilters && !loading && (
          <div className="space-y-10 mb-12">
            {/* Trending Searches */}
            <div>
              <h3 className="text-white text-sm font-bold font-rajdhani tracking-wider uppercase mb-4 flex items-center gap-2">
                <PremiumIcon name="trending" size={14} />
                Trending Searches
              </h3>
              <div className="flex gap-2.5 flex-wrap">
                {TRENDING_SEARCHES.map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold font-rajdhani text-gray-300 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/15 hover:text-white transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Categories */}
            <div>
              <h3 className="text-white text-sm font-bold font-rajdhani tracking-wider uppercase mb-4 flex items-center gap-2">
                <PremiumIcon name="genres" size={14} />
                Popular Categories
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {POPULAR_GENRES.map(genre => (
                  <button
                    key={genre.slug}
                    onClick={() => setGenre(genre.slug)}
                    className="relative flex items-center justify-center py-6 rounded-xl overflow-hidden border border-white/[0.04] hover:border-transparent transition-all group"
                    style={{ background: `linear-gradient(135deg, ${genre.color}15, rgba(7,8,16,0.95))` }}
                  >
                    <span className="text-sm font-bold font-rajdhani text-white group-hover:scale-110 transition-transform">
                      {genre.name}
                    </span>
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[2px] translate-y-[2px] group-hover:translate-y-0 transition-transform"
                      style={{ background: genre.color }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              <SkeletonCard count={24} />
            </div>
          ) : results.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5"
            >
              {results.map((item, i) => (
                <ContentCard key={item.id} content={item} index={i} />
              ))}
            </motion.div>
          ) : hasActiveFilters ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 flex flex-col items-center justify-center"
            >
              <PremiumIcon name="search" size={56} className="mb-4 text-white/20" />
              <p className="text-white font-cinzel text-xl font-bold mb-2">No results found</p>
              <p className="font-telugu text-gray-500">ఫలితాలు కనుగొనబడలేదు</p>
              <div className="mt-6 space-y-3">
                <button
                  onClick={clearAll}
                  className="px-6 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white font-bold font-rajdhani text-sm hover:bg-white/[0.08] transition-all"
                >
                  Clear All Filters
                </button>
                <div className="flex gap-2 flex-wrap justify-center mt-4">
                  <span className="text-gray-500 text-xs font-rajdhani">Try:</span>
                  {['Pushpa', 'One Piece', 'Avengers'].map(s => (
                    <button key={s} onClick={() => setQuery(s)} className="text-xs font-rajdhani text-gray-400 hover:text-white transition-colors underline underline-offset-2">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-gray-400 font-rajdhani font-semibold text-sm disabled:opacity-30 hover:border-white/15 hover:text-white transition-all disabled:cursor-not-allowed"
            >
              Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = page <= 4 ? i + 1 : page > totalPages - 3 ? totalPages - 6 + i : page - 3 + i
              if (p < 1 || p > totalPages) return null
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-lg text-sm font-bold font-rajdhani transition-all ${
                    p === page
                      ? 'bg-white text-black'
                      : 'bg-white/[0.03] border border-white/[0.06] text-gray-400 hover:border-white/15 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              )
            })}
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-gray-400 font-rajdhani font-semibold text-sm disabled:opacity-30 hover:border-white/15 hover:text-white transition-all disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
