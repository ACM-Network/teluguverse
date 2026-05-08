const OTT_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  NETFLIX: { color: '#E50914', bg: 'rgba(229,9,20,0.15)', label: 'Netflix' },
  AMAZON_PRIME: { color: '#00A8E0', bg: 'rgba(0,168,224,0.15)', label: 'Prime Video' },
  HOTSTAR: { color: '#1B74E4', bg: 'rgba(27,116,228,0.15)', label: 'Hotstar' },
  ZEE5: { color: '#7B2FBE', bg: 'rgba(123,47,190,0.15)', label: 'ZEE5' },
  SONY_LIV: { color: '#00558B', bg: 'rgba(0,85,139,0.15)', label: 'SonyLIV' },
  CRUNCHYROLL: { color: '#F47521', bg: 'rgba(244,117,33,0.15)', label: 'Crunchyroll' },
  VIKI: { color: '#1DA462', bg: 'rgba(29,164,98,0.15)', label: 'Viki' },
  FUNIMATION: { color: '#410099', bg: 'rgba(65,0,153,0.15)', label: 'Funimation' },
  MXPLAYER: { color: '#00B4D8', bg: 'rgba(0,180,216,0.15)', label: 'MX Player' },
  AHAN: { color: '#FF6B35', bg: 'rgba(255,107,53,0.15)', label: 'Aha' },
  VOOT: { color: '#FF5200', bg: 'rgba(255,82,0,0.15)', label: 'Voot' },
  OTHER: { color: '#9CA3AF', bg: 'rgba(156,163,175,0.1)', label: 'OTT' },
}

interface Props { platform: string; isTeluguDub?: boolean; url?: string | null }

export default function OttBadge({ platform, isTeluguDub, url }: Props) {
  const config = OTT_CONFIG[platform] || OTT_CONFIG.OTHER
  const Tag = url ? 'a' : 'div' as any
  return (
    <Tag href={url || undefined} target={url ? '_blank' : undefined} rel="noopener noreferrer"
      className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-bold font-rajdhani transition-all hover:opacity-90"
      style={{ background: config.bg, borderColor: `${config.color}40`, color: config.color }}>
      <span className="w-2 h-2 rounded-full" style={{ background: config.color }} />
      {config.label}
      {isTeluguDub && <span className="text-yellow-400 font-telugu text-[10px] ml-1">తె</span>}
    </Tag>
  )
}
