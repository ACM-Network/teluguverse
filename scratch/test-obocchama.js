async function check() {
  const poster = 'https://image.tmdb.org/t/p/w500/gVF8wlxcsFJgxu98JZAevIEWz8c.jpg';
  const banner = 'https://image.tmdb.org/t/p/original/gUN71TW4sK9SZij4mHfHyyP81Rb.jpg';
  
  const res1 = await fetch(poster, { method: 'HEAD' });
  const res2 = await fetch(banner, { method: 'HEAD' });
  
  console.log('Poster status:', res1.status);
  console.log('Banner status:', res2.status);
}

check();
