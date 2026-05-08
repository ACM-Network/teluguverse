'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useStore } from '@/store/useStore'
import { motion } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Movies', href: '/search?type=MOVIE' },
  { label: 'Anime', href: '/search?type=ANIME' },
  { label: 'Series', href: '/search?type=SERIES' },
  { label: 'K-Dramas', href: '/search?type=KDRAMA' },
  { label: 'Hollywood', href: '/search?type=HOLLYWOOD' },
  { label: 'Trending', href: '/search?sort=trending' },
  { label: 'Top Rated', href: '/search?sort=rating' },
  { label: 'Upcoming', href: '/search?status=UPCOMING' },
]

export default function Navbar() {
  const { language, toggleLanguage, openSearch, user, logout } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'py-0' : 'py-0'}`}
        style={{ background: scrolled ? 'rgba(7,8,16,0.98)' : 'linear-gradient(180deg, rgba(7,8,16,0.95) 0%, transparent 100%)', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(255,215,0,0.12)' : 'none' }}>
        <div className="max-w-screen-2xl mx-auto px-4 xl:px-6 h-16 flex items-center gap-2">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mr-8 flex-none group">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-cinzel font-black text-sm text-black"
              style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', boxShadow: '0 0 20px rgba(255,215,0,0.4)' }}>
              TV
            </div>
            <span className="font-cinzel text-lg font-bold tracking-[0.15em] hidden sm:block"
              style={{ background: 'linear-gradient(135deg, #FFD700, #fff, #FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              TeluguVerse
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-1 flex-1 min-w-0">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-gray-400 hover:text-yellow-400 text-[11px] font-semibold font-rajdhani tracking-wide uppercase px-2 xl:px-3 py-2 rounded-lg hover:bg-yellow-400/8 transition-all whitespace-nowrap"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2 xl:gap-3 flex-none">
            {/* Language toggle */}
            <div className="hidden sm:flex items-center bg-surface border border-border rounded-lg overflow-hidden text-xs">
              <button onClick={toggleLanguage} className={`px-3 py-1.5 font-bold font-rajdhani transition-all ${language === 'en' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'}`}>EN</button>
              <button onClick={toggleLanguage} className={`px-3 py-1.5 font-bold font-telugu transition-all ${language === 'te' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'}`}>తె</button>
            </div>

            {/* Search */}
            <button onClick={openSearch}
              className="flex items-center gap-2 px-3 xl:px-4 py-2 rounded-lg border border-yellow-400/20 text-yellow-400 bg-yellow-400/8 hover:bg-yellow-400/15 hover:border-yellow-400/40 transition-all text-xs font-bold font-rajdhani tracking-wide">
              <span>🔍</span>
              <span className="hidden xl:block">Search</span>
              <span className="hidden md:block text-[10px] text-yellow-400/50 border border-yellow-400/20 rounded px-1">⌘K</span>
            </button>

            {/* Profile */}
            {user ? (
              <div className="relative">
                <button onClick={() => setProfileOpen(p => !p)}
                  className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm text-black flex-none transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', border: '2px solid rgba(255,215,0,0.5)' }}>
                  {user.displayName.slice(0, 2).toUpperCase()}
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-12 w-52 bg-surface border border-border rounded-xl p-2 shadow-2xl z-50">
                    <div className="px-3 py-2 border-b border-border mb-1">
                      <p className="text-sm font-bold text-white font-rajdhani">{user.displayName}</p>
                      <p className="text-xs text-gray-500">@{user.username}</p>
                    </div>
                    {[{ label: '👤 Profile', href: `/user/${user.username}` }, { label: '📋 Watchlist', href: '/watchlist' }, { label: '❤️ Favorites', href: '/favorites' }, { label: '⭐ Reviews', href: '/my-reviews' }].map(item => (
                      <Link key={item.href} href={item.href} onClick={() => setProfileOpen(false)}
                        className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-yellow-400/10 hover:text-yellow-400 transition-all font-rajdhani font-semibold">
                        {item.label}
                      </Link>
                    ))}
                    {user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? (
                      <Link href="/admin" onClick={() => setProfileOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-yellow-400 hover:bg-yellow-400/10 transition-all font-rajdhani font-semibold">⚙️ Admin Panel</Link>
                    ) : null}
                    <div className="border-t border-border mt-1 pt-1">
                      <button onClick={() => { logout(); setProfileOpen(false) }}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-all font-rajdhani font-semibold">
                        🚪 Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login"
                className="px-5 py-2 rounded-lg text-black text-xs font-bold font-rajdhani tracking-wide uppercase transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', boxShadow: '0 0 20px rgba(255,165,0,0.3)' }}>
                Sign In
              </Link>
            )}

            {/* Mobile menu */}
            <button onClick={() => setMobileOpen(p => !p)} className="lg:hidden p-2 rounded-lg border border-border text-gray-400 hover:text-white transition-colors">
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-dark-2 px-6 py-4">
            <div className="grid grid-cols-2 gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <Link key={label} href={href} onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-lg text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/8 transition-all text-sm font-semibold font-rajdhani">
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </nav>
    </>
  )
}
