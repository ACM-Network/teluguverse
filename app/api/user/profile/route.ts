import { NextRequest } from 'next/server'
import { handleError, ok } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const username = req.nextUrl.searchParams.get('username')
    if (!username) {
      // Return current user's profile
      const user = await getAuthUser(req)
      if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
      const profile = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true, username: true, displayName: true, avatar: true,
          bio: true, role: true, createdAt: true, isVerified: true,
          _count: { select: { reviews: true, watchlist: true, favorites: true, following: true, followers: true } }
        }
      })
      return ok(profile)
    }

    const profile = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true, username: true, displayName: true, avatar: true,
        bio: true, role: true, createdAt: true,
        _count: { select: { reviews: true, watchlist: true, favorites: true, following: true, followers: true } }
      }
    })
    if (!profile) return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
    return ok(profile)
  } catch (e) { return handleError(e) }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    const { displayName, bio, avatar } = await req.json()
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { ...(displayName && { displayName }), ...(bio !== undefined && { bio }), ...(avatar && { avatar }) },
      select: { id: true, username: true, displayName: true, avatar: true, bio: true, role: true }
    })
    return ok(updated)
  } catch (e) { return handleError(e) }
}
