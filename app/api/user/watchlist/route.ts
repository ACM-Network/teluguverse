import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { UserService } from '@/services/user.service'
import { handleError, ok } from '@/lib/errors'

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const watchlist = await UserService.getWatchlist(user.id)
    return ok(watchlist)
  } catch (e) { return handleError(e) }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const { contentId } = await req.json()
    const result = await UserService.addToWatchlist(user.id, contentId)
    return ok(result)
  } catch (e) { return handleError(e) }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const { contentId } = await req.json()
    await UserService.removeFromWatchlist(user.id, contentId)
    return ok({ removed: true })
  } catch (e) { return handleError(e) }
}
