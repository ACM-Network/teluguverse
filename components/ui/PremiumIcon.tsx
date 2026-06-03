'use client'

import React from 'react'

interface PremiumIconProps {
  name: string
  size?: number
  className?: string
}

const ICON_COLORS: Record<string, string> = {
  popular: '#FF512F',
  trending: '#FF512F',
  fire: '#FF512F',
  anime: '#A855F7',
  lightning: '#A855F7',
  kdrama: '#EC4899',
  heart: '#EC4899',
  universe: '#00D2FF',
  globe: '#00D2FF',
  language: '#00D2FF',
  upcoming: '#F59E0B',
  calendar: '#F59E0B',
  ott: '#3B82F6',
  tv: '#3B82F6',
  movies: '#E50914',
  film: '#E50914',
  similar: '#FF512F',
  target: '#FF512F',
  cast: '#10B981',
  people: '#10B981',
  gallery: '#06B6D4',
  images: '#06B6D4',
  review: '#3B82F6',
  reviews: '#3B82F6',
  chat: '#3B82F6',
  rating: '#FFD700',
  star: '#FFD700',
  favorite: '#EF4444',
  info: '#00D2FF',
  trailer: '#F59E0B',
  play: '#F59E0B',
  watchlist: '#FFD700',
  list: '#FFD700',
  search: '#FFD700',
  ranking: '#FFD700',
  cartoon: '#22C55E',
  cartoons: '#22C55E',
  hollywood: '#F59E0B',
  series: '#3B82F6',
  documentary: '#06B6D4',
  genres: '#8B5CF6',
  clock: '#06B6D4',
  duration: '#06B6D4',
  user: '#3B82F6',
  profile: '#3B82F6',
  'arrow-right': '#FFD700',
  trash: '#EF4444',
  delete: '#EF4444',
  cross: '#EF4444',
  gear: '#9CA3AF',
  settings: '#9CA3AF',
  logout: '#EF4444',
  signout: '#EF4444',
}

export default function PremiumIcon({ name, size = 20, className = '' }: PremiumIconProps) {
  const n = name.toLowerCase().trim()
  const color = ICON_COLORS[n] || '#FFD700'

  const glowHexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b)
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex)
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '255, 215, 0'
  }

  const rgbVal = glowHexToRgb(color)

  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: '1.75',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    style: {
      color,
      filter: `drop-shadow(0 0 5px rgba(${rgbVal}, 0.45))`
    } as React.CSSProperties,
    className: `transition-all duration-300 ${className}`,
  }

  switch (n) {
    case 'popular':
    case 'trending':
    case 'fire':
      return (
        <svg {...props}>
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" strokeWidth="2" />
        </svg>
      )
    case 'anime':
    case 'lightning':
      return (
        <svg {...props}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" strokeWidth="2" />
        </svg>
      )
    case 'kdrama':
    case 'heart':
      return (
        <svg {...props}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="2" />
        </svg>
      )
    case 'universe':
    case 'globe':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
    case 'language':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
    case 'upcoming':
    case 'calendar':
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    case 'ott':
    case 'tv':
      return (
        <svg {...props}>
          <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
          <polyline points="17 2 12 7 7 2" />
        </svg>
      )
    case 'movies':
    case 'film':
      return (
        <svg {...props}>
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
          <line x1="7" y1="2" x2="7" y2="22" />
          <line x1="17" y1="2" x2="17" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="2" y1="7" x2="7" y2="7" />
          <line x1="2" y1="17" x2="7" y2="17" />
          <line x1="17" y1="17" x2="22" y2="17" />
          <line x1="17" y1="7" x2="22" y2="7" />
        </svg>
      )
    case 'similar':
    case 'target':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" fill={color} />
        </svg>
      )
    case 'cast':
    case 'people':
      return (
        <svg {...props}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    case 'gallery':
    case 'images':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" fill={color} />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      )
    case 'review':
    case 'reviews':
    case 'chat':
      return (
        <svg {...props}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    case 'rating':
    case 'star':
      return (
        <svg {...props}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
    case 'favorite':
      return (
        <svg {...props} fill={color}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      )
    case 'info':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      )
    case 'trailer':
    case 'play':
      return (
        <svg {...props}>
          <polygon points="5 3 19 12 5 21 5 3" fill={`${color}22`} />
        </svg>
      )
    case 'watchlist':
    case 'list':
      return (
        <svg {...props}>
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="3" />
          <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="3" />
          <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="3" />
        </svg>
      )
    case 'search':
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      )
    case 'ranking':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" />
          <path d="M8.2 12a14 14 0 0 1 .8-5h6a14 14 0 0 1 .8 5" />
        </svg>
      )
    case 'cartoon':
    case 'cartoons':
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="M9 5l-3-3M15 5l3-3" />
          <circle cx="8" cy="11" r="1.2" fill={color} />
          <circle cx="16" cy="11" r="1.2" fill={color} />
          <path d="M10 14.5c1 .5 3 .5 4 0" strokeWidth="1.5" />
        </svg>
      )
    case 'hollywood':
      return (
        <svg {...props}>
          <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9 12 2" />
          <circle cx="12" cy="11.5" r="2.5" stroke="#FFF" strokeWidth="1" />
        </svg>
      )
    case 'series':
      return (
        <svg {...props}>
          <rect x="2" y="7" width="16" height="13" rx="2" />
          <rect x="6" y="3" width="16" height="13" rx="2" opacity="0.4" />
          <polygon points="8 11 13 13.5 8 16" fill={color} />
        </svg>
      )
    case 'documentary':
      return (
        <svg {...props}>
          <rect x="2" y="6" width="12" height="12" rx="2" />
          <path d="M14 9l6-4v14l-6-4" strokeLinejoin="round" />
          <circle cx="6" cy="12" r="1.5" />
        </svg>
      )
    case 'genres':
      return (
        <svg {...props}>
          <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" rx="1" />
        </svg>
      )
    case 'clock':
    case 'duration':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    case 'user':
    case 'profile':
      return (
        <svg {...props}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    case 'arrow-right':
      return (
        <svg {...props}>
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      )
    case 'trash':
    case 'delete':
    case 'cross':
      return (
        <svg {...props}>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )
    case 'gear':
    case 'settings':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51-1z" />
        </svg>
      )
    case 'logout':
    case 'signout':
      return (
        <svg {...props}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      )
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      )
  }
}
