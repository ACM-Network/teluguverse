import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { handleError, ok } from '@/lib/errors'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req)
    const sp = req.nextUrl.searchParams
    const page = Number(sp.get('page') || 1)
    const q = sp.get('q') || ''
    const skip = (page - 1) * 30
    const where = q ? { OR: [{ email: { contains: q } }, { username: { contains: q } }, { displayName: { contains: q } }] } : {}
    const [users, total] = await Promise.all([
      prisma.user.findMany({ where, select: { id: true, email: true, username: true, displayName: true, role: true, createdAt: true, lastActive: true, isVerified: true, _count: { select: { reviews: true, ratings: true } } }, orderBy: { createdAt: 'desc' }, skip, take: 30 }),
      prisma.user.count({ where })
    ])
    return ok({ users, total, page, totalPages: Math.ceil(total / 30) })
  } catch (e) { return handleError(e) }
}
