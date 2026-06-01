import { NextRequest } from 'next/server'
import { SearchService } from '@/services/search.service'
import { handleError, ok } from '@/lib/errors'
import { ContentType } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams
    const results = await SearchService.search({
      q: sp.get('q') || undefined,
      type: sp.get('type') as ContentType || undefined,
      genre: sp.get('genre') || undefined,
      year: sp.get('year') ? Number(sp.get('year')) : undefined,
      language: sp.get('language') || undefined,
      ott: sp.get('ott') || undefined,
      dubAvail: sp.get('dubAvail') === 'true' ? true : undefined,
      rating: sp.get('rating') ? Number(sp.get('rating')) : undefined,
      page: sp.get('page') ? Number(sp.get('page')) : 1,
      sort: sp.get('sort') as any || 'trending',
      universe: sp.get('universe') || undefined,
    })
    return ok(results)
  } catch (e) { return handleError(e) }
}
