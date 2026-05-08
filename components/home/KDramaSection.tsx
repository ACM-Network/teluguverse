'use client'
import { useState, useEffect } from 'react'
import SectionHeader from '@/components/ui/SectionHeader'
import ContentCard from '@/components/ui/ContentCard'
import SkeletonCard from '@/components/ui/SkeletonCard'
import { ContentItem } from '@/types'

export default function KDramaSection() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/content?type=KDRAMA&sort=rating&limit=12')
      .then(r => r.json())
      .then(d => { setItems(d.items || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div>
      <SectionHeader title="K-Drama Spotlight" titleTe="కొరియన్ డ్రామా" href="/search?type=KDRAMA" icon="🌸" />
      <div className="cards-scroll">
        {loading ? <SkeletonCard count={8} /> : items.map((item, i) => <ContentCard key={item.id} content={item} index={i} />)}
      </div>
    </div>
  )
}
