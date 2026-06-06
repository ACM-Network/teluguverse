import { movies } from '../prisma/data/movies.ts'
import { animes } from '../prisma/data/animes.ts'
import { series } from '../prisma/data/series.ts'
import { kdramas } from '../prisma/data/kdramas.ts'
import { hollywood } from '../prisma/data/hollywood.ts'
import { cartoons } from '../prisma/data/cartoons.ts'
import { expandedContent } from '../prisma/data/expanded_data.ts'

const rawContents: any[] = [
  ...movies,
  ...animes,
  ...series,
  ...kdramas,
  ...hollywood,
  ...cartoons,
  ...expandedContent,
]

// Deduplicate by slug, exactly like seed.ts
const allItems: any[] = []
const seenSlugsForDedup = new Set<string>()
for (const item of rawContents) {
  if (!seenSlugsForDedup.has(item.slug)) {
    seenSlugsForDedup.add(item.slug)
    allItems.push(item)
  }
}

console.log(`Starting content validation pass for ${allItems.length} unique items...`)

let failed = false
const errors: string[] = []

// Helper to log error
function logError(msg: string) {
  failed = true
  errors.push(msg)
  console.log(`❌ ${msg}`)
}

// Check for duplicates across DIFFERENT items
const seenPosters = new Set<string>()
const seenBanners = new Set<string>()
const seenDescsEn = new Set<string>()
const seenDescsTe = new Set<string>()

// AI Phrasing patterns
const aiPhrases = [
  /\bembark(s|ing)?\b/i,
  /\bperilous\s+journey\b/i,
  /\bdelve(s|ing)?\s+deep(er)?\b/i,
  /\bjourney\s+of\s+discovery\b/i,
  /\bquest\s+to\s+prove\b/i
]

for (const item of allItems) {
  const title = item.title?.en || item.titleEnglish || item.slug

  // B. Check Title and Description presence
  const titleEn = item.title?.en || item.titleEnglish
  const titleTe = item.title?.te || item.titleTelugu
  const descEn = item.description?.en || item.descriptionEnglish
  const descTe = item.description?.te || item.descriptionTelugu

  if (!titleEn) logError(`[${item.slug}]: Missing English title`)
  if (!titleTe) logError(`[${item.slug}]: Missing Telugu title`)
  if (!descEn) logError(`[${item.slug}]: Missing English description`)
  if (!descTe) logError(`[${item.slug}]: Missing Telugu description`)

  // C. Check Placeholders in copy
  const checkPlaceholder = (text: string, field: string) => {
    if (!text) return
    const lower = text.toLowerCase()
    const keywords = ['lorem ipsum', 'placeholder', 'temp description', 'temporary description']
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        logError(`[${item.slug}]: Placeholder keyword "${kw}" found in ${field}`)
      }
    }
  }
  checkPlaceholder(titleEn, 'English title')
  checkPlaceholder(titleTe, 'Telugu title')
  checkPlaceholder(descEn, 'English description')
  checkPlaceholder(descTe, 'Telugu description')

  // D. Check for duplicate/repeated descriptions (except empty/missing)
  if (descEn) {
    if (seenDescsEn.has(descEn)) {
      logError(`[${item.slug}]: Repeated/Duplicate English description found: "${descEn.slice(0, 50)}..."`)
    }
    seenDescsEn.add(descEn)
  }
  if (descTe) {
    if (seenDescsTe.has(descTe)) {
      logError(`[${item.slug}]: Repeated/Duplicate Telugu description found: "${descTe.slice(0, 50)}..."`)
    }
    seenDescsTe.add(descTe)
  }

  // E. Check for AI phrasing
  if (descEn) {
    for (const pattern of aiPhrases) {
      if (pattern.test(descEn)) {
        logError(`[${item.slug}]: AI phrasing matched by pattern ${pattern} in English description: "${descEn}"`)
      }
    }
  }

  // F. Image checks (formats and placeholders)
  const checkImageUrl = (url: string | undefined, field: string) => {
    if (!url) {
      logError(`[${item.slug}]: Missing ${field} URL`)
      return
    }
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
      logError(`[${item.slug}]: Invalid ${field} URL format: "${url}"`)
    }
    const placeholders = ['78909Y', 'col456', '56789Y', 'xU95ii', 'h1B7tW', 'fcKyEr', 'npdB6e', 'placeholder']
    if (placeholders.some(p => url.includes(p))) {
      logError(`[${item.slug}]: Placeholder string found in ${field} URL: "${url}"`)
    }
  }
  checkImageUrl(item.poster, 'poster')
  checkImageUrl(item.banner, 'banner')

  // G. Check for duplicate posters/banners across different titles (indicates copy-paste issues)
  if (item.poster) {
    if (seenPosters.has(item.poster)) {
      logError(`[${item.slug}]: Poster URL is duplicated elsewhere: "${item.poster}"`)
    }
    seenPosters.add(item.poster)
  }
  if (item.banner) {
    if (seenBanners.has(item.banner)) {
      logError(`[${item.slug}]: Banner URL is duplicated elsewhere: "${item.banner}"`)
    }
    seenBanners.add(item.banner)
  }

  // H. Match check: Genre matches title
  if (item.genres) {
    // Basic verification: genres is not empty
    if (item.genres.length === 0) {
      logError(`[${item.slug}]: Genres array is empty`)
    }
    // Specific check: superhero movies should have 'Super Hero' or 'Action' or 'Sci-Fi' etc.
    const isSuperHeroMovie = item.slug.includes('batman') || item.slug.includes('iron-man') || item.slug.includes('avengers') || item.slug.includes('thor') || item.slug.includes('captain-america') || item.slug.includes('spider-man') || item.slug.includes('black-panther') || item.slug.includes('ant-man') || item.slug.includes('fantastic-four') || item.slug.includes('deadpool') || item.slug.includes('daredevil') || item.slug.includes('falcon') || item.slug.includes('wolverine')
    if (isSuperHeroMovie && !item.genres.includes('Super Hero')) {
      logError(`[${item.slug}]: Superhero title does not have 'Super Hero' genre`)
    }
  }

  // I. Match check: Industry matches title
  if (item.type) {
    if (item.type === 'ANIME' && item.language !== 'Japanese' && item.slug !== 'pokemon-journeys') {
      logError(`[${item.slug}]: Anime has language "${item.language}" instead of Japanese`)
    }
    if (item.type === 'KDRAMA' && item.language !== 'Korean') {
      logError(`[${item.slug}]: K-Drama has language "${item.language}" instead of Korean`)
    }
  }

  // J. Match check: Universe matches title
  if (item.universeInfo) {
    const uId = item.universeInfo.universeId
    if (uId === 'mcu') {
      const isMCU = item.slug.includes('iron-man') || item.slug.includes('thor') || item.slug.includes('captain-america') || item.slug.includes('avengers') || item.slug.includes('hulk') || item.slug.includes('guardians') || item.slug.includes('ant-man') || item.slug.includes('doctor-strange') || item.slug.includes('spider-man') || item.slug.includes('black-panther') || item.slug.includes('captain-marvel') || item.slug.includes('black-widow') || item.slug.includes('shang-chi') || item.slug.includes('eternals') || item.slug.includes('wandavision') || item.slug.includes('loki') || item.slug.includes('what-if') || item.slug.includes('hawkeye') || item.slug.includes('moon-knight') || item.slug.includes('ms-marvel') || item.slug.includes('she-hulk') || item.slug.includes('secret-invasion') || item.slug.includes('echo') || item.slug.includes('ironheart') || item.slug.includes('vision-quest') || item.slug.includes('thunderbolts') || item.slug.includes('fantastic-four') || item.slug.includes('daredevil') || item.slug.includes('falcon') || item.slug.includes('marvels') || item.slug.includes('deadpool') || item.slug.includes('wolverine')
      if (!isMCU) {
        logError(`[${item.slug}]: Universe is 'mcu' but title does not seem to match Marvel`)
      }
    } else if (uId === 'dc') {
      const isDC = item.slug.includes('batman') || item.slug.includes('dark-knight')
      if (!isDC) {
        logError(`[${item.slug}]: Universe is 'dc' but title does not seem to match DC`)
      }
    } else if (uId === 'lcu') {
      const isLCU = item.slug.includes('kaithi') || item.slug.includes('vikram') || item.slug.includes('leo') || item.slug.includes('rolex')
      if (!isLCU) {
        logError(`[${item.slug}]: Universe is 'lcu' but title does not seem to match Lokesh Cinematic Universe`)
      }
    } else if (uId === 'baahubali') {
      const isBaahubali = item.slug.includes('baahubali') || item.slug.includes('b-hubali')
      if (!isBaahubali) {
        logError(`[${item.slug}]: Universe is 'baahubali' but title does not seem to match Baahubali`)
      }
    }
  }
}

console.log('\n==========================================')
if (failed) {
  console.log(`📊 VALIDATION FAILED! Found ${errors.length} errors.`)
  process.exit(1)
} else {
  console.log(`📊 VALIDATION SUCCESSFUL! Verified all ${allItems.length} unique content entries.`)
  process.exit(0)
}
