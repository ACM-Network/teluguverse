import { NextRequest } from 'next/server'
import { handleError, ok } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const content = await prisma.content.findUnique({ where: { slug: params.slug }, select: { id: true } })
    if (!content) return new Response('Not Found', { status: 404 })
    const reviews = await prisma.review.findMany({
      where: { contentId: content.id, isApproved: true },
      include: { user: { select: { id: true, username: true, displayName: true, avatar: true } } },
      orderBy: { likes: 'desc' },
      take: 20,
    })
    return ok(reviews)
  } catch (e) { return handleError(e) }
}

const schema = z.object({
  title: z.string().optional(),
  body: z.string().min(10),
  rating: z.number().min(1).max(10).optional(),
  language: z.enum(['en', 'te']).default('te'),
  isSpoiler: z.boolean().default(false),
})

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const user = await requireAuth(req)
    const content = await prisma.content.findUnique({ where: { slug: params.slug }, select: { id: true } })
    if (!content) return new Response('Not Found', { status: 404 })
    const data = schema.parse(await req.json())
    const existing = await prisma.review.findFirst({ where: { contentId: content.id, userId: user.id } })
    if (existing) return new Response(JSON.stringify({ error: 'Already reviewed' }), { status: 409 })
    const review = await prisma.review.create({
      data: { ...data, contentId: content.id, userId: user.id },
      include: { user: { select: { id: true, username: true, displayName: true, avatar: true } } }
    })
    return ok(review, 201)
  } catch (e) { return handleError(e) }
}
