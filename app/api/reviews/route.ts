import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { handleError, ok } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  contentId: z.string(),
  title: z.string().optional(),
  body: z.string().min(10, 'Review must be at least 10 characters'),
  rating: z.number().min(1).max(10).optional(),
  language: z.enum(['en', 'te']).default('te'),
  isSpoiler: z.boolean().default(false),
})

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams
    const contentId = sp.get('contentId')
    if (!contentId) return new Response('contentId required', { status: 400 })
    const reviews = await prisma.review.findMany({
      where: { contentId, isApproved: true },
      include: { user: { select: { id: true, username: true, displayName: true, avatar: true } } },
      orderBy: { likes: 'desc' },
      take: 20,
    })
    return ok(reviews)
  } catch (e) { return handleError(e) }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const data = schema.parse(await req.json())
    const existing = await prisma.review.findFirst({ where: { contentId: data.contentId, userId: user.id } })
    if (existing) return new Response(JSON.stringify({ error: 'You already reviewed this content' }), { status: 409 })
    const review = await prisma.review.create({
      data: { ...data, userId: user.id },
      include: { user: { select: { id: true, username: true, displayName: true, avatar: true } } }
    })
    return ok(review, 201)
  } catch (e) { return handleError(e) }
}
