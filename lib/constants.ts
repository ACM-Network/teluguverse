export const SITE_NAME = 'TeluguVerse'
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
export const SITE_DESC = 'The ultimate Telugu entertainment database'

export const CONTENT_TYPES = ['MOVIE','ANIME','SERIES','KDRAMA','CARTOON','HOLLYWOOD','DOCUMENTARY'] as const
export const CONTENT_STATUSES = ['ONGOING','COMPLETED','UPCOMING','HIATUS','CANCELLED'] as const

export const OTT_PLATFORMS = {
  NETFLIX:      { label: 'Netflix',       color: '#E50914', bg: 'rgba(229,9,20,0.15)' },
  AMAZON_PRIME: { label: 'Prime Video',   color: '#00A8E0', bg: 'rgba(0,168,224,0.15)' },
  HOTSTAR:      { label: 'Hotstar',       color: '#1B74E4', bg: 'rgba(27,116,228,0.15)' },
  ZEE5:         { label: 'ZEE5',          color: '#7B2FBE', bg: 'rgba(123,47,190,0.15)' },
  SONY_LIV:     { label: 'SonyLIV',       color: '#00558B', bg: 'rgba(0,85,139,0.15)' },
  CRUNCHYROLL:  { label: 'Crunchyroll',   color: '#F47521', bg: 'rgba(244,117,33,0.15)' },
  VIKI:         { label: 'Viki',          color: '#1DA462', bg: 'rgba(29,164,98,0.15)' },
  FUNIMATION:   { label: 'Funimation',    color: '#410099', bg: 'rgba(65,0,153,0.15)' },
  MXPLAYER:     { label: 'MX Player',     color: '#00B4D8', bg: 'rgba(0,180,216,0.15)' },
  AHAN:         { label: 'Aha',           color: '#FF6B35', bg: 'rgba(255,107,53,0.15)' },
  VOOT:         { label: 'Voot',          color: '#FF5200', bg: 'rgba(255,82,0,0.15)' },
  OTHER:        { label: 'Other',         color: '#9CA3AF', bg: 'rgba(156,163,175,0.1)' },
}

export const TYPE_COLORS: Record<string, string> = {
  MOVIE:       '#E50914',
  ANIME:       '#a855f7',
  SERIES:      '#3b82f6',
  KDRAMA:      '#ec4899',
  CARTOON:     '#22c55e',
  HOLLYWOOD:   '#f59e0b',
  DOCUMENTARY: '#06b6d4',
}

export const TYPE_LABELS: Record<string, string> = {
  MOVIE:       'Movie',
  ANIME:       'Anime',
  SERIES:      'Series',
  KDRAMA:      'K-Drama',
  CARTOON:     'Cartoon',
  HOLLYWOOD:   'Hollywood',
  DOCUMENTARY: 'Documentary',
}

export const TYPE_EMOJIS: Record<string, string> = {
  MOVIE:       '🎬',
  ANIME:       '⚡',
  SERIES:      '📺',
  KDRAMA:      '🌸',
  CARTOON:     '🎭',
  HOLLYWOOD:   '🎪',
  DOCUMENTARY: '📽️',
}

export const SORT_OPTIONS = [
  { value: 'trending', label: 'Trending' },
  { value: 'rating',   label: 'Top Rated' },
  { value: 'newest',   label: 'Newest First' },
  { value: 'popular',  label: 'Most Popular' },
  { value: 'az',       label: 'A–Z' },
]

export const LANGUAGES = ['Telugu','Hindi','Tamil','Japanese','Korean','English','Malayalam','Kannada','Bengali','Marathi']

export const PAGINATION_LIMIT = 24
