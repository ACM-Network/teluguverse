import { Suspense } from 'react'
import HeroSection from '@/components/home/HeroSection'
import TrendingSection from '@/components/home/TrendingSection'
import PopularSection from '@/components/home/PopularSection'
import AnimeSection from '@/components/home/AnimeSection'
import KDramaSection from '@/components/home/KDramaSection'
import UniverseExplorer from '@/components/home/UniverseExplorer'
import UpcomingSection from '@/components/home/UpcomingSection'
import OttSection from '@/components/home/OttSection'
import StatsBar from '@/components/home/StatsBar'
import CategoriesGrid from '@/components/home/CategoriesGrid'
import ParticleCanvas from '@/components/ui/ParticleCanvas'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark relative">
      <ParticleCanvas />

      {/* Hero — no top padding; navbar is fixed overlay */}
      <Suspense fallback={<div className="bg-dark" style={{ height: 'clamp(600px,100vh,920px)' }} />}>
        <HeroSection />
      </Suspense>

      {/* Stats bar — immediate, no gap */}
      <StatsBar />

      {/* Content sections — upgraded spacing rhythm */}
      <div className="container-tv pt-10 pb-24 space-y-14 relative z-10">
        <Suspense fallback={null}>
          <div>
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-10">
              <PopularSection />
              <TrendingSection />
            </div>
            <div className="section-divider mt-14" />
          </div>
        </Suspense>

        <div>
          <CategoriesGrid />
          <div className="section-divider mt-14" />
        </div>

        <div>
          <AnimeSection />
          <div className="section-divider mt-14" />
        </div>

        <div>
          <KDramaSection />
          <div className="section-divider mt-14" />
        </div>

        <div>
          <UniverseExplorer />
          <div className="section-divider mt-14" />
        </div>

        <div>
          <UpcomingSection />
          <div className="section-divider mt-14" />
        </div>

        <div>
          <OttSection />
        </div>
      </div>
    </div>
  )
}
