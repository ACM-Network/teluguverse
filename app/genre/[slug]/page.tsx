import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ContentCard from '@/components/ui/ContentCard'
import SectionHeader from '@/components/ui/SectionHeader'
import ParticleCanvas from '@/components/ui/ParticleCanvas'

interface Props {
  params: { slug: string }
}

async function getGenreData(slug: string) {
  const genre = await prisma.genre.findUnique({
    where: { slug },
    include: {
      contents: {
        include: {
          content: {
            include: {
              genres: { include: { genre: true } },
              streamingLinks: true
            }
          }
        }
      }
    }
  })

  return genre
}

export async function generateMetadata({ params }: Props) {
  const genre = await getGenreData(params.slug.toLowerCase())
  if (!genre) return { title: 'Genre Not Found' }
  return {
    title: `${genre.name} – TeluguVerse`,
    description: `Explore all ${genre.name} films and shows available in Telugu.`
  }
}

export default async function GenrePage({ params }: Props) {
  const slug = params.slug.toLowerCase()
  const genre = await getGenreData(slug)
  if (!genre) notFound()

  // Pull out the actual content items from the join table relation
  const items = genre.contents.map(relation => relation.content)

  // Sort them by popularity score
  items.sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0))

  // Serialize objects for safely passing to the Client components
  const serializedItems = JSON.parse(JSON.stringify(items))

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20 relative overflow-hidden">
      <ParticleCanvas />

      {/* Ambient background glows */}
      <div
        className="absolute top-12 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-5 pointer-events-none"
        style={{ background: genre.color || '#FFD700' }}
      />

      <div className="container-tv relative z-10 space-y-8">
        <SectionHeader
          title={genre.name}
          titleTe={genre.nameTe || genre.name}
          description={`Watch premium ${genre.name.toLowerCase()} dubbed and subbed movies and web series.`}
          icon="genre" // Custom rating icon mapper can resolve this fallback
        />

        {serializedItems.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-2xl border border-white/5">
            <p className="text-gray-400 font-medium">No movies or shows found in this genre.</p>
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
