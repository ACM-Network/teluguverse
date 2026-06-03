export const metadata = {
  title: 'Terms of Service',
  description: 'Read the terms of service of TeluguVerse before using our database.',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-dark pt-32 pb-24 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-12 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-5 bg-yellow-400 pointer-events-none" />
      <div className="absolute bottom-24 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-5 bg-blue-500 pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10 space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="font-cinzel font-black text-3xl sm:text-4xl tracking-wide bg-gradient-to-r from-white via-gray-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-md">
            Terms of Service
          </h1>
          <p className="text-gray-500 text-xs font-semibold font-rajdhani uppercase tracking-widest">
            Last Updated: June 2026
          </p>
        </div>

        {/* Content */}
        <div className="glass p-8 sm:p-10 rounded-2xl border border-white/5 space-y-6 text-gray-300 text-sm sm:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-cinzel text-lg font-bold text-white tracking-wide">1. Acceptance of Terms</h2>
            <p>
              By accessing and exploring TeluguVerse, you confirm that you accept these Terms of Service. If you disagree, please refrain from registering an account or publishing reviews.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-cinzel text-lg font-bold text-white tracking-wide">2. Content & Metadata License</h2>
            <p>
              All movie poster images, actor photos, and official trailers displayed on the site are copyrighted by their respective production studios or distributors. TeluguVerse uses them for database information and non-commercial cataloging purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-cinzel text-lg font-bold text-white tracking-wide">3. User Code of Conduct</h2>
            <p>
              When writing content reviews or explanations, users must avoid hate speech, spoilers without tags, spam, or copyright violations. We reserve the right to remove any comments violating these guidelines.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-cinzel text-lg font-bold text-white tracking-wide">4. Limitation of Liability</h2>
            <p>
              TeluguVerse catalogues streaming availability of movies. We are not responsible for pricing, quality, or availability alterations on third-party streaming providers like Netflix, aha, Prime Video, or Hotstar.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-cinzel text-lg font-bold text-white tracking-wide">5. Changes to Agreement</h2>
            <p>
              We reserve the right to adjust these Terms of Service at any time. Changes will be posted to this page with the updated timeline indicator at the top.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
