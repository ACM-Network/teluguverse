import { SearchService } from '@/services/search.service'
import { handleError, ok } from '@/lib/errors'
export async function GET() {
  try { return ok(await SearchService.getTrendingSearches(12)) } catch (e) { return handleError(e) }
}
