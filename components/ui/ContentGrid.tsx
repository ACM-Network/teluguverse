'use client'
import { motion } from 'framer-motion'
import ContentCard from './ContentCard'
import SkeletonCard from './SkeletonCard'
import { ContentItem } from '@/types'

interface ContentGridProps {
  items: ContentItem[]
  loading?: boolean
  skeletonCount?: number
  cols?: string
}

export default function ContentGrid({
  items,
  loading = false,
  skeletonCount = 24,
  cols = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
}: ContentGridProps) {
  if (loading) {
    return (
      <div className={`grid ${cols} gap-4`}>
        <SkeletonCard count={skeletonCount} />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="text-7xl mb-4">🔍</div>
        <p className="font-cinzel text-xl font-bold text-white mb-2">No content found</p>
        <p className="font-telugu text-gray-500 text-sm">ఫలితాలు కనుగొనబడలేదు</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`grid ${cols} gap-4`}
    >
      {items.map((item, i) => (
        <ContentCard key={item.id} content={item} index={i} />
      ))}
    </motion.div>
  )
}
