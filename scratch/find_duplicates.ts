import { movies } from '../prisma/data/movies.ts'
import { animes } from '../prisma/data/animes.ts'
import { series } from '../prisma/data/series.ts'
import { kdramas } from '../prisma/data/kdramas.ts'
import { hollywood } from '../prisma/data/hollywood.ts'
import { cartoons } from '../prisma/data/cartoons.ts'
import { expandedContent } from '../prisma/data/expanded_data.ts'

const curated = [
  ...movies,
  ...animes,
  ...series,
  ...kdramas,
  ...hollywood,
  ...cartoons
]

const duplicates: any[] = []
for (const item of expandedContent) {
  // Check if title (en), poster, or banner matches any curated item
  const match = curated.find(c => {
    const cTitle = (c.title?.en || c.titleEnglish || '').toLowerCase().trim()
    const itemTitle = (item.title?.en || item.titleEnglish || '').toLowerCase().trim()
    
    return (
      c.slug === item.slug ||
      (cTitle === itemTitle && cTitle !== '') ||
      (c.poster && c.poster === item.poster) ||
      (c.banner && c.banner === item.banner)
    )
  })

  if (match) {
    duplicates.push({
      expandedSlug: item.slug,
      curatedSlug: match.slug,
      title: item.title?.en || item.titleEnglish,
      reason: match.slug === item.slug ? 'slug' : match.poster === item.poster ? 'poster' : 'title'
    })
  }
}

console.log(`Found ${duplicates.length} duplicate entries in expanded_data.ts:`)
console.log(JSON.stringify(duplicates, null, 2))
