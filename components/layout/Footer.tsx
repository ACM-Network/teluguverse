import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import PremiumIcon from '@/components/ui/PremiumIcon'

const LINKS = {
  Browse: [
    { label: 'Movies', href: '/search?type=MOVIE' },
    { label: 'Anime', href: '/search?type=ANIME' },
    { label: 'Web Series', href: '/search?type=SERIES' },
    { label: 'K-Dramas', href: '/search?type=KDRAMA' },
    { label: 'Hollywood', href: '/search?type=HOLLYWOOD' },
    { label: 'Cartoons', href: '/search?type=CARTOON' },
  ],
  Features: [
    { label: 'Watchlist', href: '/watchlist' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'Upcoming', href: '/upcoming' },
    { label: 'Trending', href: '/search?sort=trending' },
    { label: 'Top Rated', href: '/search?sort=rating' },
    { label: 'AI Picks', href: '/recommendations' },
  ],
  Support: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Blog', href: '/blog' },
    { label: 'Community', href: '/community' },
  ],
}

const SOCIALS = [
  {
    name: 'Twitter',
    href: 'https://twitter.com',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Telegram',
    href: 'https://telegram.org',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.6 1.5-1.55 2.75-2.92 2.86-3.07.13-.18.06-.28-.15-.28-.3 0-2.73 1.8-7.72 5.17-.76.52-1.45.78-2.07.77-.69-.01-2.02-.38-3.01-.7-1.21-.39-2.18-.6-2.09-1.27.05-.35.53-.7 1.44-1.07 5.62-2.45 9.38-4.07 11.27-4.85 5.37-2.2 6.48-2.58 7.21-2.59.16 0 .52.04.75.23.2.16.25.39.27.55.03.21.02.43 0 .61z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.388.555A3.002 3.002 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.48 20.5 12 20.5 12 20.5s7.52 0 9.388-.555a3.002 3.002 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: 'Discord',
    href: 'https://discord.com',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="bg-dark-2 mt-28 relative overflow-hidden select-none z-10 border-t border-white/5">
      {/* Gold-fading double-layer neon top divider representing premium brand identity */}
      <div className="relative h-px w-full bg-gradient-to-r from-transparent via-yellow-400/25 to-transparent">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-[2px] bg-yellow-400 blur-[2px] opacity-60" />
      </div>

      {/* Cinematic ambient bottom glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,215,0,0.03),transparent_55%)] pointer-events-none" />

      <div className="container-tv py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          
          {/* Brand Col with bold presence */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block group relative">
              {/* Outer logo glow aura */}
              <div className="absolute -inset-2.5 rounded-2xl bg-yellow-400/8 opacity-0 group-hover:opacity-100 blur-md transition-all duration-500 pointer-events-none" />
              <Logo variant="gold" size={44} />
            </Link>
            
            <div className="space-y-4.5 max-w-sm">
              <p className="font-telugu text-gray-400 text-sm leading-7 tracking-wide">
                తెలుగు వినోద ప్రపంచానికి మీ పూర్తి గైడ్. మూవీస్, అనిమే, వెబ్ సిరీస్, కే-డ్రామాలు అన్నీ ఒక్కచోట.
              </p>
              <p className="text-gray-500 text-sm font-rajdhani leading-6 font-semibold uppercase tracking-wider">
                Your complete guide to Telugu entertainment. Movies, Anime, Web Series, K-Dramas — all in one place.
              </p>
            </div>

            {/* Social Icons with glowing ring hover */}
            <div className="flex items-center gap-3.5 pt-2">
              {SOCIALS.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/5 border border-white/5 text-gray-400 hover:text-yellow-400 hover:border-yellow-400/50 hover:scale-110 hover:shadow-[0_0_20px_rgba(255,215,0,0.25)] hover:bg-yellow-400/[0.05] transition-all duration-300"
                  aria-label={soc.name}
                >
                  {soc.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Cols with clean column lines */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title} className="space-y-6">
              <h3 className="font-cinzel text-xs font-bold text-yellow-400/90 tracking-[0.25em] uppercase border-b border-white/5 pb-3">
                {title}
              </h3>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-yellow-400 text-sm font-rajdhani font-bold uppercase tracking-wider transition-all duration-300 hover:translate-x-1.5 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Footer Bottom with clean breathing margins */}
        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-500 text-sm font-rajdhani text-center md:text-left leading-relaxed font-semibold uppercase tracking-wider">
            © {new Date().getFullYear()} TeluguVerse. All rights reserved. <br className="sm:hidden" />
            Made with <span className="inline-block mx-1.5"><PremiumIcon name="favorite" size={13} className="text-red-500 animate-pulse stroke-none inline-block align-middle" /></span> for Telugu fans worldwide.
          </p>
          
          <div className="flex items-center gap-4 text-gray-500 text-xs font-rajdhani tracking-wider bg-white/[0.02] border border-white/5 px-5 py-3 rounded-2xl shadow-inner font-bold uppercase">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              🇮🇳 India
            </span>
            <span className="text-white/10">•</span>
            <span>తెలుగు | English</span>
            <span className="text-white/10">•</span>
            <span className="font-extrabold text-yellow-400/80">v2.5.0</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
