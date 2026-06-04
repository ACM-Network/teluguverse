import { movies } from '../prisma/data/movies.ts'
import { animes } from '../prisma/data/animes.ts'
import { series } from '../prisma/data/series.ts'
import { kdramas } from '../prisma/data/kdramas.ts'
import { hollywood } from '../prisma/data/hollywood.ts'
import { cartoons } from '../prisma/data/cartoons.ts'
import { expandedContent } from '../prisma/data/expanded_data.ts'

interface Content {
  slug: string
  type: string
  title: { en: string; te?: string }
  description: { en: string; te?: string }
  poster?: string
  banner?: string
  year?: number
  genres?: string[]
}

const allContents: any[] = [
  ...movies,
  ...animes,
  ...series,
  ...kdramas,
  ...hollywood,
  ...cartoons,
  ...expandedContent,
]

// Deduplicate by slug
const contents: any[] = []
const seenSlugs = new Set<string>()
for (const c of allContents) {
  if (!seenSlugs.has(c.slug)) {
    seenSlugs.add(c.slug)
    contents.push(c)
  }
}

console.log(`Loaded ${contents.length} unique content items. Starting audit...`)

const CONCURRENCY = 25
const TIMEOUT_MS = 4000

async function checkUrl(url: string | undefined): Promise<{ ok: boolean; status: string }> {
  if (!url) return { ok: false, status: 'MISSING' }
  
  // Check for placeholder keywords in URL
  const placeholders = ['78909Y', 'col456', '56789Y', 'xU95ii', 'h1B7tW', 'fcKyEr', 'npdB6e', 'placeholder']
  if (placeholders.some(p => url.includes(p))) {
    return { ok: false, status: 'PLACEHOLDER_URL' }
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    if (res.status === 200) {
      return { ok: true, status: '200' }
    } else {
      return { ok: false, status: `HTTP_${res.status}` }
    }
  } catch (e: any) {
    clearTimeout(timeoutId)
    return { ok: false, status: `ERROR_${e.name === 'AbortError' ? 'TIMEOUT' : e.message}` }
  }
}

async function runAudit() {
  const results: any[] = []
  const queue = [...contents]
  let activeCount = 0
  let completedCount = 0

  return new Promise<void>((resolve) => {
    async function next() {
      if (queue.length === 0 && activeCount === 0) {
        resolve()
        return
      }

      while (queue.length > 0 && activeCount < CONCURRENCY) {
        const item = queue.shift()!
        activeCount++
        
        // Run audit on this item asynchronously
        (async () => {
          const titleEn = item.title?.en || item.titleEnglish || ''
          const titleTe = item.title?.te || item.titleTelugu || ''
          const descEn = item.description?.en || item.descriptionEnglish || ''
          const descTe = item.description?.te || item.descriptionTelugu || ''

          const errors: string[] = []

          // 1. Check title/description presence
          if (!titleEn) errors.push('Missing English Title')
          if (!titleTe) errors.push('Missing Telugu Title')
          if (!descEn) errors.push('Missing English Description')
          if (!descTe) errors.push('Missing Telugu Description')

          // 2. Check for lorem ipsum or fake text in descriptions
          const descWords = [descEn, descTe].join(' ').toLowerCase()
          if (descWords.includes('lorem') || descWords.includes('ipsum') || descWords.includes('placeholder') || /\btemporary\b/.test(descWords) || /\btemp description\b/.test(descWords)) {
            errors.push('Placeholder/Lorem Ipsum text in description')
          }

          // 3. Check images
          const posterUrl = item.poster
          const bannerUrl = item.banner

          const [posterCheck, bannerCheck] = await Promise.all([
            checkUrl(posterUrl),
            checkUrl(bannerUrl)
          ])

          if (!posterCheck.ok) {
            errors.push(`Poster check failed: ${posterCheck.status} (${posterUrl})`)
          }
          if (!bannerCheck.ok) {
            errors.push(`Banner check failed: ${bannerCheck.status} (${bannerUrl})`)
          }

          if (errors.length > 0) {
            console.log(`🚨 Audit Alert [${item.slug}] (${item.type}):\n${errors.map(e => `   - ${e}`).join('\n')}`)
            results.push({ slug: item.slug, title: titleEn, type: item.type, errors })
          }

          activeCount--
          completedCount++
          if (completedCount % 50 === 0) {
            console.log(`Progress: ${completedCount}/${contents.length} items audited.`)
          }
          next()
        })()
      }
    }

    next()
  }).then(() => {
    console.log('\n==========================================')
    console.log(`📊 AUDIT COMPLETED. Found ${results.length} items with issues.`)
    console.log('==========================================\n')
  })
}

runAudit()
