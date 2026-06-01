'use client'

import React from 'react'

interface LogoProps {
  variant?: 'primary' | 'compact' | 'favicon' | 'monochrome' | 'gold'
  className?: string
  size?: number
}

export default function Logo({ variant = 'primary', className = '', size }: LogoProps) {
  // Gradients definition inside SVG to make sure they render correctly.
  const gradientIdGold = 'logo-gold-gradient'
  const gradientIdCrimson = 'logo-crimson-gradient'
  const gradientIdGoldText = 'logo-gold-text-gradient'

  // Icon sizing helper
  const iconSize = size || (variant === 'compact' || variant === 'favicon' ? 44 : 34)

  const renderIcon = () => {
    const isGold = variant === 'gold'
    const isMonochrome = variant === 'monochrome'

    const strokeColor = isMonochrome
      ? 'currentColor'
      : isGold
      ? 'url(#' + gradientIdGold + ')'
      : 'url(#' + gradientIdCrimson + ')'

    const fillColor = isMonochrome
      ? 'currentColor'
      : isGold
      ? 'url(#' + gradientIdGold + ')'
      : 'url(#' + gradientIdCrimson + ')'

    return (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`flex-none filter drop-shadow-[0_0_12px_rgba(255,215,0,0.15)] group-hover:scale-105 group-hover:rotate-[3deg] transition-all duration-300 ${className}`}
      >
        <defs>
          {/* Crimson gradient */}
          <linearGradient id={gradientIdCrimson} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E50914" />
            <stop offset="50%" stopColor="#C10711" />
            <stop offset="100%" stopColor="#780206" />
          </linearGradient>

          {/* Premium gold gradient */}
          <linearGradient id={gradientIdGold} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="35%" stopColor="#FFD700" />
            <stop offset="70%" stopColor="#FFA500" />
            <stop offset="100%" stopColor="#B37400" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer glowing film-reel-inspired circle ornament */}
        <circle
          cx="50"
          cy="50"
          r="44"
          stroke={strokeColor}
          strokeWidth="3.5"
          strokeDasharray="8 6"
          className="opacity-45 group-hover:rotate-[30deg] transition-transform duration-[8000ms] ease-out origin-center"
        />

        {/* Inner thin circle */}
        <circle cx="50" cy="50" r="36" stroke={strokeColor} strokeWidth="1.5" className="opacity-70" />

        {/* Left Vertical Bar (representing 'T' base / Film sprocket edge) */}
        <path
          d="M32 25C32 23.3431 33.3431 22 35 22H39C40.6569 22 42 23.3431 42 25V75C42 76.6569 40.6569 78 39 78H35C33.3431 78 32 76.6569 32 75V25Z"
          fill={fillColor}
          className="opacity-90"
        />

        {/* Horizontal T-Bar overlapping top */}
        <path
          d="M26 25C26 23.3431 27.3431 22 29 22H59C60.6569 22 62 23.3431 62 25V29C62 30.6569 60.6569 32 59 32H29C27.3431 32 26 30.6569 26 29V25Z"
          fill={fillColor}
          className="opacity-95"
        />

        {/* Cinematic Glowing Play Triangle representing 'V' and streaming core */}
        <path
          d="M48 36.5359C48 34.2265 50.5008 32.7831 52.5 33.9377L74.8803 46.858C76.8795 48.0122 76.8795 50.8989 74.8803 52.0531L52.5 64.9734C50.5008 66.128 48 64.6846 48 62.3752V36.5359Z"
          fill={fillColor}
          filter="url(#logo-glow)"
          className="group-hover:scale-105 group-hover:translate-x-1 origin-center transition-all duration-300"
        />

        {/* Tiny film dots indicating reels */}
        <circle cx="37" cy="38" r="2" fill={isMonochrome ? 'currentColor' : '#FFF'} className="opacity-70" />
        <circle cx="37" cy="50" r="2" fill={isMonochrome ? 'currentColor' : '#FFF'} className="opacity-70" />
        <circle cx="37" cy="62" r="2" fill={isMonochrome ? 'currentColor' : '#FFF'} className="opacity-70" />
      </svg>
    )
  }

  if (variant === 'compact' || variant === 'favicon') {
    return renderIcon()
  }

  const isGold = variant === 'gold'
  const isMonochrome = variant === 'monochrome'

  const titleGradientStyle = isMonochrome
    ? {}
    : isGold
    ? {
        background: 'linear-gradient(135deg, #FFE875 0%, #FFD700 50%, #FFA500 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }
    : {
        background: 'linear-gradient(135deg, #FFF 0%, #FFD700 50%, #FFA500 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }

  return (
    <div className="flex items-center gap-3 select-none">
      {renderIcon()}
      <div className="hidden sm:flex flex-col">
        <span
          className="font-cinzel text-lg sm:text-xl font-bold tracking-[0.16em] uppercase transition-colors"
          style={titleGradientStyle}
        >
          TeluguVerse
        </span>
        <span
          className="text-[9px] font-bold tracking-[0.35em] font-rajdhani text-gray-500 uppercase -mt-1 group-hover:text-yellow-400/80 transition-colors"
        >
          Entertainment
        </span>
      </div>
    </div>
  )
}
