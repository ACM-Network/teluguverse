'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

interface Profile {
  id: string; username: string; displayName: string; avatar?: string | null
  bio?: string | null; role: string; createdAt: string
  _count: { reviews: number; watchlist: number; favorites: number; following: number; followers: number }
}

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/user/profile?username=${params.username}`)
      .then(r => { if (!r.ok) { setNotFound(true); setLoading(false); return null } return r.json() })
      .then(d => { if (d) setProfile(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params.username])

  if (loading) return (
    <div className="min-h-screen bg-dark flex items-center justify-center pt-16">
      <div className="text-yellow-400 font-cinzel animate-pulse">Loading profile...</div>
    </div>
  )

  if (notFound || !profile) return (
    <div className="min-h-screen bg-dark flex items-center justify-center pt-16 text-center">
      <div>
        <div className="text-7xl mb-4">👤</div>
        <h2 className="font-cinzel text-2xl font-bold text-white mb-2">User Not Found</h2>
        <p className="font-telugu text-gray-500 mb-6">వినియోగదారు కనుగొనబడలేదు</p>
        <Link href="/" className="px-6 py-3 rounded-xl font-bold font-rajdhani text-black text-sm"
          style={{background:'linear-gradient(135deg,#FFD700,#FFA500)'}}>Go Home</Link>
      </div>
    </div>
  )

  const joinDate = new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
  const initials = profile.displayName.slice(0,2).toUpperCase()

  const STATS = [
    {label:'Reviews',labelTe:'సమీక్షలు',value:profile._count.reviews},
    {label:'Watchlist',labelTe:'వాచ్‌లిస్ట్',value:profile._count.watchlist},
    {label:'Favorites',labelTe:'ఇష్టమైనవి',value:profile._count.favorites},
    {label:'Following',labelTe:'ఫాలో చేస్తున్నారు',value:profile._count.following},
    {label:'Followers',labelTe:'ఫాలోవర్లు',value:profile._count.followers},
  ]

  return (
    <div className="min-h-screen bg-dark pt-24 pb-16">
      {/* Banner */}
      <div className="h-48 relative overflow-hidden"
        style={{background:'linear-gradient(135deg,rgba(255,215,0,0.08),rgba(229,9,20,0.08),rgba(147,51,234,0.08))'}}>
        <div className="absolute inset-0" style={{background:'linear-gradient(to top,#070810 0%,transparent 100%)'}} />
      </div>
      <div className="container-tv -mt-20 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 mb-8">
          <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}}
            className="w-28 h-28 rounded-2xl flex items-center justify-center font-black text-3xl text-black shadow-2xl flex-none border-4 border-dark"
            style={{background:'linear-gradient(135deg,#FFD700,#FFA500)',boxShadow:'0 0 40px rgba(255,215,0,0.3)'}}>
            {profile.avatar ? <Image src={profile.avatar} alt={profile.displayName} width={112} height={112} className="w-full h-full object-cover rounded-2xl" /> : initials}
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-cinzel text-3xl font-black text-white">{profile.displayName}</h1>
              {profile.role !== 'USER' && (
                <span className="px-3 py-1 rounded-full text-xs font-bold font-rajdhani tracking-wide"
                  style={{background:'rgba(255,215,0,0.15)',color:'#FFD700',border:'1px solid rgba(255,215,0,0.3)'}}>
                  {profile.role}
                </span>
              )}
            </div>
            <p className="text-gray-500 font-rajdhani text-sm mt-1">@{profile.username} • Joined {joinDate}</p>
            {profile.bio && <p className="font-telugu text-gray-300 text-sm mt-2 max-w-xl">{profile.bio}</p>}
          </div>
          <button className="px-5 py-2.5 rounded-xl font-bold font-rajdhani text-sm border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 transition-all">
            Follow
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-10">
          {STATS.map(stat => (
            <div key={stat.label} className="bg-surface border border-border rounded-xl p-4 text-center hover:border-yellow-400/20 transition-all">
              <p className="font-cinzel text-2xl font-black text-yellow-400">{stat.value.toLocaleString()}</p>
              <p className="text-gray-400 text-xs font-bold font-rajdhani uppercase tracking-wide mt-1">{stat.label}</p>
              <p className="font-telugu text-gray-600 text-[10px] mt-0.5">{stat.labelTe}</p>
            </div>
          ))}
        </div>

        {/* Activity placeholder */}
        <div className="bg-surface border border-border rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">🎬</div>
          <h3 className="font-cinzel text-xl font-bold text-white mb-2">Activity Coming Soon</h3>
          <p className="font-telugu text-gray-500 text-sm">Reviews, ratings మరియు watchlist చూపించబడుతాయి</p>
        </div>
      </div>
    </div>
  )
}
