import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { UserService } from '@/services/user.service'
import { handleError, ok } from '@/lib/errors'
import { z } from 'zod'

const schema = z.object({ contentId: z.string(), score: z.number().min(1).max(10) })

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const { contentId, score } = schema.parse(await req.json())
    const result = await UserService.rateContent(user.id, contentId, score)
    return ok(result)
  } catch (e) { return handleError(e) }
}
