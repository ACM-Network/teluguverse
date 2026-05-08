import { NextRequest } from 'next/server'
import { ContentService } from '@/services/content.service'
import { handleError, ok } from '@/lib/errors'
import { ContentType } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams
    const results = await ContentService.search({
      q: sp.get('q') || undefined,
      type: sp.get('type') as ContentType || undefined,
      genre: sp.get('genre') || undefined,
      year: sp.get('year') ? Number(sp.get('year')) : undefined,
      language: sp.get('language') || undefined,
      ott: sp.get('ott') || undefined,
      dubAvail: sp.get('dubAvail') === 'true' ? true : sp.get('dubAvail') === 'false' ? false : undefined,
      rating: sp.get('rating') ? Number(sp.get('rating')) : undefined,
      page: sp.get('page') ? Number(sp.get('page')) : 1,
      limit: sp.get('limit') ? Number(sp.get('limit')) : 20,
      sort: sp.get('sort') as any || 'trending',
    })
    return ok(results)
  } catch (e) { return handleError(e) }
}
