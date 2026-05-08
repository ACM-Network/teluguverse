import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { handleError, ok } from '@/lib/errors'
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    return ok(user)
  } catch (e) { return handleError(e) }
}
