import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'teluguverse-secret-key-change-in-production'
const JWT_EXPIRES = '7d'

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export const hashPassword = (password: string) => bcrypt.hash(password, 12)
export const comparePassword = (password: string, hash: string) => bcrypt.compare(password, hash)

export const signToken = (payload: JWTPayload): string =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES })

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export const getAuthUser = async (req: NextRequest) => {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : 
    req.cookies.get('tv_token')?.value

  if (!token) return null
  const payload = verifyToken(token)
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, username: true, displayName: true, role: true, avatar: true }
  })
  return user
}

export const requireAuth = async (req: NextRequest) => {
  const user = await getAuthUser(req)
  if (!user) throw new Error('Unauthorized')
  return user
}

export const requireAdmin = async (req: NextRequest) => {
  const user = await requireAuth(req)
  if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) throw new Error('Forbidden')
  return user
}
