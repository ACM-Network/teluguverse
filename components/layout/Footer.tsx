import Link from 'next/link'

const LINKS = {
  Browse: [
    { label:'Movies', href:'/search?type=MOVIE' },
    { label:'Anime', href:'/search?type=ANIME' },
    { label:'Web Series', href:'/search?type=SERIES' },
    { label:'K-Dramas', href:'/search?type=KDRAMA' },
    { label:'Hollywood', href:'/search?type=HOLLYWOOD' },
    { label:'Cartoons', href:'/search?type=CARTOON' },
  ],
  Features: [
    { label:'Watchlist', href:'/watchlist' },
    { label:'Reviews', href:'/reviews' },
    { label:'Upcoming', href:'/upcoming' },
    { label:'Trending', href:'/search?sort=trending' },
    { label:'Top Rated', href:'/search?sort=rating' },
    { label:'AI Picks', href:'/recommendations' },
  ],
  Support: [
    { label:'About Us', href:'/about' },
    { label:'Contact', href:'/contact' },
    { label:'Privacy Policy', href:'/privacy' },
    { label:'Terms of Service', href:'/terms' },
    { label:'Blog', href:'/blog' },
    { label:'Community', href:'/community' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-dark-2 border-t border-border mt-16">
      <div className="container-tv py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-cinzel font-black text-sm text-black"
                style={{ background:'linear-gradient(135deg,#FFD700,#FFA500)' }}>TV</div>
              <span className="font-cinzel text-xl font-bold" style={{ background:'linear-gradient(135deg,#FFD700,#fff,#FFD700)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                TeluguVerse
              </span>
            </div>
            <p className="font-telugu text-gray-500 text-sm leading-7 mb-4">
              తెలుగు వినోద ప్రపంచానికి మీ పూర్తి గైడ్. మూవీస్, అనిమే, వెబ్ సిరీస్, కె-డ్రామాలు అన్నీ ఒక్కచోట.
            </p>
            <p className="text-gray-600 text-sm font-rajdhani">
              Your complete guide to Telugu entertainment. Movies, Anime, Web Series, K-Dramas — all in one place.
            </p>
          </div>
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-cinzel text-xs font-bold text-yellow-400 tracking-widest uppercase mb-5">{title}</h3>
              <div className="space-y-2.5">
                {links.map(link => (
                  <Link key={link.href} href={link.href} className="block text-gray-500 hover:text-yellow-400 text-sm font-rajdhani font-semibold transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm font-rajdhani">© 2024 TeluguVerse. All rights reserved. | Made with ❤️ for Telugu fans worldwide.</p>
          <div className="flex items-center gap-4 text-gray-700 text-xs font-rajdhani">
            <span>🇮🇳 India</span>
            <span>•</span>
            <span>తెలుగు | English</span>
            <span>•</span>
            <span>v2.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
