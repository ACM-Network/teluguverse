export interface ContentItem {
  id: string
  slug: string
  type: 'MOVIE' | 'ANIME' | 'SERIES' | 'KDRAMA' | 'CARTOON' | 'HOLLYWOOD' | 'DOCUMENTARY'
  status: 'ONGOING' | 'COMPLETED' | 'UPCOMING' | 'HIATUS' | 'CANCELLED'
  titleEnglish: string
  titleTelugu?: string | null
  titleOriginal?: string | null
  descriptionEnglish?: string | null
  descriptionTelugu?: string | null
  storyExplanation?: string | null
  endingExplanation?: string | null
  funFacts?: any
  poster?: string | null
  banner?: string | null
  trailer?: string | null
  screenshots: string[]
  year?: number | null
  releaseDate?: string | null
  runtime?: number | null
  totalEpisodes?: number | null
  totalSeasons?: number | null
  imdbRating?: number | null
  malRating?: number | null
  ageRating?: string | null
  studio?: string | null
  language: string
  country: string
  teluguDubAvail: boolean
  teluguSubAvail: boolean
  hindiDubAvail: boolean
  isFeatured: boolean
  isTrending: boolean
  isTopRated: boolean
  trendingScore: number
  popularityScore: number
  viewCount: number
  createdAt: string
  updatedAt: string
  genres?: { genre: { id: string; name: string; nameTe?: string | null; slug: string; color?: string | null } }[]
  streamingLinks?: StreamingLink[]
  directors?: Director[]
  cast?: CastMember[]
  characters?: Character[]
  seasons?: Season[]
  reviews?: Review[]
  _count?: { reviews: number; ratings: number; watchlist: number; favorites: number }
}

export interface StreamingLink {
  id: string
  platform: string
  url?: string | null
  isAvailable: boolean
  isTeluguDub: boolean
  isPremium: boolean
}

export interface Director { id: string; name: string; nameTe?: string | null; photo?: string | null }
export interface CastMember { id: string; name: string; nameTe?: string | null; role?: string | null; character?: string | null; photo?: string | null; isVoiceActor: boolean; order: number }
export interface Character { id: string; name: string; nameTe?: string | null; description?: string | null; photo?: string | null; voiceActor?: string | null; isMain: boolean }
export interface Season { id: string; number: number; title?: string | null; titleTe?: string | null; episodes?: number | null; episodeList?: Episode[] }
export interface Episode { id: string; number: number; title?: string | null; titleTe?: string | null; description?: string | null; runtime?: number | null; airDate?: string | null }
export interface Review { id: string; title?: string | null; body: string; rating?: number | null; language: string; likes: number; isApproved: boolean; createdAt: string; user: { id: string; username: string; displayName: string; avatar?: string | null } }
export interface User { id: string; email: string; username: string; displayName: string; avatar?: string | null; role: string }
export interface SearchResult { items: ContentItem[]; total: number; page: number; limit: number; totalPages: number }
