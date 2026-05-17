import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

import { movies } from './data/movies'
import { animes } from './data/animes'
import { series } from './data/series'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding TeluguVerse database...')

  // Genres
  const genres = await Promise.all([
    { name: 'Action', nameTe: 'యాక్షన్', slug: 'action', color: '#E50914', icon: '⚔️' },
    { name: 'Romance', nameTe: 'రొమాన్స్', slug: 'romance', color: '#ec4899', icon: '❤️' },
    { name: 'Thriller', nameTe: 'థ్రిల్లర్', slug: 'thriller', color: '#f59e0b', icon: '🎭' },
    { name: 'Comedy', nameTe: 'కామెడీ', slug: 'comedy', color: '#22c55e', icon: '😂' },
    { name: 'Drama', nameTe: 'డ్రామా', slug: 'drama', color: '#3b82f6', icon: '🎬' },
    { name: 'Sci-Fi', nameTe: 'సైన్స్ ఫిక్షన్', slug: 'sci-fi', color: '#06b6d4', icon: '🚀' },
    { name: 'Fantasy', nameTe: 'ఫాంటసీ', slug: 'fantasy', color: '#8b5cf6', icon: '🔮' },
    { name: 'Horror', nameTe: 'హారర్', slug: 'horror', color: '#dc2626', icon: '👻' },
    { name: 'Historical', nameTe: 'చారిత్రక', slug: 'historical', color: '#b45309', icon: '🏛️' },
    { name: 'Mythology', nameTe: 'పౌరాణిక', slug: 'mythology', color: '#FFD700', icon: '🕉️' },
    { name: 'Crime', nameTe: 'క్రైమ్', slug: 'crime', color: '#374151', icon: '🔫' },
    { name: 'Adventure', nameTe: 'అడ్వెంచర్', slug: 'adventure', color: '#10b981', icon: '🗺️' },
    { name: 'Supernatural', nameTe: 'అతీంద్రియ', slug: 'supernatural', color: '#7c3aed', icon: '✨' },
    { name: 'Family', nameTe: 'కుటుంబ', slug: 'family', color: '#16a34a', icon: '👨‍👩‍👧' },
    { name: 'Sports', nameTe: 'స్పోర్ట్స్', slug: 'sports', color: '#2563eb', icon: '⚽' },
  ].map(g =>
    prisma.genre.upsert({
      where: { slug: g.slug },
      update: {},
      create: g,
    })
  ))

  console.log(`✅ ${genres.length} genres seeded`)

  // Content
  const contents = [
    ...movies,
    ...animes,
    ...series,
  ]

  for (const content of contents) {
  await prisma.content.upsert({
    where: { slug: content.slug },

    update: {
      slug: content.slug,
      type: content.type,
      status: content.status,

      poster: content.poster,
      banner: content.banner,
      trailer: content.trailer,

      titleEnglish: content.title.en,
      titleTelugu: content.title.te,

      descriptionEnglish: content.description.en,
      descriptionTelugu: content.description.te,

      year: content.year,
      runtime: content.runtime,
      imdbRating: content.imdbRating,

      studio: content.studio,
      language: content.language,
      country: content.country,

      teluguDubAvail: content.teluguDubAvail,
      teluguSubAvail: content.teluguSubAvail,
      hindiDubAvail: content.hindiDubAvail,

      isFeatured: content.isFeatured ?? false,
      isTrending: content.isTrending ?? false,
      isTopRated: content.isTopRated ?? false,

      trendingScore: content.trendingScore ?? 0,
      popularityScore: content.popularityScore ?? 0,
    },

    create: {
      slug: content.slug,
      type: content.type,
      status: content.status,

      poster: content.poster,
      banner: content.banner,
      trailer: content.trailer,

      titleEnglish: content.title.en,
      titleTelugu: content.title.te,

      descriptionEnglish: content.description.en,
      descriptionTelugu: content.description.te,

      year: content.year,
      runtime: content.runtime,
      imdbRating: content.imdbRating,

      studio: content.studio,
      language: content.language,
      country: content.country,

      teluguDubAvail: content.teluguDubAvail,
      teluguSubAvail: content.teluguSubAvail,
      hindiDubAvail: content.hindiDubAvail,

      isFeatured: content.isFeatured ?? false,
      isTrending: content.isTrending ?? false,
      isTopRated: content.isTopRated ?? false,

      trendingScore: content.trendingScore ?? 0,
      popularityScore: content.popularityScore ?? 0,
    },
  })
}

  console.log(`✅ ${contents.length} content items seeded`)

  // Streaming links
  const streamingData = [
    {
      slug: 'kalki-2898-ad',
      links: [
        { platform: 'AMAZON_PRIME', isTeluguDub: true }
      ]
    },

    {
      slug: 'rrr',
      links: [
        { platform: 'ZEE5', isTeluguDub: true }
      ]
    },

    {
      slug: 'attack-on-titan',
      links: [
        { platform: 'MUSE_INDIA_YT', isTeluguDub: true },
        { platform: 'ANIME_TIMES', isTeluguDub: true }
      ]
    },

    {
      slug: 'demon-slayer',
      links: [
        { platform: 'CRUNCHYROLL', isTeluguDub: true },
        { platform: 'ANIME_TIMES', isTeluguDub: true }
      ]
    },

    {
      slug: 'jujutsu-kaisen',
      links: [
        { platform: 'CRUNCHYROLL', isTeluguDub: true }
      ]
    },

    {
      slug: 'frieren-beyond-journeys-end',
      links: [
        { platform: 'CRUNCHYROLL', isTeluguDub: true }
      ]
    },
  ]

  for (const { slug, links } of streamingData) {
    const content = await prisma.content.findUnique({
      where: { slug },
    })

    if (!content) continue

    for (const link of links) {
      await prisma.streamingLink.upsert({
        where: {
          contentId_platform: {
            contentId: content.id,
            platform: link.platform as any,
          },
        },
        update: {},
        create: {
          contentId: content.id,
          platform: link.platform as any,
          isAvailable: true,
          isTeluguDub: link.isTeluguDub,
          isPremium: true,
        },
      })
    }
  }

  console.log('✅ Streaming links seeded')

  // Admin user
  const hashedPassword = await bcrypt.hash('admin123456', 12)

  await prisma.user.upsert({
    where: { email: 'admin@teluguverse.com' },
    update: {},
    create: {
      email: 'admin@teluguverse.com',
      username: 'admin',
      displayName: 'TeluguVerse Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isVerified: true,
    },
  })

  console.log('✅ Admin user seeded')
  console.log('🎉 Seeding complete!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())