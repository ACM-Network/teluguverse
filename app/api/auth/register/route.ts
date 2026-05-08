import { NextRequest } from 'next/server'
import { z } from 'zod'
import { UserService } from '@/services/user.service'
import { signToken } from '@/lib/auth'
import { handleError, ok } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { AppError } from '@/lib/errors'

const schema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30).regex(/^[a-z0-9_]+$/, 'Only lowercase letters, numbers, underscores'),
  displayName: z.string().min(2).max(60),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json())
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: body.email }, { username: body.username }] }
    })
    if (existing) throw new AppError('Email or username already taken', 409)
    const user = await UserService.create(body)
    const token = signToken({ userId: user.id, email: user.email, role: user.role })
    const res = ok({ user, token }, 201)
    res.cookies.set('tv_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60, path: '/' })
    return res
  } catch (e) { return handleError(e) }
}
