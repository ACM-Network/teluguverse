import { ContentType, ContentStatus } from '@prisma/client'

export const movies = [
  {
    slug: 'kalki-2898-ad',

    type: ContentType.MOVIE,

    status: ContentStatus.COMPLETED,

    poster: 'https://wallpaperaccess.com/full/13891674.jpg',

    banner: 'https://wallpapercave.com/wp/wp15542527.png',

    trailer: 'https://www.youtube.com/embed/y1-w1kUGuz8?si=q75G5H4jA8qsvgbc',

    title: {
      en: 'Kalki 2898 AD',
      te: 'కల్కి 2898 AD',
    },

    description: {
      en: 'In a dystopian future ruled by darkness, Bhairava becomes part of a legendary mission connected to Kalki, the final avatar destined to restore balance to the world.',

      te: 'భవిష్యత్తులో 2898 సంవత్సరంలో ప్రపంచం చీకటి అధికారాల పట్టులో ఉంది. కల్కి అవతారం రావాలని పురాణాలు చెప్తున్నాయి. భైరా అనే యోధుడు ఒక అద్భుతమైన ప్రయాణం చేస్తాడు.',
    },

    genres: ['Sci-Fi', 'Mythology', 'Action'],

    storyExplanation:
      'కల్కి 2898 AD కథ పురాణాలు మరియు భవిష్యత్తు సంయోగంతో నడుస్తుంది...',

    endingExplanation:
      'చివర్లో కల్కి అవతారం తీసుకుంటాడు మరియు చీకటి శక్తులకు వ్యతిరేకంగా పోరాటం మొదలవుతుంది...',

    funFacts: [
      'Production took over 3 years',
      'Budget was ₹600 crore',
      'Released in 7 languages simultaneously',
      'VFX team of 400+ artists worked for 2 years',
    ],

    year: 2024,

    runtime: 181,

    imdbRating: 6.8,

    studio: 'Vyjayanthi Movies',

    language: 'Telugu',

    country: 'India',

    ottPlatforms: ['AMAZON_PRIME'],

    teluguDubAvail: true,

    teluguSubAvail: true,

    hindiDubAvail: true,

    isFeatured: true,

    isTrending: true,

    isTopRated: false,

    trendingScore: 95.5,

    popularityScore: 98.2,
  },

  {
    slug: 'rrr',

    type: ContentType.MOVIE,

    status: ContentStatus.COMPLETED,

    poster:
      'https://m.media-amazon.com/images/M/MV5BNWMwODYyMjQtMTczMi00NTQ1LWFkYjItMGJhMWRkY2E3NDAyXkEyXkFqcGc@._V1_.jpg',

    banner: 'https://images5.alphacoders.com/131/1319750.jpeg',

    trailer: 'https://www.youtube.com/embed/NgBoMJy386M?si=04lfesWQ21lHrlju',

    title: {
      en: 'RRR',
      te: 'RRR',
    },

    description: {
      en: 'A fictional story about two legendary revolutionaries and their journey away from home before they started fighting for their country in 1920s.',

      te: 'బ్రిటీష్ పాలనలో ఇద్దరు వీరుల కథ. కోమారం భీమ్ మరియు అల్లూరి సీతారామరాజు అడవిలో నుంచి వచ్చిన విప్లవ శక్తులుగా బ్రిటీష్ సామ్రాజ్యానికి ఎదురు నిలుస్తారు.',
    },

    genres: ['Action', 'Drama', 'Historical'],

    year: 2022,

    runtime: 187,

    imdbRating: 8.0,

    studio: 'DVV Entertainment',

    language: 'Telugu',

    country: 'India',

    ottPlatforms: ['ZEE5'],

    teluguDubAvail: true,

    teluguSubAvail: true,

    hindiDubAvail: true,

    isTrending: true,

    isTopRated: true,

    trendingScore: 88.0,

    popularityScore: 95.0,
  },

  {
    slug: 'pushpa-the-rule',

    type: ContentType.MOVIE,

    status: ContentStatus.COMPLETED,

    poster: 'https://4kwallpapers.com/images/walls/thumbs_3t/17953.jpg',

    banner: 'https://4kwallpapers.com/images/walls/thumbs_3t/17953.jpg',

    trailer: 'https://www.youtube.com/embed/g3JUbgOHgdw',

    title: {
      en: 'Pushpa: The Rule',
      te: 'పుష్ప: ది రూల్',
    },

    description: {
      en: 'Pushpa Raj rises as a powerful smuggling king while his rivalry with SP Bhanwar Singh grows more intense. As power and revenge collide, Pushpa fights to protect his empire and reputation.',

      te: 'పుష్ప రాజ్ శక్తివంతమైన స్మగ్లింగ్ సామ్రాజ్యాధిపతిగా ఎదుగుతుండగా, ఎస్పీ భన్వర్ సింగ్‌తో అతని వైరం మరింత తీవ్రమవుతుంది. అధికారం మరియు ప్రతీకారం మధ్య తన సామ్రాజ్యాన్ని మరియు గౌరవాన్ని కాపాడుకునేందుకు పుష్ప పోరాడతాడు.',
    },

    genres: ['Action', 'Crime', 'Drama'],

    year: 2024,

    runtime: 200,

    imdbRating: 8.5,

    studio: 'Mythri Movie Makers',

    language: 'Telugu',

    country: 'India',

    ottPlatforms: ['NETFLIX'],

    teluguDubAvail: true,

    teluguSubAvail: true,

    hindiDubAvail: true,

    isFeatured: true,

    isTrending: true,

    isTopRated: false,

    trendingScore: 97.0,

    popularityScore: 99.0,
  },
]