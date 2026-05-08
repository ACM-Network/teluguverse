import { ContentService } from '@/services/content.service'
import { handleError, ok } from '@/lib/errors'

export async function GET() {
  try {
    const featured = await ContentService.getFeatured()
    return ok(featured)
  } catch (e) { return handleError(e) }
}
