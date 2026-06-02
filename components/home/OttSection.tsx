'use client'

import { useState, useEffect } from 'react'
import SectionHeader from '@/components/ui/SectionHeader'
import ContentCard from '@/components/ui/ContentCard'
import SkeletonCard from '@/components/ui/SkeletonCard'
import PremiumIcon from '@/components/ui/PremiumIcon'
import { ContentItem } from '@/types'

const OTT_TABS = [
  { 
    key: 'NETFLIX', 
    label: 'Netflix', 
    color: '#E50914', 
    icon: (
      <svg className="w-3.5 h-3.5 mr-2 flex-none" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.5 2.5h3.8l4.7 10.3V2.5h3.8v19h-3.8l-4.7-10.3v10.3H5.5z" />
      </svg>
    )
  },
  { 
    key: 'AMAZON_PRIME', 
    label: 'Prime Video', 
    color: '#00A8E0', 
    icon: (
      <svg className="w-3.5 h-3.5 mr-2 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 14c4 3 9 3 13 0" />
        <path d="M11 15l4 2-1-4" />
      </svg>
    )
  },
  { 
    key: 'HOTSTAR', 
    label: 'Disney+ Hotstar', 
    color: '#00D2FF', 
    icon: (
      <svg className="w-3.5 h-3.5 mr-2 flex-none" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
      </svg>
    )
  },
  { 
    key: 'ZEE5', 
    label: 'ZEE5', 
    color: '#A3E635', 
    icon: (
      <svg className="w-3.5 h-3.5 mr-2 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 8h8l-8 8h8" />
      </svg>
    )
  },
  { 
    key: 'CRUNCHYROLL', 
    label: 'Crunchyroll', 
    color: '#F47521', 
    icon: (
      <svg className="w-3.5 h-3.5 mr-2 flex-none" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm5.5-5c0 3.04-2.46 5.5-5.5 5.5S4.5 15.04 4.5 12 6.96 6.5 10 6.5s5.5 2.46 5.5 5.5z" />
      </svg>
    )
  },
  { 
    key: 'TV', 
    label: 'TV Channels', 
    color: '#A855F7', 
    icon: (
      <svg className="w-3.5 h-3.5 mr-2 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
        <polyline points="17 2 12 7 7 2" />
      </svg>
    )
  }
]

export default function OttSection() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeOtt, setActiveOtt] = useState('NETFLIX')

  useEffect(() => {
    setLoading(true)
    fetch(`/api/content?ott=${activeOtt}&limit=24`)
      .then(r => r.json())
      .then(d => { setItems(d.items || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [activeOtt])

  const getTabStyle = (tab: typeof OTT_TABS[0], isActive: boolean) => {
    const color = tab.color
    if (isActive) {
      return {
        borderColor: `${color}40`,
        color: color,
        background: `${color}15`,
        boxShadow: `0 4px 18px ${color}15, inset 0 0 10px ${color}08`
      }
    }
    return {
      borderColor: 'rgba(255, 255, 255, 0.05)',
      color: '#9CA3AF',
      background: 'rgba(255, 255, 255, 0.02)'
    }
  }

  return (
    <div className="relative">
      <SectionHeader 
        title="Where To Watch" 
        titleTe="ఎక్కడ చూడాలి" 
        icon="📺"
        description="Find movies, anime, and series based on your streaming subscription or television network availability"
      />
      
      {/* Premium segmented control row with icons */}
      <div className="flex gap-3.5 mb-8 flex-wrap select-none">
        {OTT_TABS.map(tab => {
          const isActive = activeOtt === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveOtt(tab.key)}
              style={getTabStyle(tab, isActive)}
              className="px-5 py-3 rounded-xl text-xs font-bold font-rajdhani tracking-wider uppercase transition-all duration-300 border flex items-center hover:scale-105 active:scale-95 shadow-md"
            >
              {tab.icon}
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="cards-scroll">
        {loading ? (
          <SkeletonCard count={6} />
        ) : items.length === 0 ? (
          <div className="w-full py-16 flex flex-col items-center justify-center border border-white/5 rounded-2xl bg-surface/20 backdrop-blur-md">
            <PremiumIcon name="movies" size={32} className="opacity-30 mb-2.5" />
            <p className="text-gray-500 text-sm font-rajdhani font-bold tracking-wide">No content found for this provider</p>
          </div>
        ) : (
          items.map((item, i) => <ContentCard key={item.id} content={item} index={i} />)
        )}
      </div>
    </div>
  )
}
