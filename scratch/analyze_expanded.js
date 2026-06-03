import { expandedContent } from '../prisma/data/expanded_data.js';

console.log('Total entries in expandedContent:', expandedContent.length);

const duplicatedPosters = {};
const placeholderDescriptions = [];

expandedContent.forEach(item => {
  if (item.poster) {
    duplicatedPosters[item.poster] = (duplicatedPosters[item.poster] || 0) + 1;
  }
  if (item.description && item.description.en && item.description.en.includes('masterpiece in the Telugu film industry')) {
    placeholderDescriptions.push(item.slug);
  }
});

const duplicates = Object.entries(duplicatedPosters).filter(([url, count]) => count > 1);
console.log('Duplicated posters count:', duplicates.length);
console.log('Placeholder descriptions count:', placeholderDescriptions.length);
console.log('Sample duplicates:', duplicates.slice(0, 5));
