'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { ContentItem } from '@/types'

const TYPE_COLORS: Record<string,string> = { MOVIE:'#E50914',ANIME:'#a855f7',SERIES:'#3b82f6',KDRAMA:'#ec4899',CARTOON:'#22c55e',HOLLYWOOD:'#f59e0b',DOCUMENTARY:'#06b6d4' }
const TYPE_EMOJIS: Record<string,string> = { MOVIE:'🎬',ANIME:'⚡',SERIES:'📺',KDRAMA:'🌸',CARTOON:'🎭',HOLLYWOOD:'🎪',DOCUMENTARY:'📽️' }

function Countdown({ days }: { days: number }) {
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
    <div className="flex gap-3 justify-center mt-3">
      {[{v:d,l:'Days'},{v:h,l:'Hrs'},{v:m,l:'Min'},{v:s,l:'Sec'}].map(({v,l}) => (
        <div key={l} className="text-center">
          <span className="font-cinzel text-2xl font-black text-yellow-400 block leading-none">{String(v).padStart(2,'0')}</span>
          <span className="text-gray-600 text-[10px] uppercase tracking-wider font-rajdhani">{l}</span>
        </div>
      ))}
    </div>
  )
}

const MOCK: Array<{id:string;title:string;titleTe:string;type:string;genre:string;year:number;days:number;emoji:string;desc:string}> = [
  {id:'1',title:'Ramayana',titleTe:'రామాయణం',type:'MOVIE',genre:'Mythology',year:2025,days:45,emoji:'🏹',desc:'మహాకావ్యం రామాయణం తెలుగు వెండితెరపై అద్భుతంగా రానుంది.'},
  {id:'2',title:'Coolie',titleTe:'కూలీ',type:'MOVIE',genre:'Action',year:2025,days:23,emoji:'🚂',desc:'రజినీకాంత్ అభినయించే ఈ యాక్షన్ చిత్రం అందరినీ మెప్పించనుంది.'},
  {id:'3',title:'Dragon Ball DAIMA S2',titleTe:'డ్రాగన్ బాల్ DAIMA',type:'ANIME',genre:'Anime',year:2025,days:7,emoji:'🔵',desc:'గోకు మరియు అతని మిత్రులు తిరిగి వస్తున్నారు కొత్త అడ్వెంచర్‌తో.'},
  {id:'4',title:'House of Dragon S3',titleTe:'హౌస్ ఆఫ్ ది డ్రాగన్',type:'SERIES',genre:'Fantasy',year:2025,days:89,emoji:'🐉',desc:'టార్గర్యెన్ రాజ వంశంలో అంతర్యుద్ధం మరింత తీవ్రమవుతోంది.'},
  {id:'5',title:'Pushpa 3',titleTe:'పుష్ప 3',type:'MOVIE',genre:'Action',year:2026,days:380,emoji:'🌹',desc:'పుష్పరాజ్ యొక్క సామ్రాజ్యం మరింత విస్తరిస్తుంది. పోరాటం కొనసాగుతుంది.'},
  {id:'6',title:'Kalki 2898 Part 2',titleTe:'కల్కి 2898 పార్ట్ 2',type:'MOVIE',genre:'Sci-Fi',year:2026,days:545,emoji:'⚡',desc:'కల్కి అవతారం మరింత శక్తివంతంగా తిరిగి వస్తాడు. చీకటి శక్తులు తయారవుతున్నాయి.'},
  {id:'7',title:'Jujutsu Kaisen Season 3',titleTe:'జూజుత్సు కైసెన్ S3',type:'ANIME',genre:'Action Anime',year:2025,days:14,emoji:'👊',desc:'గోజో సతోరు యొక్క శిష్యులు మరింత శక్తివంతంగా అవుతున్నారు.'},
  {id:'8',title:'Goblin Season 2',titleTe:'గాబ్లిన్ సీజన్ 2',type:'KDRAMA',genre:'Fantasy',year:2025,days:120,emoji:'🔮',desc:'పూర్ణమైన పునర్జన్మ తర్వాత గాబ్లిన్ మళ్ళీ ప్రేమలో పడతాడు.'},
]

export default function UpcomingPage() {
  const [filter, setFilter] = useState('')
  const filtered = filter ? MOCK.filter(i => i.type === filter) : MOCK
  return (
    <div className="min-h-screen bg-dark pt-24 pb-16">
      <div className="container-tv">
        <div className="mb-10">
          <h1 className="font-cinzel text-4xl font-black text-white mb-2">📅 Upcoming Releases</h1>
          <p className="font-telugu text-gray-500">రాబోయే విడుదలలు – వేచి చూడండి!</p>
        </div>
        <div className="flex gap-2 flex-wrap mb-8">
          {[{v:'',l:'All'},{v:'MOVIE',l:'🎬 Movies'},{v:'ANIME',l:'⚡ Anime'},{v:'SERIES',l:'📺 Series'},{v:'KDRAMA',l:'🌸 K-Drama'}].map(tab => (
            <button key={tab.v} onClick={() => setFilter(tab.v)}
              className={`px-4 py-2 rounded-lg text-xs font-bold font-rajdhani tracking-wide transition-all border ${filter===tab.v?'bg-yellow-500/20 border-yellow-500/50 text-yellow-400':'bg-surface border-border text-gray-400 hover:border-yellow-400/30 hover:text-yellow-400'}`}>
              {tab.l}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((item, i) => (
            <motion.div key={item.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
              className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-yellow-400/30 hover:-translate-y-1 transition-all group">
              <div className="h-40 flex items-center justify-center relative"
                style={{background:`linear-gradient(135deg,${TYPE_COLORS[item.type]||'#FFD700'}18,${TYPE_COLORS[item.type]||'#FFD700'}05)`}}>
                <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{item.emoji}</span>
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded font-rajdhani"
                    style={{background:`${TYPE_COLORS[item.type]}25`,color:TYPE_COLORS[item.type],border:`1px solid ${TYPE_COLORS[item.type]}40`}}>
                    {item.type}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-sm rounded-xl py-2 px-2">
                  <Countdown days={item.days} />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-bold font-cinzel text-base mb-1">{item.title}</h3>
                <p className="font-telugu text-yellow-400/70 text-sm mb-2">{item.titleTe}</p>
                <p className="font-telugu text-gray-500 text-xs leading-6 line-clamp-2 mb-3">{item.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs font-rajdhani font-semibold">{item.genre} • {item.year}</span>
                  <button className="text-xs font-bold font-rajdhani px-3 py-1.5 rounded-lg border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 transition-all">
                    Remind Me
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
