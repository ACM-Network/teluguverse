'use client'
import { useState, useEffect } from 'react'
import SectionHeader from '@/components/ui/SectionHeader'
import ContentCard from '@/components/ui/ContentCard'
import SkeletonCard from '@/components/ui/SkeletonCard'
import { ContentItem } from '@/types'

export default function TrendingTeluguDubs() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/content?dubAvail=true&sort=popular&limit=24')
      .then(r => r.json())
      .then(d => { setItems(d.items || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div>
      <SectionHeader title="Trending Telugu Dubs" titleTe="ట్రెండింగ్ తెలుగు డబ్స్" href="/search?dubAvail=true" icon="trending" />
      <div className="cards-scroll">
        {loading ? <SkeletonCard count={8} /> : items.map((item, i) => <ContentCard key={item.id} content={item} index={i} />)}
      </div>
    </div>
  )
}
