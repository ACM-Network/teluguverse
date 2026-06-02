'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ContentItem } from '@/types'
import SectionHeader from '@/components/ui/SectionHeader'
import { PLACEHOLDER_POSTER } from '@/lib/utils'

const TYPE_COLORS: Record<string,string> = { MOVIE:'#E50914',ANIME:'#a855f7',SERIES:'#3b82f6',KDRAMA:'#ec4899',CARTOON:'#22c55e',HOLLYWOOD:'#f59e0b',DOCUMENTARY:'#06b6d4' }

export default function TrendingSection() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/content/trending?limit=20')
      .then(r => r.json())
      .then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div>
      <SectionHeader title="Top Rankings" titleTe="టాప్ ర్యాంకింగ్స్" icon="ranking" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          Array.from({length:12}).map((_,i)=><div key={i} className="h-20 rounded-xl bg-surface shimmer" />)
        ) : items.map((item, i) => (
          <Link key={item.id} href={`/content/${item.slug}`}
            className="flex items-center gap-4 p-3 rounded-xl bg-surface border border-border hover:border-yellow-400/30 hover:bg-surface-2 transition-all group">
            <span className={`font-cinzel font-black text-2xl w-8 text-center leading-none flex-none ${i<3?'':'text-gray-600'}`}
              style={i<3?{background:'linear-gradient(135deg,#FFD700,#FFA500)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}:{}}>
              {i+1}
            </span>
            <div className="w-10 h-14 rounded-lg overflow-hidden flex-none"
              style={{ background:`${TYPE_COLORS[item.type]||'#9CA3AF'}18`, border:`1px solid ${TYPE_COLORS[item.type]||'#9CA3AF'}30` }}>
              <img
                src={item.poster || PLACEHOLDER_POSTER}
                alt={item.titleEnglish}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => { e.currentTarget.src = PLACEHOLDER_POSTER }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold font-rajdhani truncate group-hover:text-yellow-400 transition-colors">{item.titleEnglish}</p>
              {item.titleTelugu && <p className="font-telugu text-gray-500 text-xs truncate">{item.titleTelugu}</p>}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded font-rajdhani" style={{background:`${TYPE_COLORS[item.type]}18`,color:TYPE_COLORS[item.type]}}>{item.type}</span>
                {item.teluguDubAvail && <span className="text-[9px] font-bold text-yellow-400 font-telugu">తె DUB</span>}
              </div>
            </div>
            <div className="text-right flex-none">
              <p className="text-yellow-400 font-bold text-sm font-rajdhani">★ {item.imdbRating?.toFixed(1)||'N/A'}</p>
              <p className="text-gray-600 text-[10px] font-rajdhani mt-0.5">{item.viewCount?.toLocaleString()||0} views</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
