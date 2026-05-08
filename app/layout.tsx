import type { Metadata, Viewport } from 'next'
import { Cinzel, Rajdhani, Noto_Sans_Telugu } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SearchModal from '@/components/search/SearchModal'
import { Toaster } from 'react-hot-toast'

const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel', weight: ['400','600','700','900'] })
const rajdhani = Rajdhani({ subsets: ['latin', 'devanagari'], variable: '--font-rajdhani', weight: ['300','400','500','600','700'] })
const notoTelugu = Noto_Sans_Telugu({ subsets: ['telugu'], variable: '--font-telugu', weight: ['300','400','600','700'] })

export const metadata: Metadata = {
  title: { default: 'TeluguVerse – Telugu Entertainment Database', template: '%s | TeluguVerse' },
  description: 'The ultimate Telugu entertainment database. Movies, Anime, Web Series, K-Dramas, Hollywood and more – all with Telugu descriptions and dub availability.',
  keywords: ['Telugu movies', 'Telugu anime', 'Telugu dub', 'Telugu entertainment', 'web series Telugu', 'K-dramas Telugu'],
  authors: [{ name: 'TeluguVerse' }],
  creator: 'TeluguVerse',
  openGraph: {
    type: 'website',
    locale: 'te_IN',
    url: 'https://teluguverse.com',
    siteName: 'TeluguVerse',
    title: 'TeluguVerse – Telugu Entertainment Database',
    description: 'Your ultimate Telugu entertainment companion',
  },
  twitter: { card: 'summary_large_image', title: 'TeluguVerse', description: 'Telugu Entertainment Database' },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#070810',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="te" suppressHydrationWarning>
      <body className={`${cinzel.variable} ${rajdhani.variable} ${notoTelugu.variable} bg-dark text-white antialiased font-rajdhani`}>
        <Navbar />
        <SearchModal />
        <main>{children}</main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1A1D35',
              color: '#E8E8F0',
              border: '1px solid rgba(255,215,0,0.2)',
              fontFamily: 'var(--font-rajdhani), sans-serif',
              fontWeight: 600,
            },
            success: { iconTheme: { primary: '#FFD700', secondary: '#000' } },
          }}
        />
      </body>
    </html>
  )
}
