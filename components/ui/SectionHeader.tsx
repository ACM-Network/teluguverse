'use client'

import Link from 'next/link'
import PremiumIcon from '@/components/ui/PremiumIcon'

interface Props {
  title: string
  titleTe?: string
  href?: string
  icon?: string
  description?: string
}

function isEmoji(str: string) {
  // Check if string contains standard emoji ranges or high unicode characters
  return /[\uD800-\uDFFF]/.test(str) || !/^[a-zA-Z\-]+$/.test(str)
}

export default function SectionHeader({ title, titleTe, href, icon, description }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 select-none">
      <div className="flex items-start gap-4">
        {/* Cinematic Vertical Accent Bar with multi-stage brand gradient */}
        <div
          className="w-1.5 h-11 rounded-full flex-none mt-1 shadow-[0_0_15px_rgba(255,215,0,0.4)]"
          style={{ background: 'linear-gradient(180deg, #FFE875 0%, #FFA500 50%, #FF512F 100%)' }}
        />

        <div className="space-y-1">
          {/* Subtitle / Telugu script */}
          {titleTe && (
            <span className="font-telugu text-xs font-semibold text-yellow-500/80 tracking-wide block uppercase">
              {titleTe}
            </span>
          )}

          {/* Main Title */}
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wider flex items-center gap-3">
            {icon && (
              <span className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-[inset_0_0_10px_rgba(255,255,255,0.03),_0_4px_12px_rgba(0,0,0,0.2)] hover:scale-105 hover:border-yellow-400/30 hover:bg-yellow-400/[0.03] transition-all duration-300 group/icon">
                {isEmoji(icon) ? (
                  <span className="text-base group-hover/icon:scale-110 transition-transform duration-300">{icon}</span>
                ) : (
                  <PremiumIcon name={icon} size={20} className="group-hover/icon:scale-110 group-hover/icon:rotate-3" />
                )}
              </span>
            )}
            <span className="gradient-text-silver">{title}</span>
          </h2>

          {/* Optional Cinematic Introduction */}
          {description && (
            <p className="text-gray-400 text-xs sm:text-sm font-rajdhani max-w-xl font-medium leading-relaxed pt-1">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* View All Button */}
      {href && (
        <Link
          href={href}
          className="text-yellow-400 text-xs font-bold font-rajdhani tracking-widest uppercase border border-yellow-400/20 px-5 py-2.5 rounded-xl bg-yellow-400/[0.03] hover:bg-yellow-400/10 hover:border-yellow-400/40 hover:-translate-y-0.5 active:scale-95 transition-all self-start sm:self-auto shadow-md"
          style={{
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
          }}
        >
          View All →
        </Link>
      )}
    </div>
  )
}
