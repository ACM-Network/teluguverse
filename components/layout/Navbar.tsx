'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useStore } from '@/store/useStore'
import Logo from '@/components/ui/Logo'
import PremiumIcon from '@/components/ui/PremiumIcon'



export default function Navbar() {
  const { language, openSearch, user, logout } = useStore()
  const isTelugu = language === 'te'
  const [scrolled, setScrolled] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <nav
        className="absolute top-0 left-0 right-0 z-[100] transition-all duration-300"
        style={{
          background: 'transparent',
          backdropFilter: 'none',
          borderBottom: 'none',
        }}
      >
        <div className="max-w-screen-2xl mx-auto px-4 xl:px-6 h-[78px] flex items-center gap-3 xl:gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center mr-5 flex-none group">
            <Logo variant="primary" />
          </Link>

          {/* Right side spacer */}
          <div className="flex-1 min-w-0" />

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2 xl:gap-3 flex-none">

            {/* Search — clean, no shortcut badges */}
            <button
              onClick={openSearch}
              className="flex items-center gap-2.5 px-3 py-2 rounded-2xl border border-yellow-400/20 text-yellow-400 bg-yellow-400/[0.07] hover:bg-yellow-400/[0.12] hover:border-yellow-400/40 transition-all text-sm font-black font-rajdhani tracking-wide shadow-[0_0_20px_rgba(255,215,0,0.08)]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden xl:block">Search</span>
            </button>

            {/* Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(p => !p)}
                  className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm text-black flex-none transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', border: '2px solid rgba(255,215,0,0.5)' }}
                >
                  {user.displayName.slice(0, 2).toUpperCase()}
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-12 w-52 bg-surface border border-white/10 rounded-xl p-2 shadow-2xl z-50">
                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                      <p className="text-sm font-bold text-white font-rajdhani">{user.displayName}</p>
                      <p className="text-xs text-gray-500">@{user.username}</p>
                    </div>
                    {[
                      { label: 'Profile', href: `/user/${user.username}`, icon: 'user' },
                      { label: 'Watchlist', href: '/watchlist', icon: 'watchlist' },
                      { label: 'Favorites', href: '/favorites', icon: 'favorite' },
                      { label: 'Reviews', href: '/my-reviews', icon: 'review' },
                    ].map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all font-rajdhani font-semibold"
                      >
                        <PremiumIcon name={item.icon} size={14} />
                        {item.label}
                      </Link>
                    ))}
                    {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                      <Link
                        href="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-yellow-400 hover:bg-yellow-400/10 transition-all font-rajdhani font-semibold"
                      >
                        <PremiumIcon name="gear" size={14} />
                        Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-white/5 mt-1 pt-1">
                      <button
                        onClick={() => { logout(); setProfileOpen(false) }}
                        className="w-full flex items-center gap-2.5 text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-all font-rajdhani font-semibold"
                      >
                        <PremiumIcon name="logout" size={14} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="px-5 py-2.5 rounded-2xl text-black text-sm font-black font-rajdhani tracking-[0.08em] transition-all hover:scale-[1.03] active:scale-95 shadow-[0_0_28px_rgba(255,165,0,0.22)]"
                style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', boxShadow: '0 0 20px rgba(255,165,0,0.3)' }}
              >
                {isTelugu ? 'సైన్ ఇన్' : 'Sign In'}
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
