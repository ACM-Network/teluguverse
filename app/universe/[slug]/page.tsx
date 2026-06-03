import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import UniversePage from '@/components/universe/UniversePage'
import { Metadata } from 'next'

async function getUniverseData(slug: string) {
  const universe = await prisma.universe.findUnique({
    where: { id: slug },
    include: {
      contents: {
        include: {
          content: {
            include: {
              genres: { include: { genre: true } },
              streamingLinks: true,
            }
          }
        },
        orderBy: { order: 'asc' }
      }
    }
  })

  if (!universe) return null

  // Fetch some recommendations (other content of similar genres or featured content)
  const recommendations = await prisma.content.findMany({
    where: {
      NOT: {
        universe: {
          some: { universeId: slug }
        }
      },
      teluguDubAvail: true
    },
    take: 6,
    orderBy: { popularityScore: 'desc' }
  })

  return { universe, recommendations }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const data = await getUniverseData(params.slug)
  if (!data) return { title: 'Universe Not Found' }

  return {
    title: `${data.universe.name} – TeluguVerse`,
    description: data.universe.description || '',
  }
}

export default async function Page({
  params,
}: {
  params: { slug: string }
}) {
  const data = await getUniverseData(params.slug)
  if (!data) notFound()

  // Safely serialize for the client component
  const serializedUniverse = JSON.parse(JSON.stringify(data.universe))
  const serializedRecs = JSON.parse(JSON.stringify(data.recommendations))

  return (
    <UniversePage
      universe={serializedUniverse}
      recommendations={serializedRecs}
    />
  )
}
