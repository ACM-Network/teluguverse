'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

const CATEGORIES = [
  { icon:'🎬',name:'Movies',nameTe:'సినిమాలు',count:'12,450+',href:'/search?type=MOVIE',color:'#E50914' },
  { icon:'⚡',name:'Anime',nameTe:'అనిమే',count:'8,200+',href:'/search?type=ANIME',color:'#a855f7' },
  { icon:'🌸',name:'K-Dramas',nameTe:'కొరియన్ డ్రామా',count:'3,100+',href:'/search?type=KDRAMA',color:'#ec4899' },
  { icon:'📺',name:'Web Series',nameTe:'వెబ్ సిరీస్',count:'5,600+',href:'/search?type=SERIES',color:'#3b82f6' },
  { icon:'🎭',name:'Cartoons',nameTe:'కార్టూన్లు',count:'4,300+',href:'/search?type=CARTOON',color:'#22c55e' },
  { icon:'🎪',name:'Hollywood',nameTe:'హాలీవుడ్',count:'9,800+',href:'/search?type=HOLLYWOOD',color:'#f59e0b' },
  { icon:'📱',name:'OTT Originals',nameTe:'OTT ఒరిజినల్స్',count:'2,100+',href:'/search?sort=popular',color:'#06b6d4' },
  { icon:'🏆',name:'Award Winners',nameTe:'అవార్డ్ విజేతలు',count:'1,200+',href:'/search?sort=rating',color:'#FFD700' },
]

export default function CategoriesGrid() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-7">
        <div className="w-1 h-7 rounded-full" style={{ background:'linear-gradient(180deg,#FFD700,#FFA500)' }} />
        <div>
          <h2 className="font-cinzel text-xl font-bold text-white tracking-wide">🎭 Browse by Category</h2>
          <span className="font-telugu text-xs text-gray-500 mt-0.5 block">వర్గం వారీగా చూడండి</span>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {CATEGORIES.map((cat, i) => (
          <motion.div key={cat.name} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}>
            <Link href={cat.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface border border-border hover:border-yellow-400/30 hover:bg-surface-2 transition-all group text-center">
              <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
              <span className="text-white text-xs font-bold font-rajdhani">{cat.name}</span>
              <span className="font-telugu text-gray-600 text-[10px]">{cat.nameTe}</span>
              <span className="font-bold text-[11px] font-rajdhani" style={{ color:cat.color }}>{cat.count}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
