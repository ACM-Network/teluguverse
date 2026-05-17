import { ContentType, ContentStatus } from '@prisma/client'

export const animes = [
  {
    slug: 'attack-on-titan',

    type: ContentType.ANIME,

    status: ContentStatus.COMPLETED,

    poster: 'https://m.media-amazon.com/images/I/61t9ie31jgL._AC_UF894,1000_QL80_.jpg',

    banner: 'https://wallpapercave.com/wp/wp8115145.png',

    trailer: 'https://www.youtube.com/embed/g4KsydBnM7s?si=L1GLkHXvXlWxaWCO',

    title: {
      en: 'Attack on Titan',
      te: 'అటాక్ ఆన్ టైటన్',
    },

    titleOriginal: 'Shingeki no Kyojin',

    description: {
      en: 'After his hometown is destroyed and his mother is killed, Eren Yeager vows to destroy the Titans that pushed humanity to the edge of extinction.',

      te: 'తన ఊరు నాశనం కావడం మరియు తల్లి మరణించిన తర్వాత, ఎరెన్ యేగర్ మానవజాతిని వినాశన అంచుకు తీసుకెళ్లిన టైటన్‌లను నాశనం చేయాలని నిర్ణయించుకుంటాడు.',
    },

    genres: ['Action', 'Dark Fantasy', 'Post-Apocalyptic'],

    year: 2013,

    totalEpisodes: 94,

    totalSeasons: 4,

    imdbRating: 9.0,

    malRating: 9.1,

    studio: 'MAPPA / Wit Studio',

    language: 'Japanese',

    country: 'Japan',

    teluguDubAvail: true,

    teluguSubAvail: true,

    hindiDubAvail: true,

    isTrending: true,

    isTopRated: true,

    trendingScore: 92.0,

    popularityScore: 97.5,
  },

  {
    slug: 'demon-slayer',

    type: ContentType.ANIME,

    status: ContentStatus.ONGOING,

    poster: 'https://wallpaperaccess.com/full/5627712.jpg',

    banner: 'https://4kwallpapers.com/images/walls/thumbs_3t/22988.jpg',

    trailer: 'https://www.youtube.com/embed/VQGCKyvzIM4?si=oAklj34tytvIqvA7',

    title: {
      en: 'Demon Slayer',
      te: 'డీమన్ స్లేయర్',
    },

    titleOriginal: 'Kimetsu no Yaiba',

    description: {
      en: 'After demons slaughter his family, Tanjiro Kamado becomes a demon slayer to save his sister Nezuko and take revenge.',

      te: 'రాక్షసులు తన కుటుంబాన్ని చంపిన తర్వాత, తన చెల్లెలు నెజుకోను కాపాడేందుకు మరియు ప్రతీకారం తీర్చుకునేందుకు టాంజిరో డీమన్ స్లేయర్‌గా మారుతాడు.',
    },

    genres: ['Action', 'Fantasy', 'Adventure'],

    year: 2019,

    totalEpisodes: 55,

    totalSeasons: 4,

    imdbRating: 8.7,

    malRating: 8.6,

    studio: 'ufotable',

    language: 'Japanese',

    ottPlatforms: ['CRUNCHYROLL'],

    country: 'Japan',

    teluguDubAvail: true,

    teluguSubAvail: true,

    hindiDubAvail: true,

    isTrending: true,

    isTopRated: true,

    trendingScore: 90.0,

    popularityScore: 96.0,
  },

  {
    slug: 'frieren-beyond-journeys-end',

    type: ContentType.ANIME,

    status: ContentStatus.ONGOING,

    poster: 'https://image.tmdb.org/t/p/original/lI41MVzYGVSfmMyr0vE1sZyTRlM.jpg',

    banner: 'https://4kwallpapers.com/images/walls/thumbs_3t/24799.jpg',

    trailer: 'https://www.youtube.com/embed/de00ETIRe3U?si=H6DuUHrOsJD02HbI',

    title: {
      en: 'Frieren: Beyond Journey’s End',
      te: 'ఫ్రిరెన్: బియాండ్ జర్నీస్ ఎండ్',
    },

    description: {
      en: 'After defeating the Demon King, the elf mage Frieren begins a new journey to understand human emotions and the meaning of life.',

      te: 'డీమన్ కింగ్‌ను ఓడించిన తర్వాత, ఎల్ఫ్ మేజ్ ఫ్రిరెన్ మానవ భావోద్వేగాలు మరియు జీవిత అర్థాన్ని తెలుసుకునేందుకు కొత్త ప్రయాణం ప్రారంభిస్తుంది.',
    },

    genres: ['Fantasy', 'Drama', 'Adventure'],

    storyExplanation:
      'ఫ్రిరెన్ తన పాత సహచరుల జ్ఞాపకాలతో కొత్త ప్రయాణాన్ని కొనసాగిస్తుంది...',

    endingExplanation: 'కథ ఇంకా కొనసాగుతోంది...',

    funFacts: [
      'Animated by Madhouse',
      'One of the highest rated anime on IMDb and MAL',
      'Season 2 began airing in 2026',
    ],

    year: 2023,

    totalEpisodes: 28,

    totalSeasons: 2,

    imdbRating: 8.9,

    studio: 'Madhouse',

    language: 'Japanese',

    country: 'Japan',

    ottPlatforms: ['CRUNCHYROLL'],

    teluguSubAvail: true,

    hindiDubAvail: false,

    isFeatured: true,

    isTrending: true,

    isTopRated: true,

    trendingScore: 98.8,

    popularityScore: 99.0,
  },

  {
    slug: 'jujutsu-kaisen',

    type: ContentType.ANIME,

    status: ContentStatus.ONGOING,

    poster: 'https://i.pinimg.com/736x/c5/5a/85/c55a85aef4143eb20e4a5b1db4b62e70.jpg',

    banner: 'https://4kwallpapers.com/images/walls/thumbs_3t/19746.jpg',

    trailer: 'https://www.youtube.com/embed/JQith4sV4Qs?si=xJL8ehtfYuzIUy9O',

    title: {
      en: 'Jujutsu Kaisen',
      te: 'జుజుట్సు కైసెన్',
    },

    description: {
      en: 'Yuji Itadori enters the dangerous world of curses and sorcerers after becoming the host of the powerful curse Sukuna.',

      te: 'శక్తివంతమైన శాపం సుకునాకు హోస్ట్ అయిన తర్వాత, యూజి ఇటడోరి మాంత్రికులు మరియు శాపాల ప్రమాదకర ప్రపంచంలోకి ప్రవేశిస్తాడు.',
    },

    genres: ['Action', 'Supernatural', 'Dark Fantasy'],

    storyExplanation:
      'సుకునా అనే శాపంతో యూజి జీవితం పూర్తిగా మారిపోతుంది...',

    endingExplanation: 'కథ ఇంకా కొనసాగుతోంది...',

    funFacts: [
      'Animated by MAPPA',
      'Shibuya Incident arc became hugely popular',
      'IMDb rating crossed 8.5',
    ],

    year: 2020,

    totalEpisodes: 47,

    totalSeasons: 3,

    imdbRating: 8.5,

    runtime: 24,

    studio: 'MAPPA',

    language: 'Japanese',

    country: 'Japan',

    ottPlatforms: ['CRUNCHYROLL'],

    teluguSubAvail: true,

    hindiDubAvail: true,

    isFeatured: true,

    isTrending: true,

    isTopRated: true,

    trendingScore: 97.5,

    popularityScore: 98.3,
  },
]