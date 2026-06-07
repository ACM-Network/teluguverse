import { PrismaClient } from '@prisma/client';
import { movies } from '../prisma/data/movies.ts';
import { animes } from '../prisma/data/animes.ts';
import { series } from '../prisma/data/series.ts';
import { kdramas } from '../prisma/data/kdramas.ts';
import { hollywood } from '../prisma/data/hollywood.ts';
import { cartoons } from '../prisma/data/cartoons.ts';
import { expandedContent } from '../prisma/data/expanded_data.ts';

const prisma = new PrismaClient();

async function main() {
  const staticSlugs = new Set<string>([
    ...movies.map(m => m.slug),
    ...animes.map(a => a.slug),
    ...series.map(s => s.slug),
    ...kdramas.map(k => k.slug),
    ...hollywood.map(h => h.slug),
    ...cartoons.map(c => c.slug),
    ...expandedContent.map(e => e.slug),
  ]);

  console.log(`Loaded ${staticSlugs.size} unique slugs from static files.`);

  const dbRecords = await prisma.content.findMany({
    select: { id: true, slug: true, titleEnglish: true, type: true }
  });

  console.log(`Loaded ${dbRecords.length} records from database.`);

  const orphans = dbRecords.filter(r => !staticSlugs.has(r.slug));

  console.log(`Found ${orphans.length} orphan/stale records in database to delete.`);

  if (orphans.length === 0) {
    console.log("No records to delete.");
    return;
  }

  // Perform delete operation
  const orphanIds = orphans.map(r => r.id);
  const deleteResult = await prisma.content.deleteMany({
    where: {
      id: { in: orphanIds }
    }
  });

  console.log(`Successfully deleted ${deleteResult.count} orphaned/stale records (and cascaded related tables).`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
