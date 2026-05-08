import { cn } from '@/lib/utils'
import { TYPE_COLORS, TYPE_LABELS } from '@/lib/constants'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'type' | 'dub' | 'status' | 'ott' | 'genre' | 'default'
  contentType?: string
  className?: string
}

export default function Badge({ children, variant = 'default', contentType, className }: BadgeProps) {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold font-rajdhani tracking-wide uppercase'

  if (variant === 'type' && contentType) {
    const color = TYPE_COLORS[contentType] || '#9CA3AF'
    return (
      <span className={cn(base, className)} style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
        {TYPE_LABELS[contentType] || contentType}
      </span>
    )
  }

  if (variant === 'dub') {
    return (
      <span className={cn(base, 'bg-yellow-400/15 text-yellow-400 border border-yellow-400/30', className)}>
        {children}
      </span>
    )
  }

  if (variant === 'status') {
    return (
      <span className={cn(base, 'bg-green-500/20 text-green-400 border border-green-500/30', className)}>
        {children}
      </span>
    )
  }

  return (
    <span className={cn(base, 'bg-white/10 text-gray-300 border border-white/15', className)}>
      {children}
    </span>
  )
}
