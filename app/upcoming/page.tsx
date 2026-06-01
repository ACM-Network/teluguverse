'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import PremiumIcon from '@/components/ui/PremiumIcon'

const TYPE_COLORS: Record<string, string> = {
  MOVIE: '#E50914',
  ANIME: '#A855F7',
  SERIES: '#3B82F6',
  KDRAMA: '#EC4899',
  CARTOON: '#22C55E',
  HOLLYWOOD: '#F59E0B',
  DOCUMENTARY: '#06B6D4',
}

const UPCOMING_ARTWORKS: Record<string, (color: string) => React.ReactNode> = {
  '1': (color) => (
    <svg className="w-16 h-16 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <path d="M6 18L18 6M18 6h-6M18 6v6M3 21l3-3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="9" strokeDasharray="3 3" opacity="0.4" />
    </svg>
  ),
  '2': (color) => (
    <svg className="w-16 h-16 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <path d="M4 22V2M20 22V2M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
      <circle cx="12" cy="12" r="5" strokeDasharray="2 2" opacity="0.5" />
    </svg>
  ),
  '3': (color) => (
    <svg className="w-16 h-16 animate-pulse-glow" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <circle cx="12" cy="12" r="8" strokeLinecap="round" />
      <circle cx="12" cy="12" r="4" fill={`${color}22`} />
      <path d="M12 2v20M2 12h20" opacity="0.3" strokeLinecap="round" />
    </svg>
  ),
  '4': (color) => (
    <svg className="w-16 h-16 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <path d="M12 2c5 0 9 4 9 9s-9 11-9 11-9-6-9-11 4-9 9-9z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 6c3 0 5 2 5 5s-5 7-5 7" opacity="0.4" strokeLinecap="round" />
    </svg>
  ),
  '5': (color) => (
    <svg className="w-16 h-16 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <path d="M12 22V12M12 12c4-3 4-8 0-10-4 2-4 7 0 10zM12 15c-3 0-5-2-5-5s2-5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  '6': (color) => (
    <svg className="w-16 h-16 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="4" fill={`${color}22`} />
    </svg>
  ),
  '7': (color) => (
    <svg className="w-16 h-16 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
      <polygon points="10 8 16 12 10 16" fill={color} />
    </svg>
  ),
  '8': (color) => (
    <svg className="w-16 h-16 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" opacity="0.4" strokeLinecap="round" />
    </svg>
  )
}

function Countdown({ days, color }: { days: number; color: string }) {
  const [secs, setSecs] = useState(days * 86400)
  useEffect(() => {
    const t = setInterval(() => setSecs(s => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])
  const d = Math.floor(secs / 86400)
  const h = Math.floor((secs % 86400) / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  return (
    <div className="flex gap-2.5 justify-center py-1 sm:py-2">
      {[{ v: d, l: 'Days' }, { v: h, l: 'Hrs' }, { v: m, l: 'Min' }, { v: s, l: 'Sec' }].map(({ v, l }) => (
        <div key={l} className="text-center flex-1">
          <span 
            className="font-cinzel text-base sm:text-lg font-black block leading-none"
            style={{ color, textShadow: `0 0 8px ${color}50` }}
          >
            {String(v).padStart(2, '0')}
          </span>
          <span className="text-gray-400 text-[8px] sm:text-[9px] uppercase tracking-wider font-rajdhani font-bold mt-1 block leading-none">{l}</span>
        </div>
      ))}
    </div>
  )
}

const MOCK = [
  { id: '1', title: 'Ramayana', titleTe: 'రామాయణం', type: 'MOVIE', genre: 'Mythology', year: 2025, days: 45, desc: 'మహాకావ్యం రామాయణం తెలుగు వెండితెరపై అద్భుతంగా రానుంది.', status: 'POST-PRODUCTION' },
  { id: '2', title: 'Coolie', titleTe: 'కూలీ', type: 'MOVIE', genre: 'Action', year: 2025, days: 23, desc: 'రజినీకాంత్ అభినయించే ఈ యాక్షన్ చిత్రం అందరినీ మెప్పించనుంది.', status: 'FILMING' },
  { id: '3', title: 'Dragon Ball DAIMA S2', titleTe: 'డ్రాగన్ బాల్ DAIMA', type: 'ANIME', genre: 'Anime', year: 2025, days: 180, desc: 'గోకు మరియు అతని మిత్రులు తిరిగి వస్తున్నారు కొత్త అడ్వెంచర్‌తో.', status: 'TEASER OUT' },
  { id: '4', title: 'House of Dragon S3', titleTe: 'హౌస్ ఆఫ్ ది డ్రాగన్', type: 'SERIES', genre: 'Fantasy', year: 2026, days: 280, desc: 'టార్గర్యెన్ రాజ వంశంలో అంతర్యుద్ధం మరింత తీవ్రమవుతోంది.', status: 'PRE-PRODUCTION' },
  { id: '5', title: 'Hari Hara Veera Mallu', titleTe: 'హరి హర వీర మల్లు', type: 'MOVIE', genre: 'Historical', year: 2025, days: 60, desc: 'పవన్ కళ్యాణ్ ప్రధాన పాత్రలో వస్తున్న చారిత్రాత్మక యాక్షన్ చిత్రం.', status: 'FILMING' },
  { id: '6', title: 'Kalki 2898 Part 2', titleTe: 'కల్కి 2898 పార్ట్ 2', type: 'MOVIE', genre: 'Sci-Fi', year: 2026, days: 480, desc: 'కల్కి అవతారం మరింత శక్తివంతంగా తిరిగి వస్తాడు. చీకటి శక్తులు తయారవుతున్నాయి.', status: 'ANNOUNCED' },
  { id: '7', title: 'The Raja Saab', titleTe: 'ది రాజా సాబ్', type: 'MOVIE', genre: 'Horror Comedy', year: 2025, days: 75, desc: 'ప్రభాస్ సరికొత్త హారర్ కామెడీ వినోదభరిత చిత్రం.', status: 'TEASER OUT' },
  { id: '8', title: 'Vishwambhara', titleTe: 'విశ్వంభర', type: 'MOVIE', genre: 'Fantasy', year: 2025, days: 90, desc: 'చిరంజీవి అద్భుతమైన సోషియో-ఫాంటసీ సినిమా.', status: 'POST-PRODUCTION' },
  { id: '9', title: 'They Call Him OG', titleTe: 'ఓజీ', type: 'MOVIE', genre: 'Action', year: 2025, days: 120, desc: 'గ్యాంగ్‌స్టర్ నేపథ్యంలో పవన్ కళ్యాణ్ నటిస్తున్న మోస్ట్ స్టైలిష్ యాక్షన్ చిత్రం.', status: 'FILMING' },
  { id: '10', title: 'Spirit', titleTe: 'స్పిరిట్', type: 'MOVIE', genre: 'Action', year: 2026, days: 380, desc: 'సందీప్ వంగా మరియు ప్రభాస్ కాంబినేషన్ లో భారీ కాప్ డ్రామా.', status: 'ANNOUNCED' },
  { id: '11', title: 'Superman', titleTe: 'సూపర్‌మ్యాన్', type: 'HOLLYWOOD', genre: 'Superhero', year: 2025, days: 110, desc: 'జేమ్స్ గన్ దర్శకత్వంలో వస్తున్న సరికొత్త సూపర్ మ్యాన్ చిత్రం.', status: 'POST-PRODUCTION' },
  { id: '12', title: 'The Fantastic Four', titleTe: 'ఫెంటాస్టిక్ ఫోర్', type: 'HOLLYWOOD', genre: 'Superhero', year: 2025, days: 190, desc: 'మార్వెల్ యొక్క సరికొత్త ఫెంటాస్టిక్ ఫోర్ బృందం ప్రయాణం.', status: 'POST-PRODUCTION' },
  { id: '13', title: 'Avengers: Doomsday', titleTe: 'అవెంజర్స్', type: 'HOLLYWOOD', genre: 'Superhero', year: 2026, days: 600, desc: 'డాక్టర్ డూమ్ గా రాబర్ట్ డౌనీ జూనియర్ తిరిగి వచ్చే అద్భుత చిత్రం.', status: 'ANNOUNCED' },
  { id: '14', title: 'The Batman Part II', titleTe: 'ది బాట్మన్ 2', type: 'HOLLYWOOD', genre: 'Crime Thriller', year: 2026, days: 640, desc: 'రాబర్ట్ ప్యాటిన్సన్ బాట్మన్ గా తిరిగి వచ్చే చీకటి కథనం.', status: 'PRE-PRODUCTION' },
  { id: '15', title: 'Avatar: Fire and Ash', titleTe: 'అవతార్ 3', type: 'HOLLYWOOD', genre: 'Sci-Fi', year: 2025, days: 200, desc: 'పండోర ప్రపంచంలోని సరికొత్త అగ్ని తెగ విశేషాలు.', status: 'FILMING' },
  { id: '16', title: 'Minecraft Movie', titleTe: 'మైన్‌క్రాఫ్ట్', type: 'HOLLYWOOD', genre: 'Adventure', year: 2025, days: 85, desc: 'ప్రసిద్ధ గేమ్ మైన్‌క్రాఫ్ట్ ఆధారంగా వస్తున్న లైవ్ యాక్షన్ చిత్రం.', status: 'POST-PRODUCTION' },
  { id: '17', title: 'Squid Game S3', titleTe: 'స్క్విడ్ గేమ్ S3', type: 'KDRAMA', genre: 'Thriller', year: 2025, days: 220, desc: 'నెట్‌ఫ్లిక్స్ మోస్ట్ పాపులర్ థ్రిల్లర్ సిరీస్ చివరి సీజన్.', status: 'POST-PRODUCTION' },
  { id: '18', title: 'All of Us Are Dead S2', titleTe: 'ఆల్ ఆఫ్ అస్ ఆర్ డెడ్ S2', type: 'KDRAMA', genre: 'Horror', year: 2025, days: 260, desc: 'జోంబీ వైరస్ బారిన పడిన హైస్కూల్ విద్యార్థుల తదుపరి మనుగడ ప్రయాణం.', status: 'FILMING' },
  { id: '19', title: 'Solo Leveling S2', titleTe: 'సోలో లెవలింగ్ S2', type: 'ANIME', genre: 'Anime', year: 2025, days: 15, desc: 'అత్యంత ప్రజాదరణ పొందిన అనిమే రెండవ సీజన్.', status: 'TEASER OUT' },
  { id: '20', title: 'One Punch Man S3', titleTe: 'వన్ పంచ్ మ్యాన్ S3', type: 'ANIME', genre: 'Anime', year: 2025, days: 140, desc: 'సైతామా తిరిగి వస్తున్నాడు అద్భుతమైన ఫైట్స్ తో.', status: 'FILMING' },
  { id: '21', title: 'Stranger Things S5', titleTe: 'స్ట్రేంజర్ థింగ్స్ S5', type: 'SERIES', genre: 'Sci-Fi', year: 2025, days: 300, desc: 'నెట్‌ఫ్లిక్స్ పాపులర్ సిరీస్ ముగింపు ఘట్టం.', status: 'POST-PRODUCTION' },
  { id: '22', title: 'Wednesday S2', titleTe: 'వెడ్నెస్డే S2', type: 'SERIES', genre: 'Supernatural', year: 2025, days: 240, desc: 'నెవర్‌మోర్ అకాడమీలో వెడ్నెస్డే ఆడమ్స్ రెండవ సెమిస్టర్ అడ్వెంచర్స్.', status: 'FILMING' }
]

export default function UpcomingPage() {
  const [filter, setFilter] = useState('')
  const filtered = filter ? MOCK.filter(i => i.type === filter) : MOCK

  return (
    <div className="min-h-screen bg-dark pt-28 pb-16 select-none z-10">
      <div className="container-tv">
        <SectionHeader
          title="Upcoming Releases"
          titleTe="రాబోయేవి"
          icon="upcoming"
          description="Never miss a release. Follow real-time countdown clocks for highly anticipated movies, anime, and dramas."
        />

        {/* Filter controls */}
        <div className="flex gap-2.5 flex-wrap mb-10">
          {[
            { v: '', l: 'All', icon: '' },
            { v: 'MOVIE', l: 'Movies', icon: 'movies' },
            { v: 'ANIME', l: 'Anime', icon: 'anime' },
            { v: 'SERIES', l: 'Series', icon: 'series' },
            { v: 'KDRAMA', l: 'K-Drama', icon: 'kdrama' }
          ].map(tab => (
            <button
              key={tab.v}
              onClick={() => setFilter(tab.v)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold font-rajdhani tracking-wider uppercase transition-all duration-300 border flex items-center gap-2 ${
                filter === tab.v
                  ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400 shadow-[0_4px_20px_rgba(255,215,0,0.1)]'
                  : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-yellow-400/30 hover:text-yellow-400'
              }`}
            >
              {tab.icon && <PremiumIcon name={tab.icon} size={12} />}
              {tab.l}
            </button>
          ))}
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => {
              const color = TYPE_COLORS[item.type] || '#FFD700'
              const renderArt = UPCOMING_ARTWORKS[item.id] || UPCOMING_ARTWORKS['1']
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04, duration: 0.35 }}
                  className="bg-surface border border-white/5 rounded-2xl overflow-hidden hover:border-yellow-400/30 hover:-translate-y-1.5 transition-all duration-300 group shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between"
                  style={{ minHeight: '400px' }}
                >
                  {/* Art Panel */}
                  <div
                    className="h-44 flex items-center justify-center relative overflow-hidden flex-none"
                    style={{ background: `linear-gradient(135deg, ${color}20 0%, ${color}02 100%)` }}
                  >
                    {/* Star grid overlay pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                    {/* Glowing aura behind vector logo */}
                    <div 
                      className="absolute w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none transition-transform duration-500 group-hover:scale-125"
                      style={{ background: color }}
                    />

                    {/* SVG graphic symbol */}
                    <div className="z-10 group-hover:scale-105 transition-transform duration-500 relative">
                      {renderArt(color)}
                    </div>
                    
                    {/* Absolute type status */}
                    <div className="absolute top-3 left-3 z-20">
                      <span
                        className="text-[9px] font-black px-2.5 py-0.5 rounded-lg font-rajdhani border tracking-wider bg-black/80"
                        style={{ color, borderColor: `${color}25` }}
                      >
                        {item.type}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 z-20">
                      <span className="bg-black/85 border border-white/10 px-2.5 py-0.5 rounded-lg text-[8px] font-black font-rajdhani tracking-widest text-gray-300 uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        {item.status}
                      </span>
                    </div>

                    {/* Glass countdown banner */}
                    <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl py-2.5 px-3 z-20 shadow-lg">
                      <Countdown days={item.days} color={color} />
                    </div>
                  </div>

                  {/* Details Panel */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-white font-bold font-cinzel text-base leading-snug group-hover:text-yellow-400 transition-colors duration-300 truncate">
                        {item.title}
                      </h3>
                      <p className="font-telugu text-yellow-500/70 text-xs mt-0.5">{item.titleTe}</p>
                      <p className="font-telugu text-gray-400 text-xs leading-relaxed line-clamp-2 mt-2">
                        {item.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
                      <span className="text-gray-400 text-xs font-rajdhani font-bold uppercase tracking-wider">
                        {item.genre} • {item.year}
                      </span>
                      <button className="text-[10px] font-black font-rajdhani px-4 py-2.5 rounded-xl border border-yellow-400/25 text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400/40 active:scale-95 transition-all shadow-md">
                        Remind Me
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
