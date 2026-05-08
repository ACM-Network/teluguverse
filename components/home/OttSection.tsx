'use client'
import { useState, useEffect } from 'react'
import SectionHeader from '@/components/ui/SectionHeader'
import ContentCard from '@/components/ui/ContentCard'
import SkeletonCard from '@/components/ui/SkeletonCard'
import { ContentItem } from '@/types'

export default function OttSection() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeOtt, setActiveOtt] = useState('NETFLIX')
  const OTT_TABS = [{ key:'NETFLIX',label:'Netflix' },{ key:'AMAZON_PRIME',label:'Prime' },{ key:'HOTSTAR',label:'Hotstar' },{ key:'ZEE5',label:'ZEE5' },{ key:'CRUNCHYROLL',label:'Crunchyroll' }]

  useEffect(() => {
    setLoading(true)
    fetch(`/api/content?ott=${activeOtt}&limit=12`)
      .then(r => r.json())
      .then(d => { setItems(d.items || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [activeOtt])

  return (
    <div>
      <SectionHeader title="OTT New Arrivals" titleTe="OTT కొత్త విడుదలలు" icon="📺" />
      <div className="flex gap-2 mb-5 flex-wrap">
        {OTT_TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveOtt(tab.key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-rajdhani tracking-wide transition-all border ${activeOtt===tab.key?'bg-yellow-500/20 border-yellow-500/50 text-yellow-400':'bg-surface border-border text-gray-400 hover:border-yellow-400/30 hover:text-yellow-400'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="cards-scroll">
        {loading ? <SkeletonCard count={8} /> : items.map((item, i) => <ContentCard key={item.id} content={item} index={i} />)}
      </div>
    </div>
  )
}
