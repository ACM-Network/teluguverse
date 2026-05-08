'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useDebounce } from 'use-debounce'

export interface SearchSuggestion {
  id: string; slug: string; titleEnglish: string; titleTelugu?: string | null
  type: string; poster?: string | null; year?: number | null; imdbRating?: number | null
}

export const useSearch = () => {
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebounce(query, 300)
  const [suggestions, setSuggestions] = useState<{ content: SearchSuggestion[]; queries: string[] }>({ content: [], queries: [] })
  const [trendingSearches, setTrendingSearches] = useState<{ query: string; count: number }[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('tv_recent_searches')
    if (stored) setRecentSearches(JSON.parse(stored).slice(0, 8))
  }, [])

  useEffect(() => {
    fetch('/api/search/trending').then(r => r.json()).then(data => setTrendingSearches(data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setSuggestions({ content: [], queries: [] })
      return
    }
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    setIsLoading(true)
    fetch(`/api/search/suggestions?q=${encodeURIComponent(debouncedQuery)}`, { signal: abortRef.current.signal })
      .then(r => r.json())
      .then(data => { setSuggestions(data); setIsLoading(false) })
      .catch(e => { if (e.name !== 'AbortError') setIsLoading(false) })
  }, [debouncedQuery])

  const addRecentSearch = useCallback((q: string) => {
    const updated = [q, ...recentSearches.filter(s => s !== q)].slice(0, 8)
    setRecentSearches(updated)
    localStorage.setItem('tv_recent_searches', JSON.stringify(updated))
  }, [recentSearches])

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    localStorage.removeItem('tv_recent_searches')
  }, [])

  return { query, setQuery, suggestions, trendingSearches, recentSearches, isLoading, addRecentSearch, clearRecentSearches }
}
