'use client'
import { useState, useEffect } from 'react'
import SectionHeader from '@/components/ui/SectionHeader'
import ContentCard from '@/components/ui/ContentCard'
import SkeletonCard from '@/components/ui/SkeletonCard'
import { ContentItem } from '@/types'

export default function PopularSection() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/content/trending?limit=12')
      .then(r => r.json())
      .then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div>
      <SectionHeader title="Popular This Week" titleTe="ఈ వారం ప్రాచుర్యం" href="/search?sort=trending" icon="🔥" />
      <div className="cards-scroll">
        {loading ? <SkeletonCard count={8} /> : items.map((item, i) => <ContentCard key={item.id} content={item} index={i} />)}
      </div>
    </div>
  )
}
