'use client'

const OTT_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  NETFLIX: { color: '#E50914', bg: 'rgba(229,9,20,0.12)', label: 'Netflix' },
  AMAZON_PRIME: { color: '#00A8E0', bg: 'rgba(0,168,224,0.12)', label: 'Prime Video' },
  PRIME_VIDEO: { color: '#00A8E0', bg: 'rgba(0,168,224,0.12)', label: 'Prime Video' },
  JIO_HOTSTAR: { color: '#00D2FF', bg: 'rgba(0,210,255,0.12)', label: 'JioHotstar' },
  HOTSTAR: { color: '#00D2FF', bg: 'rgba(0,210,255,0.12)', label: 'Hotstar' },
  ZEE5: { color: '#A3E635', bg: 'rgba(163,230,53,0.12)', label: 'ZEE5' },
  SONY_LIV: { color: '#F97316', bg: 'rgba(249,115,22,0.12)', label: 'SonyLIV' },
  AHA: { color: '#FF5000', bg: 'rgba(255,80,0,0.12)', label: 'aha' },
  SUN_NXT: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)', label: 'Sun NXT' },
  ETV_WIN: { color: '#EAB308', bg: 'rgba(234,179,8,0.12)', label: 'ETV Win' },
  CRUNCHYROLL: { color: '#F47521', bg: 'rgba(244,117,33,0.12)', label: 'Crunchyroll' },
  ANIME_TIMES: { color: '#EC4899', bg: 'rgba(236,72,153,0.12)', label: 'Anime Times' },
  Anime_times: { color: '#EC4899', bg: 'rgba(236,72,153,0.12)', label: 'Anime Times' },
  MUSE_INDIA_YT: { color: '#FF0000', bg: 'rgba(255,0,0,0.12)', label: 'Muse India' },
  MUSE_India_YT: { color: '#FF0000', bg: 'rgba(255,0,0,0.12)', label: 'Muse India' },
  YOUTUBE: { color: '#FF0000', bg: 'rgba(255,0,0,0.12)', label: 'YouTube' },
  VIKI: { color: '#06B6D4', bg: 'rgba(6,182,212,0.12)', label: 'Viki' },
  FUNIMATION: { color: '#6366F1', bg: 'rgba(99,102,241,0.12)', label: 'Funimation' },
  MXPLAYER: { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', label: 'MX Player' },
  VOOT: { color: '#F97316', bg: 'rgba(249,115,22,0.12)', label: 'Voot' },
  OTHER: { color: '#9CA3AF', bg: 'rgba(156,163,175,0.08)', label: 'OTT' },
}

// Brand SVG Icon Selector for Premium OTT styling
function getPlatformIcon(platform: string, color: string) {
  const p = platform.toUpperCase()
  if (p === 'NETFLIX') {
    return (
      <svg className="w-4 h-4 flex-none" style={{ color }} viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.5 2.5h3.8l4.7 10.3V2.5h3.8v19h-3.8l-4.7-10.3v10.3H5.5z" />
      </svg>
    )
  }
  if (p === 'AMAZON_PRIME' || p === 'PRIME_VIDEO') {
    return (
      <svg className="w-4 h-4 flex-none" style={{ color }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 14c4 3 9 3 13 0" />
        <path d="M11 15l4 2-1-4" />
      </svg>
    )
  }
  if (p === 'CRUNCHYROLL') {
    return (
      <svg className="w-4 h-4 flex-none" style={{ color }} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm5.5-5c0 3.04-2.46 5.5-5.5 5.5S4.5 15.04 4.5 12 6.96 6.5 10 6.5s5.5 2.46 5.5 5.5z" />
      </svg>
    )
  }
  if (p === 'YOUTUBE' || p === 'MUSE_INDIA_YT' || p === 'MUSE_INDIA') {
    return (
      <svg className="w-4 h-4 flex-none" style={{ color }} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.388.555A3.002 3.002 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.48 20.5 12 20.5 12 20.5s7.52 0 9.388-.555a3.002 3.002 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    )
  }
  if (p === 'JIO_HOTSTAR' || p === 'HOTSTAR') {
    return (
      <svg className="w-4 h-4 flex-none" style={{ color }} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
      </svg>
    )
  }
  // Generic Media TV/Play Icon
  return (
    <svg className="w-4 h-4 flex-none" style={{ color }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="4" ry="4" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
    </svg>
  )
}

interface Props {
  platform: string
  isTeluguDub?: boolean
  isTeluguSub?: boolean
  url?: string | null
  isPremium?: boolean
}

export default function OttBadge({ platform, isTeluguDub, isTeluguSub, url, isPremium = true }: Props) {
  const config = OTT_CONFIG[platform] || OTT_CONFIG.OTHER
  const Tag = url ? 'a' : 'div' as any

  return (
    <Tag
      href={url || undefined}
      target={url ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm font-bold font-rajdhani transition-all hover:opacity-95 hover:scale-[1.03] active:scale-[0.98] cursor-pointer group"
      style={{
        background: config.bg,
        borderColor: `${config.color}25`,
        color: config.color,
        boxShadow: `0 4px 15px rgba(0,0,0,0.12), inset 0 0 8px ${config.color}05`
      }}
    >
      {getPlatformIcon(platform, config.color)}
      <span className="text-white font-semibold font-rajdhani tracking-wide group-hover:text-glow transition-colors duration-200" style={{ textShadow: `0 0 10px ${config.color}10` }}>
        {config.label}
      </span>
      
      {/* Visual badges (Dubbing / Subbing / Free status) */}
      <div className="flex gap-1 items-center ml-auto flex-none">
        {isTeluguDub && (
          <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-rajdhani">
            DUB
          </span>
        )}
        {isTeluguSub && (
          <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-rajdhani">
            SUB
          </span>
        )}
        {!isPremium && (
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-rajdhani">
            FREE
          </span>
        )}
      </div>
    </Tag>
  )
}
