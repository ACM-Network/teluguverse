import { NextRequest } from 'next/server'
import { ContentService } from '@/services/content.service'
import { handleError, ok } from '@/lib/errors'
export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const content = await ContentService.getBySlug(params.slug)
    if (!content) return new Response('Not Found', { status: 404 })
    const similar = await ContentService.getSimilar(content.id, content.type)
    return ok(similar)
  } catch (e) { return handleError(e) }
}
