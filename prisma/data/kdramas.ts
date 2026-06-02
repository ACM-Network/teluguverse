import { ContentType, ContentStatus } from '@prisma/client'

export const kdramas = [
  {
    slug: 'true-beauty',
    type: ContentType.KDRAMA,
    status: ContentStatus.COMPLETED,
    poster: 'https://image.tmdb.org/t/p/w500/iUF647sSCbKeJ5Q6eHVujWTQmtg.jpg',
    banner: 'https://image.tmdb.org/t/p/original/3E1GroTJCRdIYHa5n62GqjmqxQR.jpg',
    trailer: 'https://www.youtube.com/embed/hJvR3bF0p3E',
    title: {
      en: 'True Beauty',
      te: 'ట్రూ బ్యూటీ',
    },
    description: {
      en: 'A high school girl who is bullied for her looks masters the art of makeup, transforming herself into a gorgeous girl at her new school.',
      te: 'తన రూపం వల్ల అందరి చేత ఈసడించుకోబడ్డ అమ్మాయి మేకప్ శక్తులతో తనను తాను మార్చుకుని కొత్త హైస్కూల్ లో ఒక అందమైన అమ్మాయిగా ఎలా బ్రతికిందనే కథ.',
    },
    genres: ['Romance', 'Comedy', 'Drama'],
    year: 2020,
    totalEpisodes: 16,
    totalSeasons: 1,
    imdbRating: 8.0,
    studio: 'Studio Dragon',
    language: 'Korean',
    country: 'South Korea',
    ottPlatforms: [
      { platform: 'NETFLIX', url: 'https://www.netflix.com/title/81410860' }
    ],
    teluguDubAvail: true,
    teluguSubAvail: true,
    hindiDubAvail: true,
    isTrending: true,
    isTopRated: false,
    trendingScore: 84.0,
    popularityScore: 91.0,
    similarSlugs: ['all-of-us-are-dead']
  },
  {
    slug: 'all-of-us-are-dead',
    type: ContentType.KDRAMA,
    status: ContentStatus.ONGOING,
    poster: 'https://image.tmdb.org/t/p/w500/pTEFqAjLd5YTsMD6NSUxV6Dq7A6.jpg',
    banner: 'https://image.tmdb.org/t/p/original/8hp2CuGnw1iP5dLBVMAPUv23swx.jpg',
    trailer: 'https://www.youtube.com/embed/IN5TDpDMJIY',
    title: {
      en: 'All of Us Are Dead',
      te: 'ఆల్ ఆఫ్ అస్ ఆర్ డెడ్',
    },
    description: {
      en: 'A high school becomes ground zero for a zombie virus outbreak. Trapped students must fight their way out or turn into one of the rabid infected.',
      te: 'ఒక హైస్కూల్ లో ల్యాబ్ ప్రయోగం తలకిందులై ఒక భయంకరమైన జోంబీ వైరస్ వ్యాపిస్తుంది. బ్రతికి ఉన్న కొద్దిమంది విద్యార్థులు ఎలా ప్రాణాలు కాపాడుకున్నారనే కథ.',
    },
    genres: ['Horror', 'Action', 'Thriller', 'Supernatural'],
    year: 2022,
    totalEpisodes: 12,
    totalSeasons: 1,
    imdbRating: 7.5,
    studio: 'Film Monster',
    language: 'Korean',
    country: 'South Korea',
    ottPlatforms: [
      { platform: 'NETFLIX', url: 'https://www.netflix.com/title/81235996' }
    ],
    teluguDubAvail: true,
    teluguSubAvail: true,
    hindiDubAvail: true,
    isTrending: true,
    isTopRated: false,
    trendingScore: 90.0,
    popularityScore: 94.0,
    similarSlugs: ['true-beauty']
  }
]
