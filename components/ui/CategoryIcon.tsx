'use client'

import React from 'react'

interface CategoryIconProps {
  name: string
  className?: string
  size?: number
}

const CATEGORY_COLORS: Record<string, string> = {
  movies: '#E50914',
  anime: '#A855F7',
  kdramas: '#EC4899',
  webseries: '#3B82F6',
  cartoons: '#22C55E',
  hollywood: '#F59E0B',
  ottoriginals: '#06B6D4',
  awardwinners: '#FFD700',
}

export default function CategoryIcon({ name, className = '', size = 36 }: CategoryIconProps) {
  const normName = name.toLowerCase().replace(/[^a-z]/g, '')
  const color = CATEGORY_COLORS[normName] || '#FFD700'

  const svgProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.5',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    style: { color },
    className: `transition-all duration-300 drop-shadow-[0_0_8px_rgba(var(--icon-glow),0.4)] ${className}`,
  }

  // Set local inline variables for custom drop shadows
  const glowHexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b)
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex)
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '255, 215, 0'
  }

  const rgbVal = glowHexToRgb(color)

  switch (normName) {
    case 'movies': // Film strip / Cinema reel
      return (
        <svg {...svgProps} style={{ ...svgProps.style, '--icon-glow': rgbVal } as any}>
          {/* Reel circle */}
          <circle cx="12" cy="12" r="7" stroke={color} strokeWidth="1.75" />
          <circle cx="12" cy="12" r="2" fill={color} />
          {/* Inner sprocket circles */}
          <circle cx="12" cy="8" r="1" fill="#FFF" opacity="0.8" />
          <circle cx="12" cy="16" r="1" fill="#FFF" opacity="0.8" />
          <circle cx="8" cy="12" r="1" fill="#FFF" opacity="0.8" />
          <circle cx="16" cy="12" r="1" fill="#FFF" opacity="0.8" />
          {/* Projection beams or outer film strip handles */}
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke={color} strokeWidth="2" />
          <path d="M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2 2" stroke={color} strokeWidth="1.5" />
        </svg>
      )

    case 'anime': // Stylized anime energy star / shuriken
      return (
        <svg {...svgProps} style={{ ...svgProps.style, '--icon-glow': rgbVal } as any}>
          {/* Energy spark */}
          <path
            d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z"
            fill={`${color}15`}
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="miter"
          />
          {/* Inner core */}
          <circle cx="12" cy="12" r="3" fill="#FFF" />
          {/* Action speed lines */}
          <path d="M12 7V4M12 17v3M7 12H4M17 12h3" stroke="#FFF" strokeWidth="1" opacity="0.6" />
        </svg>
      )

    case 'kdramas': // Heart shape intertwined with play button
      return (
        <svg {...svgProps} style={{ ...svgProps.style, '--icon-glow': rgbVal } as any}>
          {/* Finger-heart or standard romantic digital heart */}
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill={`${color}12`}
            stroke={color}
            strokeWidth="1.75"
          />
          {/* Play triangle inside */}
          <polygon points="10 7 15 10 10 13" fill={color} stroke={color} strokeWidth="1" />
        </svg>
      )

    case 'webseries': // Overlapping media/screen cards
      return (
        <svg {...svgProps} style={{ ...svgProps.style, '--icon-glow': rgbVal } as any}>
          {/* Back card */}
          <rect x="5" y="6" width="14" height="12" rx="2" stroke={color} strokeWidth="1.25" opacity="0.5" />
          {/* Front card */}
          <rect x="2" y="9" width="14" height="11" rx="2" fill={`${color}10`} stroke={color} strokeWidth="1.75" />
          {/* Antennae */}
          <path d="M7 6L4 2M11 6l3-4" stroke={color} strokeWidth="1.5" />
          {/* Play symbol on front card */}
          <polygon points="7 12 11 14.5 7 17" fill={color} stroke={color} strokeWidth="1" />
        </svg>
      )

    case 'cartoons': // Fun TV screen / mascot bubble with cute ears
      return (
        <svg {...svgProps} style={{ ...svgProps.style, '--icon-glow': rgbVal } as any}>
          {/* Rounded TV capsule */}
          <rect x="3" y="6" width="18" height="13" rx="4" fill={`${color}10`} stroke={color} strokeWidth="1.75" />
          {/* TV antenna ears */}
          <path d="M9 6L6 2M15 6l3-2" stroke={color} strokeWidth="1.75" />
          {/* Sparkles / cartoon expression */}
          <circle cx="8" cy="12" r="1" fill="#FFF" />
          <circle cx="16" cy="12" r="1" fill="#FFF" />
          <path d="M10 15c1 1 3 1 4 0" stroke="#FFF" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      )

    case 'hollywood': // Cinematic walk of fame star
      return (
        <svg {...svgProps} style={{ ...svgProps.style, '--icon-glow': rgbVal } as any}>
          {/* 5-point star */}
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={`${color}15`}
            stroke={color}
            strokeWidth="2"
          />
          {/* Camera lens icon or spot inside */}
          <circle cx="12" cy="11.5" r="2.5" stroke="#FFF" strokeWidth="1.2" />
        </svg>
      )

    case 'ottoriginals': // Exclusive Crown / VIP Badge
      return (
        <svg {...svgProps} style={{ ...svgProps.style, '--icon-glow': rgbVal } as any}>
          {/* Crown */}
          <path
            d="M2 4l3 13h14l3-13-5 5-4-7-4 7-5-5z"
            fill={`${color}12`}
            stroke={color}
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          {/* Crown bottom bar */}
          <path d="M5 20h14" stroke={color} strokeWidth="2.5" />
          {/* Crown tip gems */}
          <circle cx="2" cy="4" r="1" fill="#FFF" />
          <circle cx="12" cy="5" r="1" fill="#FFF" />
          <circle cx="22" cy="4" r="1" fill="#FFF" />
        </svg>
      )

    case 'awardwinners': // Premium Laurel wreath / Trophy
      return (
        <svg {...svgProps} style={{ ...svgProps.style, '--icon-glow': rgbVal } as any}>
          {/* Laurel Wreath */}
          <path d="M6 5c-2.5 3-2.5 8 1 12 3 3.5 7 4 7 4M18 5c2.5 3 2.5 8-1 12-3 3.5-7 4-7 4" stroke={color} strokeWidth="1.5" />
          {/* Trophy Cup */}
          <path d="M9 7h6v5c0 1.66-1.34 3-3 3s-3-1.34-3-3V7z" fill={`${color}15`} stroke={color} strokeWidth="1.5" />
          <path d="M12 15v3M10 18h4" stroke={color} strokeWidth="1.5" />
          <path d="M8 8H7V10C7 11 8 11.5 9 11.5M16 8h1v2c0 1 1 1.5 2 1.5" stroke={color} strokeWidth="1.2" />
        </svg>
      )

    default: // Default Play Video icon
      return (
        <svg {...svgProps}>
          <polygon points="5 3 19 12 5 21 5 3" fill={`${color}20`} stroke={color} strokeWidth="2" />
        </svg>
      )
  }
}
