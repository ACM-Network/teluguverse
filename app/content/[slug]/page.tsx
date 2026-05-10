import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import ContentDetailPage from '@/components/content/ContentDetailPage'

const prisma = new PrismaClient()

async function getContent(slug: string) {
  const content = await prisma.content.findUnique({
    where: { slug },
    include: {
      genres: true,
      streamingLinks: true,
    },
  })

  if (!content) return null

  const similar = await prisma.content.findMany({
    where: {
      type: content.type,
      NOT: { slug: content.slug },
    },
    take: 6,
  })

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

  return (
    <ContentDetailPage
      content={{
        ...data.content,
        releaseDate: data.content.releaseDate
          ? data.content.releaseDate.toISOString()
          : null,
        similar: data.similar,
      } as any}
    />
  )
}