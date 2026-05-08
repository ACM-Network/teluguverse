import { NextRequest } from 'next/server'
import { ContentService } from '@/services/content.service'
import { handleError, ok } from '@/lib/errors'
import { ContentType } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams
    const type = sp.get('type') as ContentType | null
    const limit = Number(sp.get('limit') || 20)
    const trending = await ContentService.getTrending(type || undefined, limit)
    return ok(trending)
  } catch (e) { return handleError(e) }
}
