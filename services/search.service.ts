import { prisma } from '@/lib/prisma'
import { ContentService } from './content.service'
import { SearchParams } from './content.service'

export const SearchService = {
  async search(params: SearchParams) {
    const results = await ContentService.search(params)

    if (params.q) {
      await prisma.searchLog.upsert({
        where: { id: params.q.toLowerCase().slice(0, 50) },
        update: { count: { increment: 1 } },
        create: { id: params.q.toLowerCase().slice(0, 50), query: params.q.toLowerCase(), count: 1 },
      }).catch(() => {})
    }

    return results
  },

  async getTrendingSearches(limit = 10) {
    return prisma.searchLog.findMany({
      orderBy: { count: 'desc' },
      take: limit,
      select: { query: true, count: true },
    })
  },

  async getSuggestions(q: string) {
    const [contentSuggestions, searchLogs] = await Promise.all([
      ContentService.getSuggestions(q),
      prisma.searchLog.findMany({
        where: { query: { contains: q.toLowerCase() } },
        orderBy: { count: 'desc' },
        take: 5,
        select: { query: true },
      })
    ])
    return { content: contentSuggestions, queries: searchLogs.map(s => s.query) }
  },
}
