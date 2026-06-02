import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export const UserService = {
  async create(data: { email: string; username: string; displayName: string; password: string }) {
    const hashed = await hashPassword(data.password)
    return prisma.user.create({
      data: { ...data, password: hashed },
      select: { id: true, email: true, username: true, displayName: true, role: true }
    })
  },

  async getById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, username: true, displayName: true, avatar: true, bio: true, role: true, createdAt: true,
        _count: { select: { reviews: true, watchlist: true, favorites: true, following: true, followers: true } }
      }
    })
  },

  async addToWatchlist(userId: string, contentId: string) {
    return prisma.watchlistItem.upsert({
      where: { contentId_userId: { contentId, userId } },
      update: {},
      create: { contentId, userId },
    })
  },

  async removeFromWatchlist(userId: string, contentId: string) {
    return prisma.watchlistItem.deleteMany({ where: { contentId, userId } })
  },

  async toggleFavorite(userId: string, contentId: string) {
    const existing = await prisma.favorite.findUnique({ where: { contentId_userId: { contentId, userId } } })
    if (existing) {
      await prisma.favorite.delete({ where: { contentId_userId: { contentId, userId } } })
      return { favorited: false }
    }
    await prisma.favorite.create({ data: { contentId, userId } })
    return { favorited: true }
  },

  async rateContent(userId: string, contentId: string, score: number) {
    const rating = await prisma.rating.upsert({
      where: { contentId_userId: { contentId, userId } },
      update: { score },
      create: { contentId, userId, score },
    })
    const agg = await prisma.rating.aggregate({ where: { contentId }, _avg: { score: true } })
    await prisma.content.update({ where: { id: contentId }, data: { imdbRating: agg._avg.score ?? undefined } })
    return rating
  },

  async getWatchlist(userId: string) {
    return prisma.watchlistItem.findMany({
      where: { userId },
      include: { content: { select: { id: true, slug: true, titleEnglish: true, titleTelugu: true, poster: true, type: true, imdbRating: true, year: true } } },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getFavorites(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      include: { content: { select: { id: true, slug: true, titleEnglish: true, titleTelugu: true, poster: true, type: true, imdbRating: true, year: true, directors: true, genres: { include: { genre: true } }, universe: true } } },
      orderBy: { createdAt: 'desc' },
    })
  },
}
