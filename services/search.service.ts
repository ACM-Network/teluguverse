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
    const [contentSuggestions, searchLogs, universeSuggestions] = await Promise.all([
      prisma.content.findMany({
        where: {
          OR: [
            { titleEnglish: { contains: q, mode: 'insensitive' } },
            { titleTelugu: { contains: q, mode: 'insensitive' } },
            { titleOriginal: { contains: q, mode: 'insensitive' } },
            { directors: { some: { name: { contains: q, mode: 'insensitive' } } } },
            { universe: { some: { universe: { name: { contains: q, mode: 'insensitive' } } } } },
          ]
        },
        select: { id: true, slug: true, titleEnglish: true, titleTelugu: true, type: true, poster: true, year: true, imdbRating: true },
        orderBy: { popularityScore: 'desc' },
        take: 30,
      }),
      prisma.searchLog.findMany({
        where: { query: { contains: q.toLowerCase() } },
        orderBy: { count: 'desc' },
        take: 5,
        select: { query: true },
      }),
      prisma.universe.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { nameTe: { contains: q, mode: 'insensitive' } },
          ]
        },
        select: { id: true, name: true, nameTe: true, color: true },
        take: 5,
      })
    ])
    return { content: contentSuggestions, queries: searchLogs.map(s => s.query), universes: universeSuggestions }
  },
}
