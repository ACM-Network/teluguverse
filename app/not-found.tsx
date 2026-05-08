import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center text-center px-4">
      <div>
        <div className="text-8xl mb-6">🎬</div>
        <h1 className="font-cinzel text-6xl font-black text-white mb-2">404</h1>
        <h2 className="font-cinzel text-2xl font-bold text-yellow-400 mb-3">Page Not Found</h2>
        <p className="font-telugu text-gray-500 mb-8">ఈ పేజీ కనుగొనబడలేదు</p>
        <Link href="/" className="px-8 py-4 rounded-xl font-cinzel font-bold text-black text-sm tracking-wide"
          style={{ background:'linear-gradient(135deg,#FFD700,#FFA500)', boxShadow:'0 0 30px rgba(255,215,0,0.3)' }}>
          Go Home
        </Link>
      </div>
    </div>
  )
}
