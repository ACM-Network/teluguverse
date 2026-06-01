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

async function fetchWithRetry(url, retries = 5, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.status === 200) {
        return res;
      }
      if (res.status === 429) {
        const retryAfter = res.headers.get('Retry-After');
        const waitMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : delay * (i + 1) * 2;
        console.log(`  [TMDB] Rate limited. Waiting ${waitMs}ms...`);
        await sleep(waitMs);
        continue;
      }
      console.log(`  [TMDB] Bad status: ${res.status}. Retrying...`);
    } catch (e) {
      console.log(`  [TMDB] Error on try ${i+1}: ${e.message}`);
    }
    await sleep(delay * (i + 1));
  }
  return null;
}

function cleanTitle(title) {
  return title.replace(/’/g, "'").trim();
}

function splitCamelCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1 $2').trim();
}

async function searchTMDB(title, type, year) {
  const isTV = ['ANIME', 'SERIES', 'KDRAMA'].includes(type);
  const searchType = isTV ? 'tv' : 'movie';
  
  let queries = [];
  
  // Custom priority queries first
  if (title.toLowerCase() === 'hanuman') {
    queries.push('Hanu-Man');
    queries.push('Hanu Man');
    queries.push('HanuMan');
  } else {
    queries.push(cleanTitle(title));
    const spaced = splitCamelCase(title);
    if (spaced !== title) {
      queries.push(spaced);
    }
  }

  for (const query of queries) {
    const url = `https://api.themoviedb.org/3/search/${searchType}?query=${encodeURIComponent(query)}&api_key=${API_KEY}`;
    console.log(`  [TMDB] Searching for query: "${query}" (${searchType})`);
    
    const res = await fetchWithRetry(url);
    if (!res) continue;
    
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const match = findBestMatch(data.results, year);
      if (match && match.poster_path && match.backdrop_path) {
        return match;
      }
    }
    
    // Multi search fallback
    const multiUrl = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&api_key=${API_KEY}`;
    const multiRes = await fetchWithRetry(multiUrl);
    if (multiRes) {
      const multiData = await multiRes.json();
      if (multiData.results && multiData.results.length > 0) {
        const match = findBestMatch(multiData.results, year);
        if (match && match.poster_path && match.backdrop_path) {
          return match;
        }
      }
    }
  }
  
  return null;
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
  console.log('🚀 Starting Robust TMDB Image Matcher (HanuMan specific fix)...');
  
  for (const relPath of files) {
    const absPath = path.resolve(relPath);
    console.log(`\nProcessing file: ${relPath}`);
    let content = fs.readFileSync(absPath, 'utf8');
    
    const itemRegex = /slug:\s*['"]([^'"]+)['"]/g;
    let match;
    const slugs = [];
    while ((match = itemRegex.exec(content)) !== null) {
      slugs.push({ slug: match[1], index: match.index });
    }
    
    console.log(`Found ${slugs.length} titles in ${relPath}`);
    
    for (let i = slugs.length - 1; i >= 0; i--) {
      const current = slugs[i];
      const nextIndex = i < slugs.length - 1 ? slugs[i + 1].index : content.length;
      const block = content.substring(current.index, nextIndex);
      
      const titleMatch = block.match(/en:\s*['"]([^'"]+)['"]/);
      const typeMatch = block.match(/type:\s*ContentType\.([A-Z_]+)/);
      const yearMatch = block.match(/year:\s*(\d+)/);
      const posterMatch = block.match(/poster:\s*['"](https?:\/\/[^'"]+)['"]/);
      
      if (!titleMatch || !typeMatch) {
        continue;
      }
      
      const title = titleMatch[1];
      const type = typeMatch[1];
      const year = yearMatch ? parseInt(yearMatch[1], 10) : null;
      const currentPoster = posterMatch ? posterMatch[1] : '';
      
      const isPlaceholder = currentPoster.includes('78909Y') || 
                            currentPoster.includes('col456') || 
                            currentPoster.includes('56789Y') || 
                            currentPoster.includes('xU95ii') ||
                            currentPoster.includes('h1B7tW') ||
                            currentPoster.includes('fcKyEr') ||
                            currentPoster.includes('npdB6e');
                            
      if (!isPlaceholder && currentPoster !== '') {
        continue;
      }
      
      console.log(`🔍 [${i+1}/${slugs.length}] Resolving: "${title}" (${type}, ${year})`);
      const tmdbResult = await searchTMDB(title, type, year);
      
      if (tmdbResult) {
        const posterPath = tmdbResult.poster_path;
        const backdropPath = tmdbResult.backdrop_path;
        
        if (posterPath && backdropPath) {
          const newPoster = `https://image.tmdb.org/t/p/w500${posterPath}`;
          const newBanner = `https://image.tmdb.org/t/p/original${backdropPath}`;
          
          console.log(`  ✅ Match Found: "${tmdbResult.title || tmdbResult.name}"`);
          console.log(`    Poster: ${newPoster}`);
          console.log(`    Banner: ${newBanner}`);
          
          let updatedBlock = block;
          updatedBlock = updatedBlock.replace(/(poster:\s*['"])(https?:\/\/[^'"]+)(['"])/, `$1${newPoster}$3`);
          updatedBlock = updatedBlock.replace(/(banner:\s*['"])(https?:\/\/[^'"]+)(['"])/, `$1${newBanner}$3`);
          
          content = content.substring(0, current.index) + updatedBlock + content.substring(current.index + block.length);
        } else {
          console.log(`  ⚠️ TMDB result missing paths for: ${title}`);
        }
      } else {
        console.log(`  ❌ Failed to resolve TMDB details for: ${title}`);
      }
      
      await sleep(250);
    }
    
    fs.writeFileSync(absPath, content, 'utf8');
    console.log(`Saved changes to ${relPath}`);
  }
  
  console.log('\n🏁 Robust TMDB image update completed!');
}

run();
