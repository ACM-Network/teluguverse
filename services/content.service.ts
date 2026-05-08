import { prisma } from '@/lib/prisma'
import { ContentType, Prisma } from '@prisma/client'
import { paginate, slugify } from '@/lib/utils'

const contentSelect = {
  id: true, slug: true, type: true, status: true,
  titleEnglish: true, titleTelugu: true, titleOriginal: true,
  descriptionEnglish: true, descriptionTelugu: true,
  poster: true, banner: true, trailer: true, screenshots: true,
  year: true, releaseDate: true, runtime: true, totalEpisodes: true, totalSeasons: true,
  imdbRating: true, malRating: true, ageRating: true,
  studio: true, language: true, country: true,
  teluguDubAvail: true, teluguSubAvail: true, hindiDubAvail: true,
  isFeatured: true, isTrending: true, isTopRated: true,
  trendingScore: true, popularityScore: true, viewCount: true,
  createdAt: true, updatedAt: true,
  genres: { include: { genre: true } },
  streamingLinks: true,
  directors: { select: { id: true, name: true, nameTe: true, photo: true } },
  _count: { select: { reviews: true, ratings: true, watchlist: true, favorites: true } }
}

export interface SearchParams {
  q?: string
  type?: ContentType
  genre?: string
  year?: number
  language?: string
  ott?: string
  dubAvail?: boolean
  rating?: number
  page?: number
  limit?: number
  sort?: 'trending' | 'rating' | 'newest' | 'popular' | 'az'
}

export const ContentService = {
  async search(params: SearchParams) {
    const { q, type, genre, year, language, ott, dubAvail, rating, page = 1, limit = 20, sort = 'trending' } = params
    const { skip, take } = paginate(page, limit)

    const where: Prisma.ContentWhereInput = {
      ...(q && {
        OR: [
          { titleEnglish: { contains: q, mode: 'insensitive' } },
          { titleTelugu: { contains: q } },
          { titleOriginal: { contains: q, mode: 'insensitive' } },
          { descriptionEnglish: { contains: q, mode: 'insensitive' } },
          { studio: { contains: q, mode: 'insensitive' } },
        ]
      }),
      ...(type && { type }),
      ...(year && { year }),
      ...(language && { language: { equals: language, mode: 'insensitive' } }),
      ...(dubAvail !== undefined && { teluguDubAvail: dubAvail }),
      ...(genre && { genres: { some: { genre: { slug: genre } } } }),
      ...(ott && { streamingLinks: { some: { platform: ott as any } } }),
      ...(rating && { imdbRating: { gte: rating } }),
    }

    const orderBy: Prisma.ContentOrderByWithRelationInput =
      sort === 'trending' ? { trendingScore: 'desc' } :
      sort === 'rating' ? { imdbRating: 'desc' } :
      sort === 'newest' ? { year: 'desc' } :
      sort === 'popular' ? { popularityScore: 'desc' } :
      { titleEnglish: 'asc' }

    const [items, total] = await Promise.all([
      prisma.content.findMany({ where, select: contentSelect, orderBy, skip, take }),
      prisma.content.count({ where })
    ])

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
  },

  async getSuggestions(q: string) {
    if (!q || q.length < 2) return []
    return prisma.content.findMany({
      where: {
        OR: [
          { titleEnglish: { contains: q, mode: 'insensitive' } },
          { titleTelugu: { contains: q } },
        ]
      },
      select: { id: true, slug: true, titleEnglish: true, titleTelugu: true, type: true, poster: true, year: true, imdbRating: true },
      orderBy: { popularityScore: 'desc' },
      take: 8,
    })
  },

  async getTrending(type?: ContentType, limit = 20) {
    return prisma.content.findMany({
      where: { isTrending: true, ...(type && { type }) },
      select: contentSelect,
      orderBy: { trendingScore: 'desc' },
      take: limit,
    })
  },

  async getFeatured() {
    return prisma.content.findFirst({
      where: { isFeatured: true },
      select: { ...contentSelect, cast: { take: 6, orderBy: { order: 'asc' } } },
      orderBy: { updatedAt: 'desc' },
    })
  },

  async getBySlug(slug: string) {
    const content = await prisma.content.findUnique({
      where: { slug },
      include: {
        genres: { include: { genre: true } },
        cast: { orderBy: { order: 'asc' } },
        characters: { orderBy: { isMain: 'desc' } },
        streamingLinks: true,
        directors: true,
        seasons: { include: { episodeList: { orderBy: { number: 'asc' }, take: 50 } }, orderBy: { number: 'asc' } },
        episodes: { where: { seasonId: null }, orderBy: { number: 'asc' }, take: 50 },
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { id: true, username: true, displayName: true, avatar: true } } },
          orderBy: { likes: 'desc' },
          take: 10,
        },
        _count: { select: { reviews: true, ratings: true, watchlist: true, favorites: true } }
      }
    })
    if (content) {
      await prisma.content.update({ where: { id: content.id }, data: { viewCount: { increment: 1 } } })
    }
    return content
  },

  async getSimilar(contentId: string, type: ContentType, limit = 12) {
    const [related, byType] = await Promise.all([
      prisma.content.findMany({
        where: { recommendations: { some: { targetId: contentId } } },
        select: contentSelect, take: 6,
      }),
      prisma.content.findMany({
        where: { type, id: { not: contentId } },
        select: contentSelect,
        orderBy: { popularityScore: 'desc' },
        take: limit,
      })
    ])
    const seen = new Set(related.map(r => r.id))
    return [...related, ...byType.filter(c => !seen.has(c.id))].slice(0, limit)
  },

  async getTopRated(type?: ContentType, limit = 20) {
    return prisma.content.findMany({
      where: { isTopRated: true, ...(type && { type }) },
      select: contentSelect,
      orderBy: { imdbRating: 'desc' },
      take: limit,
    })
  },

  async getUpcoming(limit = 12) {
    return prisma.content.findMany({
      where: { status: 'UPCOMING', releaseDate: { gt: new Date() } },
      select: contentSelect,
      orderBy: { releaseDate: 'asc' },
      take: limit,
    })
  },

  async incrementView(id: string) {
    return prisma.content.update({
      where: { id },
      data: { viewCount: { increment: 1 }, popularityScore: { increment: 0.1 } }
    })
  },

  async create(data: any) {
    const slug = slugify(data.titleEnglish)
    return prisma.content.create({
      data: {
        ...data,
        slug,
        genres: data.genreIds ? { create: data.genreIds.map((id: string) => ({ genreId: id })) } : undefined,
        streamingLinks: data.streamingLinks ? { create: data.streamingLinks } : undefined,
      }
    })
  },

  async update(id: string, data: any) {
    return prisma.content.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.content.delete({ where: { id } })
  },
}
