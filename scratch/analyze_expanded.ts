import { expandedContent } from '../prisma/data/expanded_data'

console.log('--- Database Quality Audit ---');
console.log('Total entries in expandedContent:', expandedContent.length);

const duplicatedPosters: Record<string, number> = {};
const placeholderDescriptions: string[] = [];

expandedContent.forEach(item => {
  if (item.poster) {
    duplicatedPosters[item.poster] = (duplicatedPosters[item.poster] || 0) + 1;
  }
  if (item.description && item.description.en && item.description.en.includes('masterpiece in the Telugu film industry')) {
    placeholderDescriptions.push(item.slug);
  }
  if (item.description && item.description.en && item.description.en.includes('Lorem ipsum')) {
    placeholderDescriptions.push(item.slug);
  }
});

const duplicates = Object.entries(duplicatedPosters).filter(([url, count]) => count > 1);
console.log('Duplicated posters count:', duplicates.length);
console.log('Placeholder/generic descriptions count:', placeholderDescriptions.length);
if (duplicates.length > 0) {
  console.log('Duplicated posters:', duplicates);
} else {
  console.log('✅ ZERO DUPLICATE POSTERS IN GENERATED DATA!');
}
if (placeholderDescriptions.length > 0) {
  console.log('Placeholder items:', placeholderDescriptions);
} else {
  console.log('✅ ZERO PLACEHOLDER/GENERIC DESCRIPTIONS IN GENERATED DATA!');
}
