import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { UserService } from '@/services/user.service'
import { handleError, ok } from '@/lib/errors'

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const favorites = await UserService.getFavorites(user.id)
    return ok(favorites)
  } catch (e) { return handleError(e) }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const { contentId } = await req.json()
    const result = await UserService.toggleFavorite(user.id, contentId)
    return ok(result)
  } catch (e) { return handleError(e) }
}
