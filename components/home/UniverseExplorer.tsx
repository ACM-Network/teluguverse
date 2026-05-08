'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

const UNIVERSES = [
  { name:'Marvel Cinematic Universe',nameTe:'మార్వెల్ యూనివర్స్',count:'33 films',emoji:'🦸',grad:'linear-gradient(135deg,rgba(220,38,38,0.3),rgba(180,83,9,0.2))',border:'rgba(220,38,38,0.4)' },
  { name:'DC Universe',nameTe:'DC యూనివర్స్',count:'15 films',emoji:'🦇',grad:'linear-gradient(135deg,rgba(30,64,175,0.3),rgba(30,58,95,0.2))',border:'rgba(30,64,175,0.4)' },
  { name:'Rajamouli Universe',nameTe:'రాజమౌళి యూనివర్స్',count:'8 films',emoji:'👑',grad:'linear-gradient(135deg,rgba(120,53,15,0.3),rgba(146,64,14,0.2))',border:'rgba(245,158,11,0.4)' },
  { name:'One Piece World',nameTe:'వన్ పీస్ జగత్తు',count:'1000+ eps',emoji:'🏴‍☠️',grad:'linear-gradient(135deg,rgba(245,158,11,0.3),rgba(146,64,14,0.2))',border:'rgba(245,158,11,0.4)' },
  { name:'Monsterverse',nameTe:'మాన్స్టర్వర్స్',count:'6 films',emoji:'🦎',grad:'linear-gradient(135deg,rgba(22,101,51,0.3),rgba(20,83,45,0.2))',border:'rgba(34,197,94,0.4)' },
  { name:'Telugu Cinematic',nameTe:'తెలుగు సినిమా',count:'12+ films',emoji:'🎬',grad:'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(67,56,202,0.2))',border:'rgba(124,58,237,0.4)' },
]

export default function UniverseExplorer() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-7">
        <div className="w-1 h-7 rounded-full" style={{ background:'linear-gradient(180deg,#FFD700,#FFA500)' }} />
        <div>
          <h2 className="font-cinzel text-xl font-bold text-white tracking-wide">🌌 Universe Explorer</h2>
          <span className="font-telugu text-xs text-gray-500 mt-0.5 block">సినిమాటిక్ యూనివర్స్</span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {UNIVERSES.map((u, i) => (
          <motion.div key={u.name} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}>
            <Link href="/search" className="block relative rounded-xl overflow-hidden aspect-video cursor-pointer group border transition-all hover:-translate-y-1 hover:shadow-2xl"
              style={{ background:u.grad, borderColor:u.border }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl opacity-25 group-hover:opacity-50 group-hover:scale-110 transition-all duration-300">{u.emoji}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3" style={{ background:'linear-gradient(to top,rgba(7,8,16,0.9),transparent)' }}>
                <p className="font-cinzel text-[11px] font-bold text-white leading-tight">{u.name}</p>
                <p className="font-telugu text-gray-500 text-[9px] mt-0.5">{u.nameTe}</p>
                <p className="text-[10px] font-bold font-rajdhani mt-0.5" style={{ color:u.border }}>{u.count}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
