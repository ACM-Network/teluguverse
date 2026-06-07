async function test() {
  const query = `
    query ($search: String) {
      Page (page: 1, perPage: 1) {
        media (search: $search, type: ANIME) {
          id
          idMal
          title {
            romaji
            english
            native
          }
          description
          seasonYear
          episodes
          status
          genres
          averageScore
          countryOfOrigin
          studios(isMain: true) {
            nodes {
              name
            }
          }
        }
      }
    }
  `;
  
  const searchTitles = ["Obocchama-kun"];
  for (const t of searchTitles) {
    console.log(`\nSearching AniList for: "${t}"`);
    try {
      const res = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { search: t } })
      });
      const data = await res.json();
      console.log(JSON.stringify(data?.data?.Page?.media?.slice(0, 3), null, 2));
    } catch(e) {
      console.error(e);
    }
    
    console.log(`Searching TMDB for: "${t}"`);
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(t)}&api_key=4e44d9029b1270a757cddc766a1bcb63`);
      const data = await res.json();
      console.log(JSON.stringify(data?.results?.slice(0, 3).map(r => ({ id: r.id, name: r.name || r.title, media_type: r.media_type })), null, 2));
    } catch(e) {
      console.error(e);
    }
  }
}
test();
