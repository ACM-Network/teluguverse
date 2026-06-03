import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const contentCount = await prisma.content.count()
  const genreCount = await prisma.genre.count()
  const universeCount = await prisma.universe.count()
  const streamingLinkCount = await prisma.streamingLink.count()
  const directorCount = await prisma.director.count()
  
  console.log('Database Status:')
  console.log(`- Contents: ${contentCount}`)
  console.log(`- Genres: ${genreCount}`)
  console.log(`- Universes: ${universeCount}`)
  console.log(`- Streaming Links: ${streamingLinkCount}`)
  console.log(`- Directors: ${directorCount}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
