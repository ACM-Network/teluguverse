import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ContentCard from '@/components/ui/ContentCard'
import SectionHeader from '@/components/ui/SectionHeader'
import ParticleCanvas from '@/components/ui/ParticleCanvas'

interface Props {
  params: { slug: string }
}

const INDUSTRY_MAP: Record<string, {
  titleEn: string;
  titleTe: string;
  desc: string;
  where: any;
}> = {
  tollywood: {
    titleEn: 'Tollywood',
    titleTe: 'టాలీవుడ్ సినిమాలు',
    desc: 'Explore the best of Telugu Cinema blockbusters and dramas.',
    where: { type: 'MOVIE', language: 'Telugu' }
  },
  bollywood: {
    titleEn: 'Bollywood',
    titleTe: 'బాలీవుడ్ సినిమాలు',
    desc: 'Discover Hindi cinema, from modern action blockbusters to classic dramas.',
    where: { type: 'MOVIE', language: 'Hindi' }
  },
  kollywood: {
    titleEn: 'Kollywood',
    titleTe: 'కొలీవుడ్ సినిమాలు',
    desc: 'Immerse yourself in gritty Tamil thrillers and high-octane blockbusters.',
    where: { type: 'MOVIE', language: 'Tamil' }
  },
  hollywood: {
    titleEn: 'Hollywood',
    titleTe: 'హాలీవుడ్ సినిమాలు',
    desc: 'Browse cinematic Hollywood blockbusters, Sci-Fi epics, and action films.',
    where: { type: 'HOLLYWOOD' }
  },
  anime: {
    titleEn: 'Anime',
    titleTe: 'అనిమే సిరీస్',
    desc: 'Watch popular modern Japanese animation hits and timeless classics.',
    where: { type: 'ANIME' }
  },
  kdrama: {
    titleEn: 'K-Drama',
    titleTe: 'కే-డ్రామాస్',
    desc: 'Dive into popular Korean romantic comedies, thrillers, and dramas.',
    where: { type: 'KDRAMA' }
  }
}

export async function generateMetadata({ params }: Props) {
  const conf = INDUSTRY_MAP[params.slug.toLowerCase()]
  if (!conf) return { title: 'Industry Not Found' }
  return {
    title: `${conf.titleEn} – TeluguVerse`,
    description: conf.desc
  }
}

export default async function IndustryPage({ params }: Props) {
  const slug = params.slug.toLowerCase()
  const conf = INDUSTRY_MAP[slug]
  if (!conf) notFound()

  // Query database for content matching this industry
  const items = await prisma.content.findMany({
    where: conf.where,
    orderBy: { popularityScore: 'desc' },
    take: 100
  })

  // Serialize to prevent dynamic import issues
  const serializedItems = JSON.parse(JSON.stringify(items))

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20 relative overflow-hidden">
      <ParticleCanvas />
      
      {/* Ambient background glows */}
      <div className="absolute top-12 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-5 bg-yellow-400 pointer-events-none" />

      <div className="container-tv relative z-10 space-y-8">
        <SectionHeader
          title={conf.titleEn}
          titleTe={conf.titleTe}
          description={conf.desc}
          icon="globe"
        />

        {serializedItems.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-2xl border border-white/5">
            <p className="text-gray-400 font-medium">No movies or shows found in this industry.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center">
            {serializedItems.map((item: any, i: number) => (
              <ContentCard key={item.id} content={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
