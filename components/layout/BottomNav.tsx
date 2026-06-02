'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useStore } from '@/store/useStore'
import PremiumIcon from '@/components/ui/PremiumIcon'

export default function BottomNav() {
  const pathname = usePathname()
  const { openSearch, user } = useStore()

  const navItems = [
    { label: 'Home', href: '/', icon: 'movies' },
    { label: 'Search', action: openSearch, icon: 'search' },
    { label: 'Universes', href: '/universe', icon: 'universe' },
    { label: 'Upcoming', href: '/upcoming', icon: 'upcoming' },
    { label: 'Profile', href: user ? `/user/${user.username}` : '/auth/login', icon: 'user' },
  ]

  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 z-[90] h-[72px] bg-dark-3/80 backdrop-blur-xl border-t border-white/5 px-4 flex items-center justify-around pb-safe">
      {navItems.map((item, index) => {
        const isActive = item.href ? pathname === item.href : false

        const content = (
          <div className="flex flex-col items-center justify-center gap-1 text-center w-14">
            <div className={`p-1 rounded-xl transition-all duration-300 ${isActive ? 'text-yellow-400 scale-110 drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]' : 'text-gray-400'}`}>
              <PremiumIcon name={item.icon} size={20} />
            </div>
            <span className={`text-[10px] font-bold font-rajdhani tracking-wider transition-colors duration-300 ${isActive ? 'text-yellow-400 font-extrabold' : 'text-gray-500'}`}>
              {item.label}
            </span>
          </div>
        )

        if (item.action) {
          return (
            <button key={index} onClick={item.action} className="outline-none focus:outline-none">
              {content}
            </button>
          )
        }

        return (
          <Link key={index} href={item.href || '#'} className="outline-none focus:outline-none">
            {content}
          </Link>
        )
      })}
    </div>
  )
}
