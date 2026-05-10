import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ContentDetailPage from '@/components/content/ContentDetailPage'

async function getContent(slug: string) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000')
    const [contentRes, similarRes] = await Promise.all([
      fetch(`${baseUrl}/api/content/${slug}`, { next: { revalidate: 3600 } }),
      fetch(`${baseUrl}/api/content/${slug}/similar`, { next: { revalidate: 3600 } }),
    ])
    if (!contentRes.ok) return null
    const [content, similar] = await Promise.all([contentRes.json(), similarRes.ok ? similarRes.json() : []])
    return { content, similar }
  } catch { return null }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getContent(params.slug)
  if (!data) return { title: 'Not Found' }
  const { content } = data
  return {
    title: `${content.titleEnglish} ${content.titleTelugu ? `(${content.titleTelugu})` : ''} – TeluguVerse`,
    description: content.descriptionTelugu || content.descriptionEnglish || '',
    openGraph: {
      title: content.titleEnglish,
      description: content.descriptionTelugu || content.descriptionEnglish || '',
      images: content.poster ? [content.poster] : [],
    },
  }
}

export default async function ContentPage({ params }: { params: { slug: string } }) {
  const data = await getContent(params.slug)
  if (!data) notFound()
  return <ContentDetailPage content={data.content} similar={data.similar} />
}
