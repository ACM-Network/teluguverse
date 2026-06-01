'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useDebounce } from 'use-debounce'
import ContentCard from '@/components/ui/ContentCard'
import SkeletonCard from '@/components/ui/SkeletonCard'
import { ContentItem } from '@/types'
import SectionHeader from '@/components/ui/SectionHeader'
import PremiumIcon from '@/components/ui/PremiumIcon'

const TYPES = ['','MOVIE','ANIME','SERIES','KDRAMA','CARTOON','HOLLYWOOD','DOCUMENTARY']
const SORTS = [{ v:'trending',l:'Trending' },{ v:'rating',l:'Top Rated' },{ v:'newest',l:'Newest' },{ v:'popular',l:'Most Popular' },{ v:'az',l:'A-Z' }]
const YEARS = ['',2024,2023,2022,2021,2020,2019,2018,2017,2016,2015,2010,2005,2000]
const LANGS = ['','Telugu','Hindi','Tamil','Japanese','Korean','English']
const OTTS = ['','NETFLIX','AMAZON_PRIME','HOTSTAR','ZEE5','SONY_LIV','CRUNCHYROLL','VIKI']
const RATINGS = ['','9','8','7','6']

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [type, setType] = useState(searchParams.get('type') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'trending')
  const [year, setYear] = useState(searchParams.get('year') || '')
  const [language, setLanguage] = useState(searchParams.get('language') || '')
  const [ott, setOtt] = useState(searchParams.get('ott') || '')
  const [rating, setRating] = useState(searchParams.get('rating') || '')
  const [dubOnly, setDubOnly] = useState(searchParams.get('dubAvail') === 'true')
  const [universe, setUniverse] = useState(searchParams.get('universe') || '')
  const [page, setPage] = useState(1)

  const [results, setResults] = useState<ContentItem[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)

  const [debouncedQuery] = useDebounce(query, 400)

  const buildQuery = useCallback(() => {
    const p = new URLSearchParams()
    if (debouncedQuery) p.set('q', debouncedQuery)
    if (type) p.set('type', type)
    if (sort) p.set('sort', sort)
    if (year) p.set('year', year)
    if (language) p.set('language', language)
    if (ott) p.set('ott', ott)
    if (rating) p.set('rating', rating)
    if (dubOnly) p.set('dubAvail', 'true')
    if (universe) p.set('universe', universe)
    p.set('page', String(page))
    p.set('limit', '24')
    return p.toString()
  }, [debouncedQuery, type, sort, year, language, ott, rating, dubOnly, universe, page])

  useEffect(() => {
    setLoading(true)
    setPage(1)
  }, [debouncedQuery, type, sort, year, language, ott, rating, dubOnly, universe])

  useEffect(() => {
    const qs = buildQuery()
    setLoading(true)
    fetch(`/api/search?${qs}`)
      .then(r => r.json())
      .then(d => { setResults(d.items || []); setTotal(d.total || 0); setTotalPages(d.totalPages || 0); setLoading(false) })
      .catch(() => setLoading(false))
  }, [buildQuery])

  const FilterSelect = ({ label, value, onChange, options }: any) => (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="bg-surface border border-border rounded-lg px-3 py-2 text-sm font-rajdhani font-semibold text-gray-300 focus:border-yellow-400/50 outline-none transition-all hover:border-yellow-400/30">
      {options.map((o: any) => <option key={String(o)} value={String(o)}>{o || label}</option>)}
    </select>
  )

  return (
    <div className="min-h-screen bg-dark pt-24 pb-16">
      <div className="container-tv">
        {/* Header */}
        <SectionHeader
          title={debouncedQuery ? `Results for "${debouncedQuery}"` : type ? `${type.charAt(0)+type.slice(1).toLowerCase()} Library` : 'Explore Everything'}
          titleTe={`${total.toLocaleString()} titles found • TeluguVerse`}
          icon="search"
          description="Explore, filter, and search through our extensive database of movies, anime, and series."
        />

        {/* Search bar */}
        <div className="relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 flex items-center justify-center">
            <PremiumIcon name="search" size={18} className="text-yellow-500/70" />
          </span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search movies, anime, series... / సినిమాలు వెతకండి..."
            className="w-full bg-surface border border-white/5 focus:border-yellow-400/40 focus:bg-surface-2 rounded-2xl py-4.5 pl-12 pr-12 text-white font-rajdhani text-base outline-none transition-all duration-300"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }} />
          {query && <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors duration-200">✕</button>}
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap mb-8 p-4 bg-surface border border-border rounded-xl">
          <div className="flex gap-2 flex-wrap flex-1">
            <FilterSelect label="All Types" value={type} onChange={setType} options={TYPES.map(t => t || 'All Types')} />
            <FilterSelect label="Sort By" value={sort} onChange={setSort} options={SORTS.map(s => s.l)} />
            <FilterSelect label="Year" value={year} onChange={setYear} options={YEARS.map(y => y || 'Any Year')} />
            <FilterSelect label="Language" value={language} onChange={setLanguage} options={LANGS.map(l => l || 'Any Language')} />
            <FilterSelect label="OTT Platform" value={ott} onChange={setOtt} options={OTTS.map(o => o || 'Any OTT')} />
            <FilterSelect label="Min Rating" value={rating} onChange={setRating} options={RATINGS.map(r => r ? `${r}+ ★` : 'Any Rating')} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none ml-auto">
            <div onClick={() => setDubOnly(d => !d)}
              className={`w-10 h-5 rounded-full transition-all relative ${dubOnly ? 'bg-yellow-500' : 'bg-gray-700'}`}>
              <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${dubOnly ? 'left-5' : 'left-0.5'}`} />
            </div>
            <span className="text-xs font-bold font-rajdhani text-gray-300">Telugu Dub Only</span>
          </label>
        </div>

        {/* Type chips */}
        <div className="flex gap-2.5 flex-wrap mb-8">
          {[
            { v: '', l: 'All', icon: '' },
            { v: 'MOVIE', l: 'Movies', icon: 'movies' },
            { v: 'ANIME', l: 'Anime', icon: 'anime' },
            { v: 'SERIES', l: 'Series', icon: 'series' },
            { v: 'KDRAMA', l: 'K-Drama', icon: 'kdrama' },
            { v: 'CARTOON', l: 'Cartoon', icon: 'cartoon' },
            { v: 'HOLLYWOOD', l: 'Hollywood', icon: 'hollywood' }
          ].map(t => (
            <button 
              key={t.v} 
              onClick={() => setType(t.v)}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-bold font-rajdhani tracking-wider uppercase transition-all duration-300 border flex items-center gap-2 ${
                type === t.v
                  ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400 shadow-[0_4px_15px_rgba(255,215,0,0.08)]'
                  : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-yellow-400/20 hover:text-yellow-400'
              }`}
            >
              {t.icon && <PremiumIcon name={t.icon} size={12} />}
              {t.l}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm font-rajdhani font-semibold">{loading ? 'Searching...' : `${total.toLocaleString()} results`}</p>
          {total > 0 && <p className="text-gray-600 text-xs font-rajdhani">Page {page} of {totalPages}</p>}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              <SkeletonCard count={24} />
            </div>
          ) : results.length > 0 ? (
            <motion.div key="results" initial={{ opacity:0 }} animate={{ opacity:1 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {results.map((item, i) => <ContentCard key={item.id} content={item} index={i} />)}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-center py-24 flex flex-col items-center justify-center">
              <PremiumIcon name="search" size={56} className="mb-4 text-yellow-500/50" />
              <p className="text-white font-cinzel text-xl font-bold mb-2">No results found</p>
              <p className="font-telugu text-gray-500">ఫలితాలు కనుగొనబడలేదు</p>
              <button onClick={() => { setQuery(''); setType(''); setYear(''); setLanguage(''); setOtt(''); setRating(''); setDubOnly(false); setUniverse(''); }}
                className="mt-6 px-6 py-3 rounded-xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 font-bold font-rajdhani text-sm hover:bg-yellow-500/25 transition-all">
                Clear All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button disabled={page===1} onClick={() => setPage(p=>p-1)}
              className="px-4 py-2 rounded-lg bg-surface border border-border text-gray-400 font-rajdhani font-semibold text-sm disabled:opacity-30 hover:border-yellow-400/30 hover:text-yellow-400 transition-all disabled:cursor-not-allowed">
              ← Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = page <= 4 ? i+1 : page > totalPages-3 ? totalPages-6+i : page-3+i
              if (p < 1 || p > totalPages) return null
              return (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-lg text-sm font-bold font-rajdhani transition-all ${p===page?'bg-yellow-500 text-black':'bg-surface border border-border text-gray-400 hover:border-yellow-400/30 hover:text-yellow-400'}`}>
                  {p}
                </button>
              )
            })}
            <button disabled={page===totalPages} onClick={() => setPage(p=>p+1)}
              className="px-4 py-2 rounded-lg bg-surface border border-border text-gray-400 font-rajdhani font-semibold text-sm disabled:opacity-30 hover:border-yellow-400/30 hover:text-yellow-400 transition-all disabled:cursor-not-allowed">
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
