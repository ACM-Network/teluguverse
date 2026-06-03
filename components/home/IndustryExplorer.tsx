'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import SectionHeader from '@/components/ui/SectionHeader'

const INDUSTRIES = [
  {
    key: 'tollywood',
    name: 'Tollywood',
    nameTe: 'టాలీవుడ్',
    desc: 'Telugu Cinema',
    href: '/industry/tollywood',
    color: '#FFD700',
    backdrop: '/images/industries/tollywood.png',
    gradient: 'linear-gradient(135deg, rgba(255,215,0,0.22) 0%, rgba(7,8,16,0.95) 70%)',
    pattern: (c: string) => (
      <svg className="absolute inset-0 w-full h-full opacity-[0.1]" viewBox="0 0 100 120">
        <defs>
          <pattern id="tw-p" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M0 8 L8 0 L16 8 L8 16 Z" fill="none" stroke={c} strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100" height="120" fill="url(#tw-p)" />
        <circle cx="50" cy="50" r="20" fill="none" stroke={c} strokeWidth="0.8" strokeDasharray="4 4" />
        <path d="M30 80 L50 65 L70 80" fill="none" stroke={c} strokeWidth="1" />
      </svg>
    ),
  },
  {
    key: 'bollywood',
    name: 'Bollywood',
    nameTe: 'బాలీవుడ్',
    desc: 'Hindi Cinema',
    href: '/industry/bollywood',
    color: '#F43F5E',
    backdrop: '/images/industries/bollywood.png',
    gradient: 'linear-gradient(135deg, rgba(244,63,94,0.2) 0%, rgba(7,8,16,0.95) 70%)',
    pattern: (c: string) => (
      <svg className="absolute inset-0 w-full h-full opacity-[0.1]" viewBox="0 0 100 120">
        <circle cx="50" cy="50" r="30" fill="none" stroke={c} strokeWidth="0.6" />
        <circle cx="50" cy="50" r="18" fill="none" stroke={c} strokeWidth="0.4" strokeDasharray="3 3" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180
          return <line key={i} x1="50" y1="50" x2={50 + 30 * Math.cos(a)} y2={50 + 30 * Math.sin(a)} stroke={c} strokeWidth="0.3" />
        })}
      </svg>
    ),
  },
  {
    key: 'kollywood',
    name: 'Kollywood',
    nameTe: 'కొలీవుడ్',
    desc: 'Tamil Cinema',
    href: '/industry/kollywood',
    color: '#06B6D4',
    backdrop: '/images/industries/kollywood.png',
    gradient: 'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(7,8,16,0.95) 70%)',
    pattern: (c: string) => (
      <svg className="absolute inset-0 w-full h-full opacity-[0.1]" viewBox="0 0 100 120">
        <rect x="25" y="25" width="50" height="50" rx="4" fill="none" stroke={c} strokeWidth="0.7" />
        <rect x="32" y="32" width="36" height="36" rx="2" fill="none" stroke={c} strokeWidth="0.4" strokeDasharray="3 3" />
        <line x1="50" y1="15" x2="50" y2="85" stroke={c} strokeWidth="0.3" />
        <line x1="15" y1="50" x2="85" y2="50" stroke={c} strokeWidth="0.3" />
      </svg>
    ),
  },
  {
    key: 'hollywood',
    name: 'Hollywood',
    nameTe: 'హాలీవుడ్',
    desc: 'English Cinema',
    href: '/industry/hollywood',
    color: '#3B82F6',
    backdrop: '/images/industries/hollywood.png',
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(7,8,16,0.95) 70%)',
    pattern: (c: string) => (
      <svg className="absolute inset-0 w-full h-full opacity-[0.1]" viewBox="0 0 100 120">
        <polygon points="50,15 58,35 80,35 62,48 68,68 50,55 32,68 38,48 20,35 42,35" fill="none" stroke={c} strokeWidth="0.8" />
        <circle cx="50" cy="42" r="8" fill="none" stroke={c} strokeWidth="0.5" />
        <path d="M15 85 L85 85" stroke={c} strokeWidth="0.5" strokeDasharray="4 4" />
      </svg>
    ),
  },
  {
    key: 'anime',
    name: 'Anime',
    nameTe: 'అనిమే',
    desc: 'Japanese Animation',
    href: '/industry/anime',
    color: '#A855F7',
    backdrop: '/images/industries/anime.png',
    gradient: 'linear-gradient(135deg, rgba(168,85,247,0.22) 0%, rgba(7,8,16,0.95) 70%)',
    pattern: (c: string) => (
      <svg className="absolute inset-0 w-full h-full opacity-[0.1]" viewBox="0 0 100 120">
        <path d="M50 20 L60 40 L80 40 L65 55 L72 75 L50 62 L28 75 L35 55 L20 40 L40 40 Z" fill="none" stroke={c} strokeWidth="0.7" />
        <path d="M20 85 Q35 78 50 85 Q65 92 80 85" fill="none" stroke={c} strokeWidth="0.5" />
        <circle cx="38" cy="44" r="2" fill={c} fillOpacity="0.3" />
        <circle cx="62" cy="44" r="2" fill={c} fillOpacity="0.3" />
      </svg>
    ),
  },
  {
    key: 'kdrama',
    name: 'K-Drama',
    nameTe: 'కే-డ్రామా',
    desc: 'Korean Drama',
    href: '/industry/kdrama',
    color: '#EC4899',
    backdrop: '/images/industries/kdrama.png',
    gradient: 'linear-gradient(135deg, rgba(236,72,153,0.2) 0%, rgba(7,8,16,0.95) 70%)',
    pattern: (c: string) => (
      <svg className="absolute inset-0 w-full h-full opacity-[0.1]" viewBox="0 0 100 120">
        <path d="M50 75 C50 75 20 50 20 35 C20 22 32 18 50 32 C68 18 80 22 80 35 C80 50 50 75 50 75Z" fill="none" stroke={c} strokeWidth="0.8" />
        <circle cx="50" cy="48" r="5" fill="none" stroke={c} strokeWidth="0.5" />
        <path d="M45 48 L55 48 M50 43 L50 53" stroke={c} strokeWidth="0.4" />
      </svg>
    ),
  },
]

function IndustryCard({ industry, i }: { industry: typeof INDUSTRIES[0]; i: number }) {
  const [hasError, setHasError] = useState(false)
  const imageSrc = industry.backdrop.startsWith('/images/')
    ? industry.backdrop
    : `https://image.tmdb.org/t/p/w780${industry.backdrop}`

  return (
    <Link
      href={industry.href}
      className="relative flex flex-col items-center justify-end rounded-2xl overflow-hidden group cursor-pointer aspect-[3/4] border border-white/[0.04] hover:border-transparent transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
      style={{ background: industry.gradient }}
    >
      {/* Backdrop Image using Next.js Image */}
      {industry.backdrop && !hasError && (
        <div className="absolute inset-0 w-full h-full select-none pointer-events-none z-0">
          <Image
            src={imageSrc}
            alt={industry.name}
            fill
            sizes="(max-width: 768px) 50vw, 16vw"
            className="object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500"
            onError={() => setHasError(true)}
            loading="lazy"
          />
        </div>
      )}

      {/* Pattern artwork */}
      <div className="absolute inset-0 group-hover:opacity-[0.2] transition-opacity duration-500 z-10">
        {industry.pattern(industry.color)}
      </div>

      {/* Top glow */}
      <div
        className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-28 h-28 rounded-full blur-3xl opacity-15 group-hover:opacity-35 transition-opacity duration-500 z-10"
        style={{ background: industry.color }}
      />

      {/* Bottom gradient — slightly lighter for recognizable poster */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2/3 z-20"
        style={{
          background: 'linear-gradient(to top, rgba(7,8,16,0.92) 0%, rgba(7,8,16,0.6) 50%, rgba(7,8,16,0) 100%)',
        }}
      />

      {/* Industry name */}
      <div className="relative z-30 p-4 pb-5 text-center w-full">
        <h3 className="text-white text-base font-black font-rajdhani tracking-wider uppercase group-hover:scale-105 transition-transform duration-300">
          {industry.name}
        </h3>
        <p className="font-telugu text-[11px] mt-0.5 opacity-70" style={{ color: industry.color }}>
          {industry.nameTe}
        </p>
        <p className="text-gray-400 text-[9px] font-semibold font-rajdhani tracking-wider uppercase mt-1">
          {industry.desc}
        </p>
      </div>

      {/* Bottom accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] translate-y-[2px] group-hover:translate-y-0 transition-transform duration-300 z-30"
        style={{ background: industry.color }}
      />

      {/* Hover border glow */}
      <div
        className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-current opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-30"
        style={{ color: `${industry.color}40` }}
      />
    </Link>
  )
}

export default function IndustryExplorer() {
  return (
    <div className="relative">
      <SectionHeader
        title="Explore by Industry"
        titleTe="పరిశ్రమ వారీగా అన్వేషించండి"
        description="Discover content from film industries across the world"
        icon="globe"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
        {INDUSTRIES.map((industry, i) => (
          <motion.div
            key={industry.key}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.45 }}
          >
            <IndustryCard industry={industry} i={i} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
