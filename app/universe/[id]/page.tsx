import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import UniversePage from '@/components/universe/UniversePage'
import { Metadata } from 'next'

async function getUniverseData(id: string) {
  const universe = await prisma.universe.findUnique({
    where: { id },
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
          some: { universeId: id }
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
  params: { id: string }
}): Promise<Metadata> {
  const data = await getUniverseData(params.id)
  if (!data) return { title: 'Universe Not Found' }

  return {
    title: `${data.universe.name} – TeluguVerse`,
    description: data.universe.description || '',
  }
}

export default async function Page({
  params,
}: {
  params: { id: string }
}) {
  const data = await getUniverseData(params.id)
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
