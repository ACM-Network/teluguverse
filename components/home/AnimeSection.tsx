'use client'
import { useState, useEffect } from 'react'
import SectionHeader from '@/components/ui/SectionHeader'
import ContentCard from '@/components/ui/ContentCard'
import SkeletonCard from '@/components/ui/SkeletonCard'
import { ContentItem } from '@/types'

export default function AnimeSection() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/content?type=ANIME&sort=rating&limit=12')
      .then(r => r.json())
      .then(d => { setItems(d.items || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div>
      <SectionHeader title="Top Rated Anime" titleTe="అత్యుత్తమ అనిమే" href="/search?type=ANIME" icon="⚡" />
      <div className="cards-scroll">
        {loading ? <SkeletonCard count={8} /> : items.map((item, i) => <ContentCard key={item.id} content={item} index={i} />)}
      </div>
    </div>
  )
}
