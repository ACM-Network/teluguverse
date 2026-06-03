'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
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
    <div className="relative">
      {/* Gold accent bar — this is a brand section */}
      <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full overflow-hidden">
        <div
          className="h-full w-full"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.4), rgba(255,165,0,0.3), transparent)',
          }}
        />
      </div>

      <div className="pt-4">
        <SectionHeader
          title="Trending Telugu Dubs"
          titleTe="ట్రెండింగ్ తెలుగు డబ్స్"
          icon="trending"
          description="Most popular movies, anime, and series available in Telugu"
          href="/search?dubAvail=true&sort=trending"
        />

        {/* Ambient glow behind scroll area */}
        <div className="relative">
          <div
            className="absolute -top-10 left-1/2 -translate-x-1/2 w-[80%] h-32 rounded-full blur-3xl pointer-events-none opacity-[0.04]"
            style={{ background: 'linear-gradient(90deg, #FFD700, #FFA500)' }}
          />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="cards-scroll"
          >
            {loading ? (
              <SkeletonCard count={8} />
            ) : items.length > 0 ? (
              items.map((item, i) => (
                <ContentCard key={item.id} content={item} index={i} />
              ))
            ) : (
              <div className="flex items-center justify-center w-full py-12">
                <p className="text-gray-500 text-sm font-rajdhani font-semibold">No trending Telugu dubs found</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
