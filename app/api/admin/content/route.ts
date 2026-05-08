import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { ContentService } from '@/services/content.service'
import { handleError, ok } from '@/lib/errors'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req)
    const sp = req.nextUrl.searchParams
    const results = await ContentService.search({ q: sp.get('q') || undefined, page: Number(sp.get('page') || 1), limit: 30, sort: 'newest' })
    return ok(results)
  } catch (e) { return handleError(e) }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const content = await ContentService.create(body)
    return ok(content, 201)
  } catch (e) { return handleError(e) }
}
