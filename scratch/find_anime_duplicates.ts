import { animes } from '../prisma/data/animes.ts';
import { expandedContent } from '../prisma/data/expanded_data.ts';

function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]/g, '');
}

console.log(`Loaded ${animes.length} animes from animes.ts`);
console.log(`Loaded ${expandedContent.length} items from expanded_data.ts`);

const animeMap = new Map<string, any[]>();
animes.forEach((anime: any, index) => {
  const norm = normalizeTitle(anime.title?.en || '');
  if (!animeMap.has(norm)) {
    animeMap.set(norm, []);
  }
  animeMap.get(norm)!.push({ index, slug: anime.slug, source: 'animes.ts', title: anime.title?.en });
});

expandedContent.forEach((item: any, index) => {
  if (item.type !== 'ANIME') return;
  const norm = normalizeTitle(item.title?.en || '');
  if (!animeMap.has(norm)) {
    animeMap.set(norm, []);
  }
  animeMap.get(norm)!.push({ index, slug: item.slug, source: 'expanded_data.ts', title: item.title?.en });
});

let duplicatesCount = 0;
for (const [norm, list] of animeMap.entries()) {
  if (list.length > 1) {
    console.log(`Duplicate found for "${norm}":`);
    list.forEach(item => {
      console.log(`  - [${item.source}] at index ${item.index}: slug="${item.slug}", title="${item.title}"`);
    });
    duplicatesCount++;
  }
}
console.log(`Total duplicate groups: ${duplicatesCount}`);
