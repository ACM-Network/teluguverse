'use client'
import Link from 'next/link'

interface Props {
  title: string
  titleTe?: string
  href?: string
  icon?: string
}

export default function SectionHeader({ title, titleTe, href, icon }: Props) {
  return (
    <div className="flex items-center justify-between mb-7">
      <div className="flex items-center gap-3">
        <div className="w-1 h-7 rounded-full" style={{ background: 'linear-gradient(180deg, #FFD700, #FFA500)' }} />
        <div>
          <h2 className="font-cinzel text-xl font-bold text-white tracking-wide flex items-center gap-2">
            {icon && <span>{icon}</span>}
            {title}
          </h2>
          {titleTe && <span className="font-telugu text-xs text-gray-500 mt-0.5 block">{titleTe}</span>}
        </div>
      </div>
      {href && (
        <Link href={href} className="text-yellow-400 text-xs font-bold font-rajdhani tracking-widest uppercase border border-yellow-400/20 px-4 py-2 rounded-lg hover:bg-yellow-400/10 hover:border-yellow-400/50 transition-all">
          View All →
        </Link>
      )}
    </div>
  )
}
