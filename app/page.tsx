import { Suspense } from 'react'
import HeroSection from '@/components/home/HeroSection'
import TrendingTeluguDubs from '@/components/home/TrendingTeluguDubs'
import PopularSection from '@/components/home/PopularSection'
import AnimeSection from '@/components/home/AnimeSection'
import SeriesSection from '@/components/home/SeriesSection'
import UniverseExplorer from '@/components/home/UniverseExplorer'
import IndustryExplorer from '@/components/home/IndustryExplorer'
import UpcomingSection from '@/components/home/UpcomingSection'
import CategoriesGrid from '@/components/home/CategoriesGrid'
import ParticleCanvas from '@/components/ui/ParticleCanvas'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function SectionSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-8 rounded-full bg-white/5" />
        <div>
          <div className="h-3 w-28 rounded bg-white/5 mb-2" />
          <div className="h-5 w-44 rounded bg-white/5" />
        </div>
      </div>
      <div className="flex gap-5 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex-none w-44">
            <div className="aspect-[2/3] rounded-2xl bg-white/[0.03] mb-3" />
            <div className="h-3 w-3/4 rounded bg-white/[0.03] mb-1" />
            <div className="h-2.5 w-1/2 rounded bg-white/[0.02]" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function HomePage() {
  const curatedSlugs = [
    'kalki-2898-ad',
    'rrr',
    'pushpa-the-rule',
    'one-piece',
    'baahubali-2-the-conclusion',
    'avengers-endgame',
    'loki'
  ]

  const heroItems = await prisma.content.findMany({
    where: {
      slug: { in: curatedSlugs }
    },
    select: {
      id: true,
      slug: true,
      type: true,
      titleEnglish: true,
      titleTelugu: true,
      descriptionEnglish: true,
      descriptionTelugu: true,
      poster: true,
      banner: true,
      trailer: true,
      year: true,
      runtime: true,
      totalEpisodes: true,
      imdbRating: true,
      teluguDubAvail: true,
      isFeatured: true,
      isTrending: true,
      isTopRated: true,
      popularityScore: true,
      trendingScore: true,
      genres: { include: { genre: true } },
      streamingLinks: true,
    }
  })

  const sortedHeroItems = curatedSlugs
    .map(slug => heroItems.find(item => item.slug === slug))
    .filter(Boolean)

  return (
    <div className="min-h-screen bg-dark relative">
      <ParticleCanvas />

      {/* Hero */}
      <Suspense fallback={<div className="bg-dark" style={{ height: 'clamp(600px,100vh,920px)' }} />}>
        <HeroSection slides={sortedHeroItems} />
      </Suspense>

      {/* Content sections */}
      <div className="container-tv pt-8 pb-20 space-y-14 relative z-10">
        <Suspense fallback={<SectionSkeleton />}>
          <div>
            <TrendingTeluguDubs />
            <div className="section-divider mt-12" />
          </div>
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <div>
            <PopularSection />
            <div className="section-divider mt-12" />
          </div>
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <div>
            <AnimeSection />
            <div className="section-divider mt-12" />
          </div>
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <div>
            <SeriesSection />
            <div className="section-divider mt-12" />
          </div>
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <div>
            <IndustryExplorer />
            <div className="section-divider mt-12" />
          </div>
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <div>
            <UniverseExplorer />
            <div className="section-divider mt-12" />
          </div>
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <div>
            <UpcomingSection />
            <div className="section-divider mt-12" />
          </div>
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <div>
            <CategoriesGrid />
          </div>
        </Suspense>
      </div>
    </div>
  )
}
