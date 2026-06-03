export const metadata = {
  title: 'Privacy Policy',
  description: 'Read the privacy policy of TeluguVerse and understand how we collect and protect your data.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-dark pt-32 pb-24 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-12 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-5 bg-yellow-400 pointer-events-none" />
      <div className="absolute bottom-24 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-5 bg-red-500 pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10 space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="font-cinzel font-black text-3xl sm:text-4xl tracking-wide bg-gradient-to-r from-white via-gray-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-md">
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-xs font-semibold font-rajdhani uppercase tracking-widest">
            Last Updated: June 2026
          </p>
        </div>

        {/* Content */}
        <div className="glass p-8 sm:p-10 rounded-2xl border border-white/5 space-y-6 text-gray-300 text-sm sm:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-cinzel text-lg font-bold text-white tracking-wide">1. Information We Collect</h2>
            <p>
              We collect information directly from you when you register an account, customize your profile, watchlist, favorites, or write reviews. This may include email address, username, display name, and preferences.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-cinzel text-lg font-bold text-white tracking-wide">2. How We Use Your Information</h2>
            <p>
              Your data is utilized to personalize your catalog experience, track your watchlist, store your review histories, and communicate updates. We do not sell or lease user information to third-party brokers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-cinzel text-lg font-bold text-white tracking-wide">3. Cookies and Caching</h2>
            <p>
              We use session cookies and local storage tokens to maintain user logins and language selections (English/Telugu) to deliver an optimized cinematic browsing speed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-cinzel text-lg font-bold text-white tracking-wide">4. Third-Party Integrations</h2>
            <p>
              Our platform lists links to external OTT streaming providers (Netflix, Amazon Prime, aha, ZEE5, Hotstar). Please review the privacy terms of those respective streaming platforms when navigating to external portals.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-cinzel text-lg font-bold text-white tracking-wide">5. Security Measures</h2>
            <p>
              We maintain standard digital encryption and hashed database schemas to protect user password assets against unauthorized intrusion.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
