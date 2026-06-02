'use client'

const OTT_CONFIG: Record<string, { color: string; bg: string; label: string; prefix: string }> = {
  NETFLIX: { color: '#E50914', bg: 'rgba(229,9,20,0.12)', label: 'Netflix', prefix: 'Available On' },
  AMAZON_PRIME: { color: '#00A8E0', bg: 'rgba(0,168,224,0.12)', label: 'Prime Video', prefix: 'Available On' },
  PRIME_VIDEO: { color: '#00A8E0', bg: 'rgba(0,168,224,0.12)', label: 'Prime Video', prefix: 'Available On' },
  JIO_HOTSTAR: { color: '#00D2FF', bg: 'rgba(0,210,255,0.12)', label: 'JioHotstar', prefix: 'Available On' },
  HOTSTAR: { color: '#00D2FF', bg: 'rgba(0,210,255,0.12)', label: 'Hotstar', prefix: 'Available On' },
  ZEE5: { color: '#A3E635', bg: 'rgba(163,230,53,0.12)', label: 'ZEE5', prefix: 'Available On' },
  SONY_LIV: { color: '#F97316', bg: 'rgba(249,115,22,0.12)', label: 'SonyLIV', prefix: 'Available On' },
  AHA: { color: '#FF5000', bg: 'rgba(255,80,0,0.12)', label: 'aha', prefix: 'Available On' },
  SUN_NXT: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)', label: 'Sun NXT', prefix: 'Available On' },
  ETV_WIN: { color: '#EAB308', bg: 'rgba(234,179,8,0.12)', label: 'ETV Win', prefix: 'Available On' },
  CRUNCHYROLL: { color: '#F47521', bg: 'rgba(244,117,33,0.12)', label: 'Crunchyroll', prefix: 'Available On' },
  ANIME_TIMES: { color: '#EC4899', bg: 'rgba(236,72,153,0.12)', label: 'Anime Times', prefix: 'Available On' },
  Anime_times: { color: '#EC4899', bg: 'rgba(236,72,153,0.12)', label: 'Anime Times', prefix: 'Available On' },
  MUSE_INDIA_YT: { color: '#FF0000', bg: 'rgba(255,0,0,0.12)', label: 'Muse India', prefix: 'Available On' },
  MUSE_India_YT: { color: '#FF0000', bg: 'rgba(255,0,0,0.12)', label: 'Muse India', prefix: 'Available On' },
  YOUTUBE: { color: '#FF0000', bg: 'rgba(255,0,0,0.12)', label: 'YouTube', prefix: 'Available On' },
  VIKI: { color: '#06B6D4', bg: 'rgba(6,182,212,0.12)', label: 'Viki', prefix: 'Available On' },
  FUNIMATION: { color: '#6366F1', bg: 'rgba(99,102,241,0.12)', label: 'Funimation', prefix: 'Available On' },
  MXPLAYER: { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', label: 'MX Player', prefix: 'Available On' },
  VOOT: { color: '#F97316', bg: 'rgba(249,115,22,0.12)', label: 'Voot', prefix: 'Available On' },
  OTHER: { color: '#9CA3AF', bg: 'rgba(156,163,175,0.08)', label: 'OTT', prefix: 'Available On' },

  // TV Channels
  DISNEY_CHANNEL: { color: '#0096FE', bg: 'rgba(0,150,254,0.12)', label: 'Disney Channel', prefix: 'Available On TV' },
  HUNGAMA_TV: { color: '#FF4F00', bg: 'rgba(255,79,0,0.12)', label: 'Hungama TV', prefix: 'Airs On' },
  CARTOON_NETWORK: { color: '#FDFDFD', bg: 'rgba(253,253,253,0.12)', label: 'Cartoon Network', prefix: 'Available On TV' },
  POGO: { color: '#FF1493', bg: 'rgba(255,20,147,0.12)', label: 'Pogo', prefix: 'Airs On' },
  SONIC: { color: '#E11D48', bg: 'rgba(225,29,72,0.12)', label: 'Sonic', prefix: 'Airs On' },
  NICK: { color: '#FF7F00', bg: 'rgba(255,127,0,0.12)', label: 'Nick', prefix: 'Available On TV' },
  SONY_YAY: { color: '#84CC16', bg: 'rgba(132,204,22,0.12)', label: 'Sony YAY!', prefix: 'Airs On' },
  ETV_BAL_BHARAT: { color: '#EAB308', bg: 'rgba(234,179,8,0.12)', label: 'ETV Bal Bharat', prefix: 'Airs On' },
  TV: { color: '#A855F7', bg: 'rgba(168,85,247,0.12)', label: 'Available on TV', prefix: '' },
  AVAILABLE_ON_TV: { color: '#A855F7', bg: 'rgba(168,85,247,0.12)', label: 'Available on TV', prefix: '' }
}

// Brand SVG Icon Selector for Premium OTT and TV Channel styling
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
  if (p === 'DISNEY_CHANNEL') {
    return (
      <svg className="w-4 h-4 flex-none" style={{ color }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z" />
        <path d="M12 14c-1.5 0-3-1-3-2.5s1.5-2.5 3-2.5 3 1 3 2.5-1.5 2.5-3 2.5z" />
        <path d="M8 2l4 4 4-4" />
      </svg>
    )
  }
  if (p === 'HUNGAMA_TV') {
    return (
      <svg className="w-4 h-4 flex-none" style={{ color }} viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 10V2L4 14h7v8l9-12h-7z" />
      </svg>
    )
  }
  if (p === 'CARTOON_NETWORK') {
    return (
      <svg className="w-4 h-4 flex-none" style={{ color }} viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="2" width="9" height="9" rx="1" />
        <rect x="13" y="13" width="9" height="9" rx="1" />
        <rect x="13" y="2" width="9" height="9" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="2" y="13" width="9" height="9" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (p === 'POGO') {
    return (
      <svg className="w-4 h-4 flex-none" style={{ color }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    )
  }
  if (p === 'SONIC') {
    return (
      <svg className="w-4 h-4 flex-none" style={{ color }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    )
  }
  if (p === 'NICK') {
    return (
      <svg className="w-4 h-4 flex-none" style={{ color }} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 3.05 1.37 5.79 3.53 7.64C7.03 20.9 9.38 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
      </svg>
    )
  }
  if (p === 'SONY_YAY') {
    return (
      <svg className="w-4 h-4 flex-none" style={{ color }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8a6 6 0 0 0-12 0c0 7 3 9 6 9s6-2 6-9z" />
        <path d="M12 2v2" />
        <path d="M5 22h14" />
      </svg>
    )
  }
  if (p === 'ETV_BAL_BHARAT') {
    return (
      <svg className="w-4 h-4 flex-none" style={{ color }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  }
  if (p === 'TV' || p === 'AVAILABLE_ON_TV') {
    return (
      <svg className="w-4 h-4 flex-none" style={{ color }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
        <polyline points="17 2 12 7 7 2" />
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

const OTT_FALLBACKS: Record<string, string> = {
  NETFLIX: 'https://www.netflix.com',
  AMAZON_PRIME: 'https://www.primevideo.com',
  PRIME_VIDEO: 'https://www.primevideo.com',
  JIO_HOTSTAR: 'https://www.hotstar.com',
  HOTSTAR: 'https://www.hotstar.com',
  ZEE5: 'https://www.zee5.com',
  SONY_LIV: 'https://www.sonyliv.com',
  AHA: 'https://www.aha.video',
  SUN_NXT: 'https://www.sunnxt.com',
  ETV_WIN: 'https://www.etvwin.com',
  CRUNCHYROLL: 'https://www.crunchyroll.com',
  ANIME_TIMES: 'https://www.amazon.in/channels/animetimes',
  Anime_times: 'https://www.amazon.in/channels/animetimes',
  MUSE_INDIA_YT: 'https://www.youtube.com/@MuseIndia',
  MUSE_India_YT: 'https://www.youtube.com/@MuseIndia',
  YOUTUBE: 'https://www.youtube.com',
  VIKI: 'https://www.viki.com',
  FUNIMATION: 'https://www.crunchyroll.com',
  MXPLAYER: 'https://www.mxplayer.in',
  // TV Fallbacks
  DISNEY_CHANNEL: 'https://disney.in/disney-channel',
  HUNGAMA_TV: 'https://www.hungamatv.com',
  CARTOON_NETWORK: 'https://www.cartoonnetworkindia.com',
  POGO: 'https://www.pogo.tv',
  SONIC: 'https://www.sonicgang.com',
  NICK: 'https://www.nickindia.com',
  SONY_YAY: 'https://www.sonyyay.com',
  ETV_BAL_BHARAT: 'https://www.etvbalbharat.com',
}

interface Props {
  platform: string
  isTeluguDub?: boolean
  isTeluguSub?: boolean
  url?: string | null
  isPremium?: boolean
  hidePrefix?: boolean
}

export default function OttBadge({ platform, isTeluguDub, isTeluguSub, url, isPremium = true, hidePrefix = false }: Props) {
  const config = OTT_CONFIG[platform.toUpperCase()] || OTT_CONFIG[platform] || OTT_CONFIG.OTHER
  const finalUrl = url || OTT_FALLBACKS[platform.toUpperCase()]
  const Tag = finalUrl ? 'a' : 'div' as any

  const labelToDisplay = !hidePrefix && config.prefix 
    ? `${config.prefix}: ${config.label}` 
    : config.label

  return (
    <Tag
      href={finalUrl || undefined}
      target={finalUrl ? '_blank' : undefined}
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
        {labelToDisplay}
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
