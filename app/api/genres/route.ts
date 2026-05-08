import { handleError, ok } from '@/lib/errors'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const genres = await prisma.genre.findMany({ orderBy: { name: 'asc' } })
    return ok(genres)
  } catch (e) { return handleError(e) }
}
