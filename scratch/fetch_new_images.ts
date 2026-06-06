import fs from 'fs'

const API_KEY = '4e44d9029b1270a757cddc766a1bcb63';

async function getImages(id: number) {
  const url = `https://api.themoviedb.org/3/movie/${id}/images?api_key=${API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (e: any) {
    console.error(`Error for ID ${id}:`, e.message);
    return null;
  }
}

async function getTvImages(id: number) {
  const url = `https://api.themoviedb.org/3/tv/${id}/images?api_key=${API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (e: any) {
    console.error(`Error for TV ID ${id}:`, e.message);
    return null;
  }
}

async function searchTv(query: string) {
  const url = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(query)}&api_key=${API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.results;
  } catch (e: any) {
    console.error(`Error searching ${query}:`, e.message);
    return [];
  }
}

async function run() {
  console.log("Fetching alternate backdrops for Kalki, Vikram, Kaithi...")
  const kalki = await getImages(801688);
  const vikram = await getImages(724395);
  const kaithi = await getImages(633908);
  
  console.log("--- KALKI BACKDROPS ---")
  kalki?.backdrops?.slice(0, 8).forEach((b: any, index: number) => {
    console.log(`  ${index}: ${b.file_path}`)
  })

  console.log("--- VIKRAM BACKDROPS ---")
  vikram?.backdrops?.slice(0, 8).forEach((b: any, index: number) => {
    console.log(`  ${index}: ${b.file_path}`)
  })

  console.log("--- KAITHI BACKDROPS ---")
  kaithi?.backdrops?.slice(0, 8).forEach((b: any, index: number) => {
    console.log(`  ${index}: ${b.file_path}`)
  })

  console.log("--- POKEMON TV SHOWS ---")
  const pokemonResults = await searchTv("Pokemon");
  for (const show of pokemonResults.slice(0, 6)) {
    console.log(`Show: ${show.name} (ID: ${show.id})`)
    console.log(`  Poster: ${show.poster_path}`)
    console.log(`  Backdrop: ${show.backdrop_path}`)
  }
}

run();
