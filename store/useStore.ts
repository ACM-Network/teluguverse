'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'

interface AppState {
  user: User | null
  token: string | null
  language: 'en' | 'te'
  isSearchOpen: boolean
  watchlist: string[]
  favorites: string[]

  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  toggleLanguage: () => void
  openSearch: () => void
  closeSearch: () => void
  toggleWatchlist: (id: string) => void
  toggleFavorite: (id: string) => void
  logout: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      language: 'en',
      isSearchOpen: false,
      watchlist: [],
      favorites: [],

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      toggleLanguage: () => {},
      openSearch: () => set({ isSearchOpen: true }),
      closeSearch: () => set({ isSearchOpen: false }),
      toggleWatchlist: (id) => set((s) => ({
        watchlist: s.watchlist.includes(id) ? s.watchlist.filter(i => i !== id) : [...s.watchlist, id]
      })),
      toggleFavorite: (id) => set((s) => ({
        favorites: s.favorites.includes(id) ? s.favorites.filter(i => i !== id) : [...s.favorites, id]
      })),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'teluguverse-store', partialize: (s) => ({ token: s.token, watchlist: s.watchlist, favorites: s.favorites }) }
  )
)
