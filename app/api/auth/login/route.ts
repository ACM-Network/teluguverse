import { NextRequest } from 'next/server'
import { z } from 'zod'
import { comparePassword, signToken } from '@/lib/auth'
import { handleError, ok } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { AppError } from '@/lib/errors'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const { email, password } = schema.parse(await req.json())
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.password) throw new AppError('Invalid credentials', 401)
    const valid = await comparePassword(password, user.password)
    if (!valid) throw new AppError('Invalid credentials', 401)
    const token = signToken({ userId: user.id, email: user.email, role: user.role })
    const { password: _, ...safeUser } = user
    const res = ok({ user: safeUser, token })
    res.cookies.set('tv_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60, path: '/' })
    return res
  } catch (e) { return handleError(e) }
}
