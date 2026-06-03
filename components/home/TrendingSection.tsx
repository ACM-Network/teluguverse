'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ContentItem } from '@/types'
import SectionHeader from '@/components/ui/SectionHeader'
import { PLACEHOLDER_POSTER } from '@/lib/utils'

const TYPE_COLORS: Record<string, string> = {
  MOVIE: '#E50914',
  ANIME: '#a855f7',
  SERIES: '#3b82f6',
  KDRAMA: '#ec4899',
  CARTOON: '#22c55e',
  HOLLYWOOD: '#f59e0b',
  DOCUMENTARY: '#06b6d4',
}

interface ItemProps {
  item: ContentItem
  index: number
}

function TrendingItemCard({ item, index }: ItemProps) {
  const [imgSrc, setImgSrc] = useState(item.poster || PLACEHOLDER_POSTER)

  return (
    <Link
      href={`/content/${item.slug}`}
      className="flex items-center gap-4 p-3 rounded-xl bg-surface border border-border hover:border-yellow-400/30 hover:bg-surface-2 transition-all group"
    >
      {/* Rank Number */}
      <span
        className={`font-cinzel font-black text-2xl w-8 text-center leading-none flex-none ${
          index < 3 ? '' : 'text-gray-600'
        }`}
        style={
          index < 3
            ? {
                background: 'linear-gradient(135deg,#FFD700,#FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }
            : {}
        }
      >
        {index + 1}
      </span>

      {/* Poster Image Container */}
      <div
        className="w-10 h-14 rounded-lg overflow-hidden flex-none relative"
        style={{
          background: `${TYPE_COLORS[item.type] || '#9CA3AF'}18`,
          border: `1px solid ${TYPE_COLORS[item.type] || '#9CA3AF'}30`,
        }}
      >
        <Image
          src={imgSrc}
          alt={item.titleEnglish}
          width={40}
          height={56}
          className="w-full h-full object-cover rounded-lg"
          onError={() => setImgSrc(PLACEHOLDER_POSTER)}
          loading="lazy"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-bold font-rajdhani truncate transition-colors">
          {item.titleEnglish}
        </p>
        {item.titleTelugu && (
          <p className="font-telugu text-gray-500 text-xs truncate leading-normal mt-0.5">
            {item.titleTelugu}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded font-rajdhani"
            style={{
              background: `${TYPE_COLORS[item.type]}18`,
              color: TYPE_COLORS[item.type],
            }}
          >
            {item.type}
          </span>
          {item.teluguDubAvail && (
            <span className="text-[9px] font-bold text-yellow-400 font-telugu">
              తె DUB
            </span>
          )}
        </div>
      </div>

      {/* Rating & Views */}
      <div className="text-right flex-none">
        <p className="text-yellow-400 font-bold text-sm font-rajdhani">
          ★ {item.imdbRating ? item.imdbRating.toFixed(1) : 'N/A'}
        </p>
        <p className="text-gray-600 text-[10px] font-rajdhani mt-0.5">
          {item.viewCount ? item.viewCount.toLocaleString() : 0} views
        </p>
      </div>
    </Link>
  )
}

export default function TrendingSection() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/content/trending?limit=20')
      .then((r) => r.json())
      .then((d) => {
        setItems(Array.isArray(d) ? d : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div>
      <SectionHeader
        title="Top Rankings"
        titleTe="టాప్ ర్యాంకింగ్స్"
        icon="ranking"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-surface shimmer" />
            ))
          : items.map((item, i) => (
              <TrendingItemCard key={item.id} item={item} index={i} />
            ))}
      </div>
    </div>
  )
}
