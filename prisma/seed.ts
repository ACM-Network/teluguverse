import { PrismaClient, ContentType, ContentStatus } from '@prisma/client'

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
  ].map(g => prisma.genre.upsert({ where: { slug: g.slug }, update: {}, create: g })))

  console.log(`✅ ${genres.length} genres seeded`)

  // Sample content
  const contents = [
    {
      slug: 'kalki-2898-ad',
      type: ContentType.MOVIE,
      status: ContentStatus.COMPLETED,
      titleEnglish: 'Kalki 2898 AD',
      titleTelugu: 'కల్కి 2898 AD',
      descriptionEnglish: 'Set in a dystopian future in 2898 AD, the story follows the mythological figure of Kalki, the 10th avatar of Vishnu, and a fierce warrior named Bhairava.',
      descriptionTelugu: 'భవిష్యత్తులో, 2898 సంవత్సరంలో, ప్రపంచం చీకటి అధికారాల పట్టులో ఉంది. కల్కి అవతారం రావాలని పురాణాలు చెప్తున్నాయి. భైరా అనే యోధుడు ఒక అద్భుతమైన ప్రయాణం చేస్తాడు.',
      storyExplanation: 'కల్కి 2898 AD కథ పురాణాలు మరియు భవిష్యత్తు సంయోగంతో నడుస్తుంది...',
      endingExplanation: 'చివర్లో కల్కి అవతారం తీసుకుంటాడు మరియు చీకటి శక్తులకు వ్యతిరేకంగా పోరాటం మొదలవుతుంది...',
      funFacts: ['Production took over 3 years', 'Budget was ₹600 crore', 'Released in 7 languages simultaneously', 'VFX team of 400+ artists worked for 2 years'],
      year: 2024,
      runtime: 181,
      imdbRating: 6.8,
      studio: 'Vyjayanthi Movies',
      language: 'Telugu',
      country: 'India',
      teluguDubAvail: true,
      teluguSubAvail: true,
      hindiDubAvail: true,
      isFeatured: true,
      isTrending: true,
      isTopRated: false,
      trendingScore: 95.5,
      popularityScore: 98.2,
    },
    {
      slug: 'rrr',
      type: ContentType.MOVIE,
      status: ContentStatus.COMPLETED,
      titleEnglish: 'RRR',
      titleTelugu: 'RRR',
      descriptionEnglish: 'A fictional story about two legendary revolutionaries and their journey away from home before they started fighting for their country in 1920s.',
      descriptionTelugu: 'బ్రిటీష్ పాలనలో ఇద్దరు వీరుల కథ. కోమారం భీమ్ మరియు అల్లూరి సీతారామరాజు – అడవి నుండి వచ్చిన విప్లవ శక్తులు.',
      year: 2022,
      runtime: 187,
      imdbRating: 8.0,
      studio: 'DVV Entertainment',
      language: 'Telugu',
      country: 'India',
      teluguDubAvail: true,
      teluguSubAvail: true,
      hindiDubAvail: true,
      isTrending: true,
      isTopRated: true,
      trendingScore: 88.0,
      popularityScore: 95.0,
    },
    {
      slug: 'attack-on-titan',
      type: ContentType.ANIME,
      status: ContentStatus.COMPLETED,
      titleEnglish: 'Attack on Titan',
      titleTelugu: 'ఎరేన్ యగర్ పోరాటం',
      titleOriginal: 'Shingeki no Kyojin',
      descriptionEnglish: 'After his hometown is destroyed and his mother is killed, young Eren Yeager vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.',
      descriptionTelugu: 'భీమాకార రాక్షసుల నుండి మానవులు తమ గోడలలో రక్షించుకున్న కథ. ఎరేన్ తన స్వేచ్ఛ కోసం పోరాటం. అద్భుతమైన కథ మరియు పాత్రలతో ఈ అనిమే తెలుగు అభిమానులకు చాలా ప్రత్యేకమైనది.',
      year: 2013,
      totalEpisodes: 94,
      totalSeasons: 4,
      imdbRating: 9.0,
      malRating: 9.1,
      studio: 'MAPPA / Wit Studio',
      language: 'Japanese',
      country: 'Japan',
      teluguDubAvail: true,
      teluguSubAvail: true,
      hindiDubAvail: true,
      isTrending: true,
      isTopRated: true,
      trendingScore: 92.0,
      popularityScore: 97.5,
    },
    {
      slug: 'demon-slayer',
      type: ContentType.ANIME,
      status: ContentStatus.ONGOING,
      titleEnglish: 'Demon Slayer',
      titleTelugu: 'కిమెత్సు నో యైబా',
      titleOriginal: 'Kimetsu no Yaiba',
      descriptionEnglish: 'A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon.',
      descriptionTelugu: 'తన కుటుంబాన్ని రాక్షసి చేసిన శత్రువుకు వ్యతిరేకంగా టాంజిరో పోరాటం. అద్భుతమైన యానిమేషన్ మరియు భావోద్వేగ కథ.',
      year: 2019,
      totalEpisodes: 55,
      totalSeasons: 4,
      imdbRating: 8.7,
      malRating: 8.6,
      studio: 'ufotable',
      language: 'Japanese',
      country: 'Japan',
      teluguDubAvail: true,
      teluguSubAvail: true,
      hindiDubAvail: true,
      isTrending: true,
      isTopRated: true,
      trendingScore: 90.0,
      popularityScore: 96.0,
    },
    {
      slug: 'squid-game',
      type: ContentType.KDRAMA,
      status: ContentStatus.COMPLETED,
      titleEnglish: 'Squid Game',
      titleTelugu: 'స్క్విడ్ గేమ్',
      titleOriginal: '오징어 게임',
      descriptionEnglish: 'Hundreds of cash-strapped players accept a strange invitation to compete in children\'s games for a tempting prize, but the stakes are deadly.',
      descriptionTelugu: 'ఆర్థిక ఇబ్బందులతో ఉన్న వ్యక్తులు ఒక రహస్య ఆటలో పాల్గొంటారు. గెలిచినవారికి భారీ బహుమతి, మిగిలినవారికి మరణం.',
      year: 2021,
      totalEpisodes: 9,
      totalSeasons: 2,
      imdbRating: 8.0,
      studio: 'Netflix Korea',
      language: 'Korean',
      country: 'South Korea',
      teluguDubAvail: true,
      teluguSubAvail: true,
      hindiDubAvail: true,
      isTrending: true,
      isTopRated: true,
      trendingScore: 89.0,
      popularityScore: 99.0,
    },
    {
      slug: 'crash-landing-on-you',
      type: ContentType.KDRAMA,
      status: ContentStatus.COMPLETED,
      titleEnglish: 'Crash Landing on You',
      titleTelugu: 'నీపై వాలిన నా హృదయం',
      titleOriginal: '사랑의 불시착',
      descriptionEnglish: 'A South Korean heiress accidentally crash-lands in North Korea and falls in love with a North Korean military officer.',
      descriptionTelugu: 'దక్షిణ కొరియా వ్యాపారవేత్త ఉత్తర కొరియాలో పడిపోయి ఒక సైనికుని ప్రేమలో పడుతుంది. అద్భుతమైన ప్రేమ కథ.',
      year: 2019,
      totalEpisodes: 16,
      totalSeasons: 1,
      imdbRating: 8.7,
      studio: 'Studio Dragon',
      language: 'Korean',
      country: 'South Korea',
      teluguDubAvail: true,
      teluguSubAvail: true,
      hindiDubAvail: false,
      isTrending: false,
      isTopRated: true,
      trendingScore: 78.0,
      popularityScore: 88.0,
    },
  ]

  for (const content of contents) {
    await prisma.content.upsert({
      where: { slug: content.slug },
      update: {},
      create: content,
    })
  }
  console.log(`✅ ${contents.length} content items seeded`)

  // Streaming links
  const streamingData = [
    { slug: 'kalki-2898-ad', links: [{ platform: 'NETFLIX', isTeluguDub: true }, { platform: 'HOTSTAR', isTeluguDub: false }] },
    { slug: 'rrr', links: [{ platform: 'NETFLIX', isTeluguDub: true }, { platform: 'AMAZON_PRIME', isTeluguDub: false }] },
    { slug: 'attack-on-titan', links: [{ platform: 'CRUNCHYROLL', isTeluguDub: true }, { platform: 'NETFLIX', isTeluguDub: false }] },
    { slug: 'demon-slayer', links: [{ platform: 'CRUNCHYROLL', isTeluguDub: true }, { platform: 'NETFLIX', isTeluguDub: true }] },
    { slug: 'squid-game', links: [{ platform: 'NETFLIX', isTeluguDub: true }] },
    { slug: 'crash-landing-on-you', links: [{ platform: 'NETFLIX', isTeluguDub: false }, { platform: 'VIKI', isTeluguDub: false }] },
  ]

  for (const { slug, links } of streamingData) {
    const content = await prisma.content.findUnique({ where: { slug } })
    if (!content) continue
    for (const link of links) {
      await prisma.streamingLink.upsert({
        where: { contentId_platform: { contentId: content.id, platform: link.platform as any } },
        update: {},
        create: { contentId: content.id, platform: link.platform as any, isAvailable: true, isTeluguDub: link.isTeluguDub, isPremium: true },
      })
    }
  }
  console.log('✅ Streaming links seeded')

  // Sample admin user
  const bcrypt = require('bcryptjs')
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
  console.log('✅ Admin user seeded (admin@teluguverse.com / admin123456)')
  console.log('🎉 Seeding complete!')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
