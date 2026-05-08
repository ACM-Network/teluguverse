import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { handleError, ok } from '@/lib/errors'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req)
    const [totalContent, totalUsers, totalReviews, totalRatings, byType, recentContent] = await Promise.all([
      prisma.content.count(),
      prisma.user.count(),
      prisma.review.count(),
      prisma.rating.count(),
      prisma.content.groupBy({ by: ['type'], _count: true }),
      prisma.content.findMany({ orderBy: { createdAt: 'desc' }, take: 10, select: { id: true, titleEnglish: true, type: true, createdAt: true, viewCount: true } }),
    ])
    return ok({ totalContent, totalUsers, totalReviews, totalRatings, byType, recentContent })
  } catch (e) { return handleError(e) }
}
