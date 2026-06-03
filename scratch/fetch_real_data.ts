import fs from 'fs'
import path from 'path'
import { movies } from '../prisma/data/movies.js'
import { animes } from '../prisma/data/animes.js'
import { series } from '../prisma/data/series.js'
import { kdramas } from '../prisma/data/kdramas.js'
import { hollywood } from '../prisma/data/hollywood.js'
import { cartoons } from '../prisma/data/cartoons.js'

const API_KEY = '4e44d9029b1270a757cddc766a1bcb63'
const targetCount = 500

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function translateToTelugu(text: string): Promise<string> {
  if (!text) return ''
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=te&dt=t&q=${encodeURIComponent(text)}`
    const res = await fetch(url)
    if (res.status === 200) {
      const data = await res.json()
      if (Array.isArray(data) && data[0]) {
        return data[0].map((x: any) => x[0]).join('')
      }
    }
  } catch (e) {
    console.error('Translation error:', e)
  }
  return ''
}

// Map TMDB genre IDs to our internal genres
function mapGenres(genreIds: number[]): string[] {
  const mapping: Record<number, string> = {
    28: 'Action',
    12: 'Adventure',
    35: 'Comedy',
    80: 'Crime',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'Historical',
    27: 'Horror',
    9648: 'Thriller',
    10749: 'Romance',
    878: 'Sci-Fi',
    10759: 'Action', // Action & Adventure (TV)
    10765: 'Sci-Fi',  // Sci-Fi & Fantasy (TV)
  }
  
  const result = new Set<string>()
  genreIds.forEach(id => {
    if (mapping[id]) {
      result.add(mapping[id])
    }
  })
  if (result.size === 0) {
    result.add('Drama') // default fallback
  }
  return Array.from(result)
}

function detectUniverse(title: string): string | null {
  const lower = title.toLowerCase()
  if (lower.includes('marvel') || lower.includes('avengers') || lower.includes('iron man') || lower.includes('captain america') || lower.includes('thor') || lower.includes('guardians of the galaxy') || lower.includes('black panther') || lower.includes('doctor strange') || lower.includes('spider-man') || lower.includes('ant-man')) {
    return 'mcu'
  }
  if (lower.includes('batman') || lower.includes('superman') || lower.includes('wonder woman') || lower.includes('justice league') || lower.includes('aquaman') || lower.includes('shazam') || lower.includes('suicide squad') || lower.includes('joker')) {
    return 'dc'
  }
  if (lower.includes('baahubali')) {
    return 'baahubali'
  }
  if (lower.includes('one piece')) {
    return 'onepiece'
  }
  if (lower.includes('godzilla') || lower.includes('kong: skull island') || (lower.includes('king kong') && !lower.includes('1933'))) {
    return 'monsterverse'
  }
  if (lower.includes('kaithi') || lower.includes('vikram') || lower.includes('leo') || lower.includes('coolie')) {
    return 'lcu'
  }
  if (lower.includes('naruto') || lower.includes('boruto')) {
    return 'naruto'
  }
  return null
}

async function fetchFromTMDB(endpoint: string, params: Record<string, string>): Promise<any> {
  const queryStr = new URLSearchParams({ ...params, api_key: API_KEY }).toString()
  const url = `https://api.themoviedb.org/3/${endpoint}?${queryStr}`
  
  for (let i = 0; i < 5; i++) {
    try {
      const res = await fetch(url)
      if (res.status === 200) {
        return await res.json()
      }
      if (res.status === 429) {
        console.log(`Rate limited on TMDB. Waiting ${2000 * (i + 1)}ms...`)
        await sleep(2000 * (i + 1))
        continue
      }
      console.log(`Bad status ${res.status} from TMDB for: ${endpoint}`)
    } catch (e: any) {
      console.log(`Fetch error for ${endpoint}: ${e.message}`)
    }
    await sleep(1000)
  }
  return null
}

async function getDetails(id: number, isTV: boolean): Promise<any> {
  const endpoint = isTV ? `tv/${id}` : `movie/${id}`
  return fetchFromTMDB(endpoint, {})
}

interface DiscoverConfig {
  type: string
  isTV: boolean
  params: Record<string, string>
  limit: number
}

async function run() {
  console.log('🚀 Starting dynamic TMDB seed data generator...')
  
  const existingSlugs = new Set<string>()
  const curated = [
    ...movies,
    ...animes,
    ...series,
    ...kdramas,
    ...hollywood,
    ...cartoons,
  ]
  curated.forEach(item => existingSlugs.add(item.slug))
  console.log(`Loaded ${curated.length} hand-curated records.`)
  
  const discoveredItems: any[] = []
  
  const configs: DiscoverConfig[] = [
    {
      type: 'MOVIE',
      isTV: false,
      limit: 60,
      params: {
        discover: 'movie',
        with_original_language: 'te',
        sort_by: 'popularity.desc',
      }
    },
    {
      type: 'MOVIE',
      isTV: false,
      limit: 60,
      params: {
        discover: 'movie',
        with_original_language: 'hi',
        sort_by: 'popularity.desc',
      }
    },
    {
      type: 'MOVIE',
      isTV: false,
      limit: 60,
      params: {
        discover: 'movie',
        with_original_language: 'ta',
        sort_by: 'popularity.desc',
      }
    },
    {
      type: 'MOVIE',
      isTV: false,
      limit: 80,
      params: {
        discover: 'movie',
        with_original_language: 'en',
        region: 'US',
        sort_by: 'popularity.desc',
      }
    },
    {
      type: 'ANIME',
      isTV: true,
      limit: 60,
      params: {
        discover: 'tv',
        with_original_language: 'ja',
        with_genres: '16', // Animation
        sort_by: 'popularity.desc',
      }
    },
    {
      type: 'KDRAMA',
      isTV: true,
      limit: 60,
      params: {
        discover: 'tv',
        with_original_language: 'ko',
        sort_by: 'popularity.desc',
      }
    },
    {
      type: 'CARTOON',
      isTV: true,
      limit: 60,
      params: {
        discover: 'tv',
        with_original_language: 'en',
        with_genres: '16', // Animation
        sort_by: 'popularity.desc',
      }
    }
  ]
  
  for (const config of configs) {
    console.log(`\nDiscovering ${config.type} (isTV=${config.isTV}) with language ${config.params.with_original_language || 'en'}...`)
    let page = 1
    let count = 0
    
    while (count < config.limit && page <= 5) {
      const discoverEndpoint = config.isTV ? 'discover/tv' : 'discover/movie'
      const data = await fetchFromTMDB(discoverEndpoint, {
        ...config.params,
        page: page.toString()
      })
      
      if (!data || !data.results || data.results.length === 0) {
        break
      }
      
      for (const item of data.results) {
        if (count >= config.limit) break
        
        const titleEn = item.title || item.name
        const dateStr = item.release_date || item.first_air_date
        const year = dateStr ? new Date(dateStr).getFullYear() : 2024
        
        const slug = `${titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${year}`
        
        if (existingSlugs.has(slug)) {
          // Avoid duplicating curated items or previously added items
          continue
        }
        
        // Skip items without posters/backdrops to ensure high visual quality
        if (!item.poster_path || !item.backdrop_path) {
          continue
        }
        
        console.log(`  [Discovered] Fetching details for: "${titleEn}" (${year})`)
        const details = await getDetails(item.id, config.isTV)
        if (!details) continue
        
        const studio = details.production_companies?.[0]?.name || ''
        const runtime = config.isTV ? null : (details.runtime || 120)
        const totalEpisodes = config.isTV ? (details.number_of_episodes || 12) : null
        const totalSeasons = config.isTV ? (details.number_of_seasons || 1) : null
        const rating = item.vote_average || 7.0
        
        // Detect native language name
        let language = 'English'
        if (config.params.with_original_language === 'te') language = 'Telugu'
        else if (config.params.with_original_language === 'hi') language = 'Hindi'
        else if (config.params.with_original_language === 'ta') language = 'Tamil'
        else if (config.params.with_original_language === 'ja') language = 'Japanese'
        else if (config.params.with_original_language === 'ko') language = 'Korean'
        
        const country = details.origin_country?.[0] || (language === 'Japanese' ? 'Japan' : language === 'Korean' ? 'South Korea' : language === 'English' ? 'United States' : 'India')
        
        // Translate synopsis to Telugu
        console.log(`    Translating overview for: "${titleEn}"`)
        const teluguOverview = await translateToTelugu(item.overview)
        
        const contentItem = {
          slug,
          type: config.type,
          status: 'COMPLETED',
          poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
          banner: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
          title: {
            en: titleEn,
            te: titleEn // In dynamic feed, title en works as display. We can translate this as well or keep english title
          },
          description: {
            en: item.overview || `${titleEn} is a ${year} film.`,
            te: teluguOverview || `${titleEn} అనేది ${year} లో విడుదలైన చిత్రం.`
          },
          genres: mapGenres(item.genre_ids || []),
          year,
          runtime,
          totalEpisodes,
          totalSeasons,
          imdbRating: rating,
          studio,
          language,
          country,
          teluguDubAvail: config.type !== 'KDRAMA' && config.type !== 'ANIME' ? true : Math.random() > 0.5,
          teluguSubAvail: true,
          hindiDubAvail: Math.random() > 0.5,
          isTrending: false,
          isTopRated: rating >= 7.8,
          isFeatured: false,
          trendingScore: Math.round(item.popularity / 10),
          popularityScore: Math.round(item.popularity / 5),
          universe: detectUniverse(titleEn)
        }
        
        discoveredItems.push(contentItem)
        existingSlugs.add(slug)
        count++
        
        await sleep(200) // Delay to be polite to TMDB API and Translate API
      }
      
      page++
    }
  }
  
  console.log(`\nTotal newly discovered unique records: ${discoveredItems.length}`)
  console.log(`Combined total records: ${curated.length + discoveredItems.length}`)
  
  // Write to expanded_data.ts
  const outputPath = path.resolve('prisma/data/expanded_data.ts')
  const contentToWrite = `import { ContentType, ContentStatus } from '@prisma/client'

export const expandedContent: any[] = ${JSON.stringify(discoveredItems, null, 2)}
`
  
  fs.writeFileSync(outputPath, contentToWrite, 'utf8')
  console.log(`Successfully wrote ${discoveredItems.length} records to ${outputPath}`)
}

run()
