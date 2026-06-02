import { movies } from '../prisma/data/movies'
import { animes } from '../prisma/data/animes'
import { series } from '../prisma/data/series'
import { kdramas } from '../prisma/data/kdramas'
import { hollywood } from '../prisma/data/hollywood'
import { cartoons } from '../prisma/data/cartoons'

const allContent = [
  { name: 'Movies', data: movies },
  { name: 'Animes', data: animes },
  { name: 'Series', data: series },
  { name: 'Kdramas', data: kdramas },
  { name: 'Hollywood', data: hollywood },
  { name: 'Cartoons', data: cartoons },
]

for (const group of allContent) {
  console.log(`\n=== ${group.name} ===`);
  for (const item of group.data) {
    const ott = item.ottPlatforms ? item.ottPlatforms.map((o: any) => typeof o === 'string' ? o : o.platform) : [];
    console.log(`- ${item.slug} (${item.year}): ${ott.join(', ') || 'NONE'} [Dub: ${item.teluguDubAvail}]`);
  }
}
