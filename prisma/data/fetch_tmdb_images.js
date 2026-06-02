const fs = require('fs');
const path = require('path');

const API_KEY = '4e44d9029b1270a757cddc766a1bcb63';

const files = [
  'prisma/data/animes.ts',
  'prisma/data/movies.ts',
  'prisma/data/series.ts',
  'prisma/data/kdramas.ts',
  'prisma/data/hollywood.ts'
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function cleanTitle(title) {
  return title.replace(/’/g, "'").trim();
}

async function searchTMDB(title, type, year) {
  const isTV = ['ANIME', 'SERIES', 'KDRAMA'].includes(type);
  const searchType = isTV ? 'tv' : 'movie';
  const url = `https://api.themoviedb.org/3/search/${searchType}?query=${encodeURIComponent(cleanTitle(title))}&api_key=${API_KEY}`;
  
  try {
    const res = await fetch(url);
    if (res.status !== 200) {
      console.log(`  [TMDB] Error response for "${title}": Status ${res.status}`);
      return null;
    }
    const data = await res.json();
    if (!data.results || data.results.length === 0) {
      // Try multi search fallback
      const multiUrl = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(cleanTitle(title))}&api_key=${API_KEY}`;
      const multiRes = await fetch(multiUrl);
      if (multiRes.status === 200) {
        const multiData = await multiRes.json();
        if (multiData.results && multiData.results.length > 0) {
          return findBestMatch(multiData.results, year);
        }
      }
      return null;
    }
    return findBestMatch(data.results, year);
  } catch (e) {
    console.log(`  [TMDB] Fetch error for "${title}": ${e.message}`);
    return null;
  }
}

function findBestMatch(results, expectedYear) {
  if (expectedYear) {
    const exactMatch = results.find(r => {
      const dateStr = r.release_date || r.first_air_date;
      if (!dateStr) return false;
      const year = new Date(dateStr).getFullYear();
      return Math.abs(year - expectedYear) <= 1;
    });
    if (exactMatch) return exactMatch;
  }
  return results[0];
}

async function run() {
  console.log('🚀 Starting TMDB Image Matcher (Bug-free index version)...');
  
  for (const relPath of files) {
    const absPath = path.resolve(relPath);
    console.log(`\nProcessing file: ${relPath}`);
    let content = fs.readFileSync(absPath, 'utf8');
    
    // Find all item start indexes (by matching slug)
    const itemRegex = /slug:\s*['"]([^'"]+)['"]/g;
    let match;
    const slugs = [];
    while ((match = itemRegex.exec(content)) !== null) {
      slugs.push({ slug: match[1], index: match.index });
    }
    
    console.log(`Found ${slugs.length} titles in ${relPath}`);
    
    // Loop backwards so that editing content doesn't shift the indexes of the remaining items to process
    for (let i = slugs.length - 1; i >= 0; i--) {
      const current = slugs[i];
      const nextIndex = i < slugs.length - 1 ? slugs[i + 1].index : content.length;
      const block = content.substring(current.index, nextIndex);
      
      const titleMatch = block.match(/en:\s*['"]([^'"]+)['"]/);
      const typeMatch = block.match(/type:\s*ContentType\.([A-Z_]+)/);
      const yearMatch = block.match(/year:\s*(\d+)/);
      
      if (!titleMatch || !typeMatch) {
        console.log(`  ⚠️ Could not parse title/type for slug: ${current.slug}`);
        continue;
      }
      
      const title = titleMatch[1];
      const type = typeMatch[1];
      const year = yearMatch ? parseInt(yearMatch[1], 10) : null;
      
      console.log(`🔍 [${i+1}/${slugs.length}] Searching: "${title}" (${type}, ${year})`);
      const tmdbResult = await searchTMDB(title, type, year);
      
      if (tmdbResult) {
        const posterPath = tmdbResult.poster_path;
        const backdropPath = tmdbResult.backdrop_path;
        
        if (posterPath && backdropPath) {
          const newPoster = `https://image.tmdb.org/t/p/w500${posterPath}`;
          const newBanner = `https://image.tmdb.org/t/p/original${backdropPath}`;
          
          console.log(`  ✅ Match: "${tmdbResult.title || tmdbResult.name}"`);
          console.log(`    Poster: ${newPoster}`);
          console.log(`    Banner: ${newBanner}`);
          
          let updatedBlock = block;
          updatedBlock = updatedBlock.replace(/(poster:\s*['"])([^'"]*)(['"])/, `$1${newPoster}$3`);
          updatedBlock = updatedBlock.replace(/(banner:\s*['"])([^'"]*)(['"])/, `$1${newBanner}$3`);
          
          content = content.substring(0, current.index) + updatedBlock + content.substring(current.index + block.length);
        } else {
          console.log(`  ⚠️ Missing poster/backdrop path on TMDB for: ${title}`);
        }
      } else {
        console.log(`  ❌ No TMDB result found for: ${title}`);
      }
      
      await sleep(150);
    }
    
    fs.writeFileSync(absPath, content, 'utf8');
    console.log(`Saved changes to ${relPath}`);
  }
  
  console.log('\n🏁 TMDB image update completed!');
}

run();
