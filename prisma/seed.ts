import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

import { movies } from './data/movies'
import { animes } from './data/animes'
import { series } from './data/series'
import { kdramas } from './data/kdramas'
import { hollywood } from './data/hollywood'
import { cartoons } from './data/cartoons'
import { expandedContent } from './data/expanded_data'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding TeluguVerse database...')

  // 1. Seed Genres
  console.log('⏳ Seeding genres...')
  const genreSeeds = [
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
    { name: 'Super Hero', nameTe: 'సూపర్ హీరో', slug: 'super-hero', color: '#ff0000', icon: '🦸' },
  ]

  const seededGenres = await Promise.all(
    genreSeeds.map(g =>
      prisma.genre.upsert({
        where: { slug: g.slug },
        update: {},
        create: g,
      })
    )
  )
  console.log(`✅ ${seededGenres.length} genres ready`)

  // 2. Seed Universes
  console.log('⏳ Seeding universes...')
  const universesData = [
    {
      id: 'mcu',
      name: 'Marvel Cinematic Universe',
      nameTe: 'మార్వెల్ యూనివర్స్',
      description: 'The epic franchise of Marvel super heroes.',
      color: '#E50914',
    },
    {
      id: 'dc',
      name: 'DC Universe',
      nameTe: 'DC యూనివర్స్',
      description: 'The dark and legendary world of DC comics.',
      color: '#00A8E0',
    },
    {
      id: 'baahubali',
      name: 'Baahubali Universe',
      nameTe: 'బాహుబలి విశ్వం',
      description: 'The grand and legendary kingdom of Mahishmati and its epic stories.',
      color: '#F59E0B',
    },
    {
      id: 'onepiece',
      name: 'One Piece Universe',
      nameTe: 'వన్ పీస్ జగత్తు',
      description: 'The legendary anime journey of Monkey D. Luffy and the Straw Hat Pirates.',
      color: '#A855F7',
    },
    {
      id: 'monsterverse',
      name: 'MonsterVerse',
      nameTe: 'మాన్స్టర్వర్స్',
      description: 'The cinematic franchise featuring Godzilla, King Kong, and other titans.',
      color: '#22C55E',
    },
    {
      id: 'naruto',
      name: 'Naruto Universe',
      nameTe: 'నరుటో విశ్వం',
      description: 'The journey of Naruto Uzumaki and the ninja world of Hidden Leaf.',
      color: '#FF8C00',
    },
    {
      id: 'lcu',
      name: 'Lokesh Cinematic Universe (LCU)',
      nameTe: 'లోకేష్ కనగరాజ్ సినిమాటిక్ యూనివర్స్',
      description: 'The gritty and high-octane drug cartel action universe created by Lokesh Kanagaraj.',
      color: '#06B6D4',
    }
  ]

  const seededUniverses = await Promise.all(
    universesData.map(u =>
      prisma.universe.upsert({
        where: { id: u.id },
        update: {
          name: u.name,
          nameTe: u.nameTe,
          description: u.description,
          color: u.color
        },
        create: u
      })
    )
  )
  console.log(`✅ ${seededUniverses.length} universes ready`)

  // 3. Merge & Seed Content items
  const rawContents: any[] = [
    ...movies,
    ...animes,
    ...series,
    ...kdramas,
    ...hollywood,
    ...cartoons,
    ...expandedContent,
  ]

  const contents: any[] = []
  const seenSlugs = new Set<string>()
  for (const c of rawContents) {
    if (!seenSlugs.has(c.slug)) {
      seenSlugs.add(c.slug)
      contents.push(c)
    }
  }

  console.log(`⏳ Seeding ${contents.length} unique content items...`)
  for (const content of contents) {
    // Upsert base content item
    const dbContent = await prisma.content.upsert({
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
        titleOriginal: content.titleOriginal || null,
        descriptionEnglish: content.description.en,
        descriptionTelugu: content.description.te,
        storyExplanation: content.storyExplanation || null,
        endingExplanation: content.endingExplanation || null,
        funFacts: content.funFacts || null,
        year: content.year,
        runtime: content.runtime || null,
        totalEpisodes: content.totalEpisodes || null,
        totalSeasons: content.totalSeasons || null,
        imdbRating: content.imdbRating || null,
        malRating: content.malRating || null,
        ageRating: content.ageRating || null,
        studio: content.studio || null,
        language: content.language,
        country: content.country,
        teluguDubAvail: content.teluguDubAvail || false,
        teluguSubAvail: content.teluguSubAvail || false,
        hindiDubAvail: content.hindiDubAvail || false,
        isFeatured: content.isFeatured || false,
        isTrending: content.isTrending || false,
        isTopRated: content.isTopRated || false,
        trendingScore: content.trendingScore || 0,
        popularityScore: content.popularityScore || 0,
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
        titleOriginal: content.titleOriginal || null,
        descriptionEnglish: content.description.en,
        descriptionTelugu: content.description.te,
        storyExplanation: content.storyExplanation || null,
        endingExplanation: content.endingExplanation || null,
        funFacts: content.funFacts || null,
        year: content.year,
        runtime: content.runtime || null,
        totalEpisodes: content.totalEpisodes || null,
        totalSeasons: content.totalSeasons || null,
        imdbRating: content.imdbRating || null,
        malRating: content.malRating || null,
        ageRating: content.ageRating || null,
        studio: content.studio || null,
        language: content.language,
        country: content.country,
        teluguDubAvail: content.teluguDubAvail || false,
        teluguSubAvail: content.teluguSubAvail || false,
        hindiDubAvail: content.hindiDubAvail || false,
        isFeatured: content.isFeatured || false,
        isTrending: content.isTrending || false,
        isTopRated: content.isTopRated || false,
        trendingScore: content.trendingScore || 0,
        popularityScore: content.popularityScore || 0,
      },
    })

    // Dynamic Seeding: OTT platforms / streaming links
    if (content.ottPlatforms) {
      for (const platformItem of content.ottPlatforms) {
        const platform = typeof platformItem === 'string' ? platformItem : platformItem.platform
        const url = typeof platformItem === 'string' ? null : platformItem.url

        await prisma.streamingLink.upsert({
          where: {
            contentId_platform: {
              contentId: dbContent.id,
              platform: platform as any,
            },
          },
          update: {
            isTeluguDub: content.teluguDubAvail || false,
            isAvailable: true,
            url: url || null,
          },
          create: {
            contentId: dbContent.id,
            platform: platform as any,
            isAvailable: true,
            isTeluguDub: content.teluguDubAvail || false,
            isPremium: true,
            url: url || null,
          },
        })
      }
    }

    // Dynamic Seeding: Genres
    if (content.genres) {
      for (const genreName of content.genres) {
        const genreSlug = genreName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        const dbGenre = await prisma.genre.findUnique({
          where: { slug: genreSlug },
        })
        if (dbGenre) {
          await prisma.contentGenre.upsert({
            where: {
              contentId_genreId: {
                contentId: dbContent.id,
                genreId: dbGenre.id,
              },
            },
            update: {},
            create: {
              contentId: dbContent.id,
              genreId: dbGenre.id,
            },
          })
        }
      }
    }

    // Dynamic Seeding: Directors
    if (content.directors) {
      for (const dirName of content.directors) {
        let dbDirector = await prisma.director.findFirst({
          where: { name: dirName },
        })
        if (!dbDirector) {
          dbDirector = await prisma.director.create({
            data: { name: dirName },
          })
        }
        // Link content to director
        await prisma.content.update({
          where: { id: dbContent.id },
          data: {
            directors: {
              connect: { id: dbDirector.id }
            }
          }
        })
      }
    }

    // Dynamic Seeding: Universe link
    if (content.universeInfo) {
      const { universeId, order, phase } = content.universeInfo
      await prisma.universeContent.upsert({
        where: {
          universeId_contentId: {
            universeId,
            contentId: dbContent.id,
          },
        },
        update: {
          order,
          phase,
        },
        create: {
          universeId,
          contentId: dbContent.id,
          order,
          phase,
        },
      })
    }
  }
  console.log(`✅ Seeding of ${contents.length} content items completed`)

  // 4. Seeding: Similar Content Relations (Post-Creation Pass)
  console.log('⏳ Seeding similar content relations...')
  let relationCount = 0
  for (const content of contents) {
    if (content.similarSlugs) {
      const source = await prisma.content.findUnique({
        where: { slug: content.slug },
      })
      if (!source) continue

      for (const targetSlug of content.similarSlugs) {
        const target = await prisma.content.findUnique({
          where: { slug: targetSlug },
        })
        if (!target) continue

        await prisma.contentRelation.upsert({
          where: {
            sourceId_targetId: {
              sourceId: source.id,
              targetId: target.id,
            },
          },
          update: {},
          create: {
            sourceId: source.id,
            targetId: target.id,
            type: 'SIMILAR',
          },
        })
        relationCount++
      }
    }
  }
  console.log(`✅ Seeded ${relationCount} similar content relationships`)

  // 5. Seed Admin user
  console.log('⏳ Seeding admin user...')
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
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())