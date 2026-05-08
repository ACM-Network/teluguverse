import { NextRequest } from 'next/server'
import { ContentService } from '@/services/content.service'
import { handleError, ok } from '@/lib/errors'

export async function GET(req: NextRequest) {
  try {
    const limit = Number(req.nextUrl.searchParams.get('limit') || 12)
    const upcoming = await ContentService.getUpcoming(limit)
    return ok(upcoming)
  } catch (e) { return handleError(e) }
}
