import { NextRequest } from 'next/server'
import { SearchService } from '@/services/search.service'
import { handleError, ok } from '@/lib/errors'
export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get('q') || ''
    if (!q || q.length < 2) return ok({ content: [], queries: [] })
    return ok(await SearchService.getSuggestions(q))
  } catch (e) { return handleError(e) }
}
