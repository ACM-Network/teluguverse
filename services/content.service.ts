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
  universe?: string
}

export const ContentService = {
  async search(params: SearchParams) {
    const { q, type, genre, year, language, ott, dubAvail, rating, page = 1, limit = 20, sort = 'trending', universe } = params
    const { skip, take } = paginate(page, limit)

    const where: Prisma.ContentWhereInput = {
      ...(q && {
        OR: [
          { titleEnglish: { contains: q, mode: 'insensitive' } },
          { titleTelugu: { contains: q, mode: 'insensitive' } },
          { titleOriginal: { contains: q, mode: 'insensitive' } },
          { descriptionEnglish: { contains: q, mode: 'insensitive' } },
          { studio: { contains: q, mode: 'insensitive' } },
          { directors: { some: { name: { contains: q, mode: 'insensitive' } } } },
          { universe: { some: { universe: { name: { contains: q, mode: 'insensitive' } } } } },
          { tags: { some: { tag: { name: { contains: q, mode: 'insensitive' } } } } },
        ]
      }),
      ...(type && { type }),
      ...(year && { year }),
      ...(language && { language: { equals: language, mode: 'insensitive' } }),
      ...(dubAvail !== undefined && { teluguDubAvail: dubAvail }),
      ...(genre && { genres: { some: { genre: { slug: genre } } } }),
      ...(ott && {
        streamingLinks: {
          some: {
            platform: (ott === 'TV' || ott === 'AVAILABLE_ON_TV')
              ? { in: ['DISNEY_CHANNEL', 'HUNGAMA_TV', 'CARTOON_NETWORK', 'POGO', 'SONIC', 'NICK', 'SONY_YAY', 'ETV_BAL_BHARAT', 'TV', 'AVAILABLE_ON_TV'] }
              : (ott as any)
          }
        }
      }),
      ...(rating && { imdbRating: { gte: rating } }),
      ...(universe && {
        universe: {
          some: {
            universeId: { equals: universe, mode: 'insensitive' }
          }
        }
      }),
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
          { titleTelugu: { contains: q, mode: 'insensitive' } },
          { titleOriginal: { contains: q, mode: 'insensitive' } },
          { directors: { some: { name: { contains: q, mode: 'insensitive' } } } },
          { universe: { some: { universe: { name: { contains: q, mode: 'insensitive' } } } } },
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
        universe: {
          include: {
            universe: {
              include: {
                contents: {
                  include: {
                    content: {
                      select: {
                        id: true,
                        slug: true,
                        titleEnglish: true,
                        titleTelugu: true,
                        poster: true,
                        type: true,
                        year: true
                      }
                    }
                  },
                  orderBy: { order: 'asc' }
                }
              }
            }
          }
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
    // 1. Get explicit relations from database
    const explicitRelations = await prisma.contentRelation.findMany({
      where: {
        OR: [
          { sourceId: contentId },
          { targetId: contentId }
        ]
      },
      select: {
        source: { select: contentSelect },
        target: { select: contentSelect }
      }
    })

    const related = explicitRelations.map(r => r.source.id === contentId ? r.target : r.source)
    
    if (related.length >= limit) {
      return related.slice(0, limit)
    }

    const seenIds = new Set([contentId, ...related.map(r => r.id)])

    // 2. Fetch target item details for fallback criteria
    const item = await prisma.content.findUnique({
      where: { id: contentId },
      select: {
        year: true,
        genres: { select: { genre: { select: { id: true } } } },
        universe: { select: { universeId: true } }
      }
    })

    if (!item) return related

    const genreIds = item.genres.map(g => g.genre.id)
    const universeIds = item.universe.map(u => u.universeId)

    // 3. Find candidates that have same type
    // If universe exists, try to find other items in the same universe first
    let universeCandidates: any[] = []
    if (universeIds.length > 0) {
      universeCandidates = await prisma.content.findMany({
        where: {
          id: { notIn: Array.from(seenIds) },
          universe: { some: { universeId: { in: universeIds } } }
        },
        select: contentSelect,
        orderBy: { popularityScore: 'desc' },
        take: limit
      })
      universeCandidates.forEach(c => seenIds.add(c.id))
    }

    // 4. Find candidates with matching genres & type
    let genreCandidates: any[] = []
    if (genreIds.length > 0) {
      genreCandidates = await prisma.content.findMany({
        where: {
          id: { notIn: Array.from(seenIds) },
          type,
          genres: { some: { genreId: { in: genreIds } } }
        },
        select: contentSelect,
        orderBy: { popularityScore: 'desc' },
        take: limit
      })
      genreCandidates.forEach(c => seenIds.add(c.id))
    }

    // 5. General fallback by same type and close year (+/- 3 years)
    const yearCandidates = await prisma.content.findMany({
      where: {
        id: { notIn: Array.from(seenIds) },
        type,
        ...(item.year && {
          year: {
            gte: item.year - 3,
            lte: item.year + 3
          }
        })
      },
      select: contentSelect,
      orderBy: { popularityScore: 'desc' },
      take: limit
    })
    yearCandidates.forEach(c => seenIds.add(c.id))

    const combined = [
      ...related,
      ...universeCandidates,
      ...genreCandidates,
      ...yearCandidates
    ]

    // Fallback to general same-type popularity if still not enough
    if (combined.length < limit) {
      const typeCandidates = await prisma.content.findMany({
        where: {
          id: { notIn: combined.map(c => c.id).concat(contentId) },
          type
        },
        select: contentSelect,
        orderBy: { popularityScore: 'desc' },
        take: limit - combined.length
      })
      combined.push(...typeCandidates)
    }

    return combined.slice(0, limit)
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
