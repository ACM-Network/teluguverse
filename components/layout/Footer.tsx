import Link from 'next/link'
import Logo from '@/components/ui/Logo'

export default function Footer() {
  return (
    <footer className="bg-dark border-t border-white/5 py-8 mt-12 select-none z-10 relative">
      <div className="container-tv flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo and Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <Link href="/" className="inline-block hover:scale-[1.02] transition-transform">
            <Logo variant="gold" size={24} />
          </Link>
          <span className="hidden sm:inline text-white/10">|</span>
          <p className="text-gray-500 text-[11px] font-rajdhani font-semibold uppercase tracking-wider">
            © {new Date().getFullYear()} TeluguVerse. All rights reserved.
          </p>
        </div>

        {/* Minimal Text Links */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] font-bold uppercase tracking-wider font-rajdhani text-gray-400">
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>

      </div>
    </footer>
  )
}
