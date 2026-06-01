import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ContentService } from '@/services/content.service'
import ContentDetailPage from '@/components/content/ContentDetailPage'

async function getContent(slug: string) {
  const content = await ContentService.getBySlug(slug)
  if (!content) return null

  const similar = await ContentService.getSimilar(content.id, content.type, 6)

  return { content, similar }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const data = await getContent(params.slug)

  if (!data) {
    return {
      title: 'Not Found',
    }
  }

  return {
    title: `${data.content.titleEnglish} – TeluguVerse`,
    description:
      data.content.descriptionTelugu ||
      data.content.descriptionEnglish ||
      '',
  }
}

export default async function ContentPage({
  params,
}: {
  params: { slug: string }
}) {
  const data = await getContent(params.slug)

  if (!data) notFound()

  // Safely serialize dates (e.g. releaseDate, createdAt, updatedAt) for Client Component
  const serializedContent = JSON.parse(JSON.stringify(data.content))
  const serializedSimilar = JSON.parse(JSON.stringify(data.similar))

  return (
    <ContentDetailPage
      content={serializedContent}
      similar={serializedSimilar}
    />
  )
}