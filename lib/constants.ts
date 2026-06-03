export const SITE_NAME = 'TeluguVerse'
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
export const SITE_DESC = 'The ultimate Telugu entertainment database'

export const CONTENT_TYPES = ['MOVIE','ANIME','SERIES','KDRAMA','CARTOON','HOLLYWOOD','DOCUMENTARY'] as const
export const CONTENT_STATUSES = ['ONGOING','COMPLETED','UPCOMING','HIATUS','CANCELLED'] as const

export const OTT_PLATFORMS: Record<string, { label: string; color: string; bg: string }> = {
  NETFLIX:       { label: 'Netflix',        color: '#E50914', bg: 'rgba(229,9,20,0.15)' },
  AMAZON_PRIME:  { label: 'Prime Video',    color: '#00A8E0', bg: 'rgba(0,168,224,0.15)' },
  JIO_HOTSTAR:   { label: 'JioHotstar',     color: '#00D2FF', bg: 'rgba(0,210,255,0.15)' },
  HOTSTAR:       { label: 'JioHotstar',     color: '#00D2FF', bg: 'rgba(0,210,255,0.15)' },
  ZEE5:          { label: 'ZEE5',           color: '#7B2FBE', bg: 'rgba(123,47,190,0.15)' },
  SONY_LIV:      { label: 'SonyLIV',        color: '#00558B', bg: 'rgba(0,85,139,0.15)' },
  AHA:           { label: 'Aha',            color: '#FF5000', bg: 'rgba(255,80,0,0.15)' },
  SUN_NXT:       { label: 'Sun NXT',        color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
  ETV_WIN:       { label: 'ETV Win',        color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
  CRUNCHYROLL:   { label: 'Crunchyroll',    color: '#F47521', bg: 'rgba(244,117,33,0.15)' },
  ANIME_TIMES:   { label: 'Anime Times',    color: '#EC4899', bg: 'rgba(236,72,153,0.15)' },
  MUSE_INDIA_YT: { label: 'Muse India',     color: '#FF0000', bg: 'rgba(255,0,0,0.15)' },
  YOUTUBE:       { label: 'YouTube',         color: '#FF0000', bg: 'rgba(255,0,0,0.15)' },
  VIKI:          { label: 'Viki',           color: '#1DA462', bg: 'rgba(29,164,98,0.15)' },
  FUNIMATION:    { label: 'Funimation',     color: '#410099', bg: 'rgba(65,0,153,0.15)' },
  MXPLAYER:      { label: 'MX Player',      color: '#00B4D8', bg: 'rgba(0,180,216,0.15)' },
  VOOT:          { label: 'Voot',           color: '#FF5200', bg: 'rgba(255,82,0,0.15)' },
  OTHER:         { label: 'Other',          color: '#9CA3AF', bg: 'rgba(156,163,175,0.1)' },
}

export const TV_PLATFORMS: Record<string, { label: string; color: string }> = {
  DISNEY_CHANNEL:   { label: 'Disney Channel',   color: '#0096FE' },
  HUNGAMA_TV:       { label: 'Hungama TV',        color: '#FF4F00' },
  CARTOON_NETWORK:  { label: 'Cartoon Network',   color: '#FDFDFD' },
  POGO:             { label: 'Pogo',              color: '#FF1493' },
  SONIC:            { label: 'Sonic',             color: '#E11D48' },
  NICK:             { label: 'Nick',              color: '#FF7F00' },
  SONY_YAY:         { label: 'Sony YAY!',         color: '#84CC16' },
  ETV_BAL_BHARAT:   { label: 'ETV Bal Bharat',    color: '#EAB308' },
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

export const TYPE_ICONS: Record<string, string> = {
  MOVIE:       'movies',
  ANIME:       'anime',
  SERIES:      'series',
  KDRAMA:      'kdrama',
  CARTOON:     'cartoon',
  HOLLYWOOD:   'hollywood',
  DOCUMENTARY: 'documentary',
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
