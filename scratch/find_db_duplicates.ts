import { PrismaClient, ContentType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const animes = await prisma.content.findMany({
    where: { type: ContentType.ANIME }
  });

  console.log(`Loaded ${animes.length} animes from database.`);

  const byTitle = new Map<string, any[]>();
  const bySlug = new Map<string, any[]>();
  
  animes.forEach(anime => {
    const title = (anime.titleEnglish || '').toLowerCase().trim();
    if (!byTitle.has(title)) {
      byTitle.set(title, []);
    }
    byTitle.get(title)!.push(anime);

    const slug = anime.slug;
    if (!bySlug.has(slug)) {
      bySlug.set(slug, []);
    }
    bySlug.get(slug)!.push(anime);
  });

  console.log('\n--- Duplicate titles in DB ---');
  let dupTitleCount = 0;
  for (const [title, list] of byTitle.entries()) {
    if (list.length > 1) {
      console.log(`Title "${title}":`);
      list.forEach(a => console.log(`  - ID: ${a.id}, Slug: ${a.slug}, Year: ${a.year}`));
      dupTitleCount++;
    }
  }

  console.log('\n--- Duplicate slugs in DB ---');
  let dupSlugCount = 0;
  for (const [slug, list] of bySlug.entries()) {
    if (list.length > 1) {
      console.log(`Slug "${slug}":`);
      list.forEach(a => console.log(`  - ID: ${a.id}, Title: ${a.titleEnglish}, Year: ${a.year}`));
      dupSlugCount++;
    }
  }

  console.log(`\nDuplicate groups by Title: ${dupTitleCount}`);
  console.log(`Duplicate groups by Slug: ${dupSlugCount}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
