import Link from 'next/link'

export const metadata = {
  title: 'About Us',
  description: 'Learn more about TeluguVerse – the ultimate destination for Telugu entertainment metadata, dubbed content, and cinematic universes.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark pt-32 pb-28 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-12 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 bg-yellow-400 pointer-events-none" />
      <div className="absolute bottom-24 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 bg-purple-500 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-yellow-400/10 border border-yellow-400/20 text-yellow-400">
            About TeluguVerse
          </div>
          <h1 className="font-cinzel font-black text-4xl sm:text-5xl lg:text-6xl tracking-wide bg-gradient-to-r from-white via-yellow-100 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
            Your Cinematic Universe
          </h1>
          <p className="text-gray-400 font-medium max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            The ultimate database and curation hub for Telugu entertainment, dubbed masterpieces, and massive media franchises.
          </p>
        </div>

        {/* Content Section */}
        <div className="glass-premium p-8 sm:p-10 rounded-3xl border border-white/5 space-y-8">
          <div className="space-y-4">
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide border-b border-white/5 pb-2">
              Our Mission
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              At TeluguVerse, we aim to bridge the gap between global cinematic content and Telugu-speaking audiences. Whether it is a South Korean thriller, a Japanese anime masterpiece, a Hollywood superhero blockbuster, or local Tollywood blockbusters, we categorize, catalog, and track dubbing/subtitling availability to make discovery simple.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <span className="text-2xl">🌍</span>
              <h3 className="font-bold text-white text-base font-rajdhani uppercase tracking-wider">Global Scope</h3>
              <p className="text-gray-400 text-xs leading-normal">
                Connecting you with content from Hollywood, Bollywood, Tollywood, Kollywood, Anime, and K-Dramas.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <span className="text-2xl">🎙️</span>
              <h3 className="font-bold text-white text-base font-rajdhani uppercase tracking-wider">Telugu Dubs</h3>
              <p className="text-gray-400 text-xs leading-normal">
                Easily filter and verify shows that feature high-quality Telugu dubbing and subtitle availability.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <span className="text-2xl">🌌</span>
              <h3 className="font-bold text-white text-base font-rajdhani uppercase tracking-wider">Universes</h3>
              <p className="text-gray-400 text-xs leading-normal">
                Explore chronological storylines for MCU, DC, Baahubali, Lokesh Cinematic Universe (LCU), and more.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide border-b border-white/5 pb-2">
              Curation & Curation Integrity
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Every content item inside TeluguVerse is curated by a community of film lovers. We provide Telugu translations for summaries, details of OTT streaming availability, casting sheets, and user review modules. We believe movie watching is a community experience.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-cinzel font-bold text-sm tracking-widest text-black bg-gradient-to-r from-yellow-400 to-amber-500 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_4px_24px_rgba(255,215,0,0.2)]"
          >
            Explore Database
          </Link>
        </div>
      </div>
    </div>
  )
}
