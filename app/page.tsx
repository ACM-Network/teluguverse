import { Suspense } from 'react'
import HeroSection from '@/components/home/HeroSection'
import TrendingTeluguDubs from '@/components/home/TrendingTeluguDubs'
import PopularSection from '@/components/home/PopularSection'
import AnimeSection from '@/components/home/AnimeSection'
import SeriesSection from '@/components/home/SeriesSection'
import UniverseExplorer from '@/components/home/UniverseExplorer'
import UpcomingSection from '@/components/home/UpcomingSection'
import CategoriesGrid from '@/components/home/CategoriesGrid'
import ParticleCanvas from '@/components/ui/ParticleCanvas'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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

  // Sort them in the exact order of curatedSlugs
  const sortedHeroItems = curatedSlugs
    .map(slug => heroItems.find(item => item.slug === slug))
    .filter(Boolean)

  return (
    <div className="min-h-screen bg-dark relative">
      <ParticleCanvas />

      {/* Hero — no top padding; navbar is fixed overlay */}
      <Suspense fallback={<div className="bg-dark" style={{ height: 'clamp(600px,100vh,920px)' }} />}>
        <HeroSection slides={sortedHeroItems} />
      </Suspense>

      {/* Content sections — upgraded spacing rhythm */}
      <div className="container-tv pt-8 pb-20 space-y-12 relative z-10">
        <Suspense fallback={null}>
          <div>
            <TrendingTeluguDubs />
            <div className="section-divider mt-12" />
          </div>
        </Suspense>

        <Suspense fallback={null}>
          <div>
            <PopularSection />
            <div className="section-divider mt-12" />
          </div>
        </Suspense>

        <Suspense fallback={null}>
          <div>
            <AnimeSection />
            <div className="section-divider mt-12" />
          </div>
        </Suspense>

        <Suspense fallback={null}>
          <div>
            <SeriesSection />
            <div className="section-divider mt-12" />
          </div>
        </Suspense>

        <Suspense fallback={null}>
          <div>
            <UniverseExplorer />
            <div className="section-divider mt-12" />
          </div>
        </Suspense>

        <Suspense fallback={null}>
          <div>
            <UpcomingSection />
            <div className="section-divider mt-12" />
          </div>
        </Suspense>

        <Suspense fallback={null}>
          <div>
            <CategoriesGrid />
          </div>
        </Suspense>
      </div>
    </div>
  )
}
