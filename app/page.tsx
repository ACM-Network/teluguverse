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
      <div className="container-tv pt-10 pb-24 space-y-20 relative z-10">
        <Suspense fallback={null}>
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-10">
            <PopularSection />
            <TrendingSection />
          </div>
        </Suspense>

        <div className="section-divider" />

        <CategoriesGrid />

        <div className="section-divider" />

        <AnimeSection />

        <div className="section-divider" />

        <KDramaSection />

        <div className="section-divider" />

        <UniverseExplorer />

        <div className="section-divider" />

        <UpcomingSection />

        <div className="section-divider" />

        <OttSection />
      </div>
    </div>
  )
}
