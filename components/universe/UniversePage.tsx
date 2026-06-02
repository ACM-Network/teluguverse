'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import OttBadge from '@/components/ui/OttBadge'
import { PLACEHOLDER_POSTER } from '@/lib/utils'

const TYPE_COLORS: Record<string, string> = {
  MOVIE: '#E50914',
  ANIME: '#A855F7',
  SERIES: '#3B82F6',
  KDRAMA: '#EC4899',
  CARTOON: '#22C55E',
  HOLLYWOOD: '#F59E0B',
  DOCUMENTARY: '#06B6D4',
}

const MCU_TIMELINE_ORDER = [
  'captain-america-the-first-avenger',
  'captain-marvel',
  'iron-man',
  'iron-man-2',
  'the-incredible-hulk',
  'thor',
  'the-avengers',
  'iron-man-3',
  'thor-the-dark-world',
  'captain-america-the-winter-soldier',
  'guardians-of-the-galaxy',
  'guardians-of-the-galaxy-vol-2',
  'avengers-age-of-ultron',
  'ant-man',
  'captain-america-civil-war',
  'black-widow',
  'black-panther',
  'spider-man-homecoming',
  'doctor-strange',
  'thor-ragnarok',
  'ant-man-and-the-wasp',
  'avengers-infinity-war',
  'avengers-endgame',
  'loki',
  'wandavision',
  'shang-chi-and-the-legend-of-the-ten-rings',
  'the-falcon-and-the-winter-soldier',
  'spider-man-far-from-home',
  'rose-hill',
  'eternals',
  'spider-man-no-way-home',
  'hawkeye',
  'doctor-strange-in-the-multiverse-of-madness',
  'moon-knight',
  'black-panther-wakanda-forever',
  'she-hulk-attorney-at-law',
  'ms-marvel',
  'thor-love-and-thunder',
  'secret-invasion',
  'ant-man-and-the-wasp-quantumania',
  'guardians-of-the-galaxy-vol-3',
  'the-marvels',
  'echo',
  'deadpool-wolverine',
  'daredevil-born-again',
  'ironheart',
  'vision-quest',
  'the-fantastic-four-first-steps',
  'avengers-doomsday',
  'avengers-secret-wars',
]

const DC_TIMELINE_ORDER = [
  'wonder-woman',
  'wonder-woman-1984',
  'man-of-steel',
  'batman-v-superman-dawn-of-justice',
  'suicide-quads',
  'suicide-squad',
  'justice-league',
  'zack-snyders-justice-league',
  'aquaman',
  'shazam',
  'birds-of-prey',
  'the-suicide-squad',
  'peacemaker',
  'black-adam',
  'shazam-fury-of-the-gods',
  'the-flash',
  'blue-beetle',
  'aquaman-and-the-lost-kingdom'
]

const LCU_TIMELINE_ORDER = [
  'kaithi',
  'vikram',
  'leo',
  'kaithi-2',
  'rolex',
  'vikram-2'
]

const BAAHUBALI_TIMELINE_ORDER = [
  'baahubali-the-beginning',
  'baahubali-2-the-conclusion',
  'baahubali-the-eternal-war'
]

const MONSTERVERSE_TIMELINE_ORDER = [
  'kong-skull-island',
  'godzilla-2014',
  'monarch-legacy-of-monsters',
  'godzilla-king-of-the-monsters',
  'godzilla-vs-kong',
  'godzilla-x-kong-the-new-empire'
]

// Custom static guide data for One Piece watch order
const ONE_PIECE_ORDER = [
  { title: 'East Blue Saga', type: 'canon', episodes: 'Episodes 1-61', year: 1999, desc: 'Luffy begins his journey, recruits Zoro, Nami, Usopp, and Sanji, and sets sail for the Grand Line.', recOrder: 1, relOrder: 2 },
  { title: 'Defeat Him! The Pirate Ganzack', type: 'ova', episodes: 'OVA (Pre-Series)', year: 1998, desc: 'The first ever animated adaptation of One Piece, produced by Production I.G before the TV series.', recOrder: 2, relOrder: 1 },
  { title: 'One Piece: The Movie', type: 'movie', episodes: 'Movie 1', year: 2000, desc: 'The Straw Hats clash with El Drago for the legendary gold of Woonan.', recOrder: 3, relOrder: 3 },
  { title: 'Alabasta Saga', type: 'canon', episodes: 'Episodes 62-135', year: 2001, desc: 'The Straw Hats help Princess Vivi save her desert kingdom of Alabasta from Crocodile and Baroque Works.', recOrder: 4, relOrder: 4 },
  { title: 'Goat Island & Ruluka Island Arcs', type: 'filler', episodes: 'Episodes 136-143', year: 2002, desc: 'Short lighthearted filler adventures involving a pirate goat keeper and a mysterious rainbow mist.', recOrder: 5, relOrder: 5 },
  { title: 'Dead End Adventure', type: 'movie', episodes: 'Movie 4', year: 2003, desc: 'The Straw Hats participate in a secret, lawless race between pirate crews.', recOrder: 6, relOrder: 6 },
  { title: 'Skypiea Saga', type: 'canon', episodes: 'Episodes 144-206', year: 2003, desc: 'The crew finds a way to the legendary island in the clouds, Skypiea, and battles the self-proclaimed God Enel.', recOrder: 7, relOrder: 7 },
  { title: 'G-8 Fortress Arc', type: 'filler', episodes: 'Episodes 207-219', year: 2004, desc: 'Widely considered the best filler arc in anime history, where the Straw Hats must escape from a high-security Marine base.', recOrder: 8, relOrder: 8 },
  { title: 'Water 7 & Enies Lobby Saga', type: 'canon', episodes: 'Episodes 220-325', year: 2005, desc: 'The Straw Hats face internal division, Robin is taken by CP9, and the crew declares war on the World Government.', recOrder: 9, relOrder: 9 },
  { title: 'Thriller Bark Saga', type: 'canon', episodes: 'Episodes 326-384', year: 2007, desc: 'The crew enters the haunted Florian Triangle, recruits Brook, and battles Warlord Gecko Moria.', recOrder: 10, relOrder: 10 },
  { title: 'Sabaody Archipelago & Summit War Saga', type: 'canon', episodes: 'Episodes 385-516', year: 2008, desc: 'The crew is separated by Kuma. Luffy goes to Impel Down and Marineford to save his brother Ace.', recOrder: 11, relOrder: 11 },
  { title: 'One Piece Film: Strong World', type: 'movie', episodes: 'Movie 10', year: 2009, desc: 'Written by Eiichiro Oda himself, featuring the legendary pirate Golden Lion Shiki.', recOrder: 12, relOrder: 12 },
  { title: 'Fish-Man Island Saga', type: 'canon', episodes: 'Episodes 517-574', year: 2011, desc: 'After a 2-year timeskip, the reunited crew journeys to the bottom of the ocean to Fish-Man Island.', recOrder: 13, relOrder: 13 },
  { title: 'Punk Hazard & Dressrosa Saga', type: 'canon', episodes: 'Episodes 575-746', year: 2012, desc: 'Luffy forms an alliance with Trafalgar Law to destroy Caesar Clown\'s lab and free Dressrosa from Doflamingo.', recOrder: 14, relOrder: 14 },
  { title: 'One Piece Film: Z', type: 'movie', episodes: 'Movie 12', year: 2012, desc: 'The crew clashes with former Marine Admiral Z, who plans to destroy the New World along with all pirates.', recOrder: 15, relOrder: 15 },
  { title: 'Zou & Whole Cake Island Saga', type: 'canon', episodes: 'Episodes 747-889', year: 2016, desc: 'The crew heads to Big Mom\'s territory to rescue Sanji from an arranged marriage and uncover the Road Poneglyphs.', recOrder: 16, relOrder: 16 },
  { title: 'One Piece Film: Gold', type: 'movie', episodes: 'Movie 13', year: 2016, desc: 'The crew visits the colossal gold entertainment ship Gran Tesoro, ruled by the corrupt Gild Tesoro.', recOrder: 17, relOrder: 17 },
  { title: 'Wano Country Saga', type: 'canon', episodes: 'Episodes 890-1085', year: 2019, desc: 'The alliance battles Kaido and Big Mom in Wano to free the land and open its borders.', recOrder: 18, relOrder: 18 },
  { title: 'One Piece Stampede', type: 'movie', episodes: 'Movie 14', year: 2019, desc: 'A massive crossover movie featuring the Pirate Festival, where pirates search for a log log to Laugh Tale.', recOrder: 19, relOrder: 19 },
  { title: 'One Piece Film: Red', type: 'movie', episodes: 'Movie 15', year: 2022, desc: 'Luffy meets Uta, the world\'s most beloved singer, who is actually Shanks\' daughter.', recOrder: 20, relOrder: 20 },
  { title: 'Egghead Arc', type: 'canon', episodes: 'Episodes 1086+', year: 2024, desc: 'The Straw Hats arrive at the island of the future, meeting the legendary Dr. Vegapunk and discovering void history.', recOrder: 21, relOrder: 21 },
]

interface UniversePageProps {
  universe: {
    id: string
    name: string
    nameTe: string
    description: string
    logo?: string
    color?: string
    contents: any[]
  }
  recommendations: any[]
}

export default function UniversePage({ universe, recommendations }: UniversePageProps) {
  const [activeTab, setActiveTab] = useState<'release' | 'timeline'>('release')
  
  // States specific to One Piece watch order guide
  const [onePieceOrderMode, setOnePieceOrderMode] = useState<'recommended' | 'release'>('recommended')
  const [opFilters, setOpFilters] = useState<Record<string, boolean>>({
    canon: true,
    movie: true,
    special: true,
    ova: true,
    filler: true,
  })

  const themeColor = universe.color || '#FFD700'
  const rawContents = universe.contents || []

  // Sorting logics
  const getTimelineSorted = () => {
    if (universe.id === 'mcu') {
      return [...rawContents].sort((a, b) => {
        const idxA = MCU_TIMELINE_ORDER.indexOf(a.content.slug)
        const idxB = MCU_TIMELINE_ORDER.indexOf(b.content.slug)
        if (idxA !== -1 && idxB !== -1) return idxA - idxB
        if (idxA !== -1) return -1
        if (idxB !== -1) return 1
        return (a.order || 0) - (b.order || 0)
      })
    }
    if (universe.id === 'dc') {
      return [...rawContents].sort((a, b) => {
        const idxA = DC_TIMELINE_ORDER.indexOf(a.content.slug)
        const idxB = DC_TIMELINE_ORDER.indexOf(b.content.slug)
        if (idxA !== -1 && idxB !== -1) return idxA - idxB
        if (idxA !== -1) return -1
        if (idxB !== -1) return 1
        return (a.order || 0) - (b.order || 0)
      })
    }
    if (universe.id === 'lcu') {
      return [...rawContents].sort((a, b) => {
        const idxA = LCU_TIMELINE_ORDER.indexOf(a.content.slug)
        const idxB = LCU_TIMELINE_ORDER.indexOf(b.content.slug)
        if (idxA !== -1 && idxB !== -1) return idxA - idxB
        if (idxA !== -1) return -1
        if (idxB !== -1) return 1
        return (a.order || 0) - (b.order || 0)
      })
    }
    if (universe.id === 'baahubali') {
      return [...rawContents].sort((a, b) => {
        const idxA = BAAHUBALI_TIMELINE_ORDER.indexOf(a.content.slug)
        const idxB = BAAHUBALI_TIMELINE_ORDER.indexOf(b.content.slug)
        if (idxA !== -1 && idxB !== -1) return idxA - idxB
        if (idxA !== -1) return -1
        if (idxB !== -1) return 1
        return (a.order || 0) - (b.order || 0)
      })
    }
    if (universe.id === 'monsterverse') {
      return [...rawContents].sort((a, b) => {
        const idxA = MONSTERVERSE_TIMELINE_ORDER.indexOf(a.content.slug)
        const idxB = MONSTERVERSE_TIMELINE_ORDER.indexOf(b.content.slug)
        if (idxA !== -1 && idxB !== -1) return idxA - idxB
        if (idxA !== -1) return -1
        if (idxB !== -1) return 1
        return (a.order || 0) - (b.order || 0)
      })
    }
    return [...rawContents].sort((a, b) => (a.order || 0) - (b.order || 0))
  }

  const getReleaseSorted = () => {
    return [...rawContents].sort((a, b) => {
      const dateA = a.content.releaseDate ? new Date(a.content.releaseDate).getTime() : (a.content.year || 0) * 100000
      const dateB = b.content.releaseDate ? new Date(b.content.releaseDate).getTime() : (b.content.year || 0) * 100000
      return dateA - dateB
    })
  }

  const sortedContents = activeTab === 'release' ? getReleaseSorted() : getTimelineSorted()

  // Stats calculation
  const movieCount = rawContents.filter(x => x.content.type === 'MOVIE' || x.content.type === 'HOLLYWOOD').length
  const seriesCount = rawContents.filter(x => x.content.type === 'SERIES' || x.content.type === 'ANIME').length
  const averageRating = rawContents.reduce((acc, curr) => acc + (curr.content.imdbRating || 0), 0) / (rawContents.filter(x => x.content.imdbRating).length || 1)

  // Custom One Piece viewing guide rendering
  if (universe.id === 'onepiece') {
    const sortedOnePiece = [...ONE_PIECE_ORDER].sort((a, b) => {
      return onePieceOrderMode === 'recommended' ? a.recOrder - b.recOrder : a.relOrder - b.relOrder
    })

    const filteredOnePiece = sortedOnePiece.filter(item => opFilters[item.type])

    return (
      <div className="min-h-screen bg-dark pt-28 pb-20 select-none relative overflow-hidden">
        {/* Decorative Blur Backgrounds */}
        <div 
          className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[150px] opacity-10 pointer-events-none"
          style={{ backgroundColor: themeColor }}
        />

        <div className="container-tv relative z-10">
          {/* Header Block */}
          <div className="relative rounded-3xl overflow-hidden bg-surface border border-white/5 p-8 sm:p-10 mb-12 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
            <div 
              className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ background: themeColor }}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <span 
                  className="text-xs font-bold tracking-[0.2em] uppercase px-3.5 py-1.5 rounded-lg border bg-black/40 font-rajdhani"
                  style={{ color: themeColor, borderColor: `${themeColor}30` }}
                >
                  Cinematic viewing guide
                </span>
                <h1 className="text-3xl sm:text-5xl font-black font-cinzel text-white leading-tight">
                  One Piece Viewing Order
                </h1>
                <p className="font-telugu text-lg text-yellow-500/80 leading-none">
                  వన్ పీస్ వీక్షణ మార్గదర్శి
                </p>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-rajdhani">
                  Navigate the gargantuan journey of Monkey D. Luffy and the Straw Hat Pirates. Switch between recommended storyline progression and release dates, and filter between canon arcs, films, and OVAs.
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-4 bg-black/45 border border-white/5 p-5 rounded-2xl md:w-80 flex-none backdrop-blur-md">
                <div className="text-center">
                  <span className="text-gray-500 text-[9px] uppercase tracking-wider block font-bold font-rajdhani">Canon Sagas</span>
                  <span className="text-xl sm:text-2xl font-black text-white font-cinzel mt-1 block">10</span>
                </div>
                <div className="text-center border-x border-white/5">
                  <span className="text-gray-500 text-[9px] uppercase tracking-wider block font-bold font-rajdhani">Movies</span>
                  <span className="text-xl sm:text-2xl font-black text-white font-cinzel mt-1 block">15</span>
                </div>
                <div className="text-center">
                  <span className="text-gray-500 text-[9px] uppercase tracking-wider block font-bold font-rajdhani">Episodes</span>
                  <span className="text-xl sm:text-2xl font-black text-yellow-400 font-cinzel mt-1 block">1100+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Guides & Filters */}
          <div className="bg-surface border border-white/5 rounded-2xl p-6 mb-10 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              {/* Order Mode Toggle */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-black font-rajdhani uppercase tracking-widest text-gray-500 block">Watch Order Mode</label>
                <div className="flex bg-black/30 p-1.5 rounded-xl border border-white/5 w-fit">
                  <button
                    onClick={() => setOnePieceOrderMode('recommended')}
                    className={`px-5 py-2.5 rounded-lg text-xs font-bold font-rajdhani tracking-wider uppercase transition-all ${
                      onePieceOrderMode === 'recommended'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/25 shadow-md'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Recommended Order
                  </button>
                  <button
                    onClick={() => setOnePieceOrderMode('release')}
                    className={`px-5 py-2.5 rounded-lg text-xs font-bold font-rajdhani tracking-wider uppercase transition-all ${
                      onePieceOrderMode === 'release'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/25 shadow-md'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Release Order
                  </button>
                </div>
              </div>

              {/* Filters checkboxes */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-black font-rajdhani uppercase tracking-widest text-gray-500 block">Filter Content Types</label>
                <div className="flex flex-wrap gap-2.5">
                  {Object.keys(opFilters).map((type) => (
                    <button
                      key={type}
                      onClick={() => setOpFilters(prev => ({ ...prev, [type]: !prev[type] }))}
                      className={`px-4 py-2 rounded-xl text-xs font-bold font-rajdhani uppercase tracking-wide border transition-all ${
                        opFilters[type]
                          ? 'bg-white/10 border-white/10 text-white shadow-sm'
                          : 'bg-transparent border-white/5 text-gray-500 hover:border-white/10'
                      }`}
                    >
                      <span className="inline-block w-2.5 h-2.5 rounded-full mr-2" style={{
                        backgroundColor: 
                          type === 'canon' ? '#A855F7' : 
                          type === 'movie' ? '#E50914' : 
                          type === 'filler' ? '#f59e0b' : 
                          type === 'ova' ? '#06B6D4' : '#22C55E'
                      }} />
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Guide Timeline List */}
          <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-[11px] before:sm:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
            <AnimatePresence mode="popLayout">
              {filteredOnePiece.map((item, idx) => {
                const color = 
                  item.type === 'canon' ? '#A855F7' : 
                  item.type === 'movie' ? '#E50914' : 
                  item.type === 'filler' ? '#f59e0b' : 
                  item.type === 'ova' ? '#06B6D4' : '#22C55E';
                  
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, delay: Math.min(idx * 0.03, 0.4) }}
                    className="relative group"
                  >
                    {/* Dot */}
                    <span 
                      className="absolute -left-[30px] sm:-left-[46px] top-4 w-4 h-4 sm:w-6 sm:h-6 rounded-full border bg-dark z-20 flex items-center justify-center transition-all duration-300 group-hover:scale-125"
                      style={{ borderColor: color, boxShadow: `0 0 10px ${color}40` }}
                    >
                      <span className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    </span>

                    {/* Timeline card */}
                    <div className="bg-surface border border-white/5 rounded-2xl p-5 md:p-6 hover:border-yellow-400/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span 
                            className="text-[10px] font-black font-rajdhani uppercase tracking-widest px-2.5 py-1 rounded bg-black/40 border"
                            style={{ color, borderColor: `${color}35` }}
                          >
                            {item.type}
                          </span>
                          <span className="text-gray-400 text-xs font-bold font-rajdhani">{item.episodes}</span>
                          <span className="text-gray-600 font-bold">•</span>
                          <span className="text-gray-400 text-xs font-bold font-rajdhani">{item.year}</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 font-rajdhani uppercase">
                          Order: #{onePieceOrderMode === 'recommended' ? item.recOrder : item.relOrder}
                        </span>
                      </div>

                      <h3 className="text-white text-lg sm:text-xl font-bold font-rajdhani mb-2 group-hover:text-yellow-400 transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-rajdhani">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Recommendations link for anime */}
          {recommendations.length > 0 && (
            <div className="mt-20">
              <SectionHeader
                title="Anime Recommendations"
                titleTe="సిఫార్సులు"
                icon="favorite"
                description="Explore other high-quality action and fantasy discoveries"
              />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                {recommendations.map((item) => (
                  <Link 
                    key={item.id} 
                    href={`/content/${item.slug}`}
                    className="bg-surface border border-white/5 rounded-2xl overflow-hidden hover:border-yellow-400/30 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between shadow-[0_8px_25px_rgba(0,0,0,0.5)]"
                  >
                    <div className="aspect-[2/3] w-full overflow-hidden bg-black/25 relative">
                      <img
                        src={item.poster || PLACEHOLDER_POSTER}
                        alt={item.titleEnglish}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = PLACEHOLDER_POSTER }}
                      />
                      <div className="absolute top-2 left-2">
                        <span className="text-[9px] font-black px-2 py-0.5 rounded bg-black/80 font-rajdhani border border-white/5" style={{ color: TYPE_COLORS[item.type] || '#FFD700' }}>
                          {item.type}
                        </span>
                      </div>
                    </div>
                    <div className="p-3.5 space-y-1">
                      <h4 className="text-white text-xs font-bold font-rajdhani truncate group-hover:text-yellow-400 transition-colors">
                        {item.titleEnglish}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] text-gray-500 font-rajdhani">
                        <span>{item.year}</span>
                        {item.imdbRating && <span className="text-yellow-400 font-bold">★ {item.imdbRating.toFixed(1)}</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Fallback / standard database universes list view
  return (
    <div className="min-h-screen bg-dark pt-28 pb-20 select-none relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div 
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[150px] opacity-10 pointer-events-none"
        style={{ backgroundColor: themeColor }}
      />

      <div className="container-tv relative z-10">
        {/* Header Block */}
        <div className="relative rounded-3xl overflow-hidden bg-surface border border-white/5 p-8 sm:p-10 mb-12 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
          <div 
            className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ background: themeColor }}
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <span 
                className="text-xs font-bold tracking-[0.2em] uppercase px-3.5 py-1.5 rounded-lg border bg-black/40 font-rajdhani"
                style={{ color: themeColor, borderColor: `${themeColor}30` }}
              >
                Cinematic Universe
              </span>
              <h1 className="text-3xl sm:text-5xl font-black font-cinzel text-white leading-tight">
                {universe.name}
              </h1>
              {universe.nameTe && (
                <p className="font-telugu text-lg text-yellow-500/80 leading-none">
                  {universe.nameTe}
                </p>
              )}
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-rajdhani">
                {universe.description}
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-4 bg-black/45 border border-white/5 p-5 rounded-2xl md:w-80 flex-none backdrop-blur-md">
              <div className="text-center">
                <span className="text-gray-500 text-[9px] uppercase tracking-wider block font-bold font-rajdhani">Titles</span>
                <span className="text-xl sm:text-2xl font-black text-white font-cinzel mt-1 block">{rawContents.length}</span>
              </div>
              <div className="text-center border-x border-white/5">
                <span className="text-gray-500 text-[9px] uppercase tracking-wider block font-bold font-rajdhani">Movies</span>
                <span className="text-xl sm:text-2xl font-black text-white font-cinzel mt-1 block">{movieCount}</span>
              </div>
              <div className="text-center">
                <span className="text-gray-500 text-[9px] uppercase tracking-wider block font-bold font-rajdhani">IMDb Avg</span>
                <span className="text-xl sm:text-2xl font-black text-yellow-400 font-cinzel mt-1 block">★{averageRating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10 pb-5 border-b border-white/5">
          <div className="flex gap-2.5">
            <button
              onClick={() => setActiveTab('release')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold font-rajdhani tracking-wider uppercase transition-all border ${
                activeTab === 'release'
                  ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400 shadow-[0_4px_20px_rgba(255,215,0,0.1)]'
                  : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-yellow-400/30 hover:text-yellow-400'
              }`}
            >
              Release Order
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold font-rajdhani tracking-wider uppercase transition-all border ${
                activeTab === 'timeline'
                  ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400 shadow-[0_4px_20px_rgba(255,215,0,0.1)]'
                  : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-yellow-400/30 hover:text-yellow-400'
              }`}
            >
              Chronological Order
            </button>
          </div>
          <span className="text-xs text-gray-500 font-bold font-rajdhani tracking-widest uppercase">
            {sortedContents.length} Items Listed
          </span>
        </div>

        {/* Timeline List */}
        <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-[11px] before:sm:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
          <AnimatePresence mode="popLayout">
            {sortedContents.map((item, idx) => {
              const content = item.content
              const color = TYPE_COLORS[content.type] || themeColor
              const phaseText = item.phase ? `${item.phase}` : `Step ${idx + 1}`
              const isUpcoming = content.status === 'UPCOMING'
              const streams = content.streamingLinks || []

              return (
                <motion.div
                  key={content.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, delay: Math.min(idx * 0.03, 0.5) }}
                  className="relative group"
                >
                  {/* Outer dot indicator */}
                  <span 
                    className="absolute -left-[30px] sm:-left-[46px] top-4 w-4 h-4 sm:w-6 sm:h-6 rounded-full border bg-dark z-20 flex items-center justify-center transition-all duration-300 group-hover:scale-125"
                    style={{ borderColor: color, boxShadow: `0 0 10px ${color}40` }}
                  >
                    <span className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  </span>

                  {/* Main content row card */}
                  <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden hover:border-yellow-400/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 flex flex-col md:flex-row gap-5 p-5 md:p-6">
                    {/* Poster */}
                    <Link href={`/content/${content.slug}`} className="w-full md:w-36 aspect-[2/3] rounded-xl overflow-hidden bg-black/40 border border-white/5 flex-none group-hover:scale-[1.02] transition-all duration-500 relative">
                      <img
                        src={content.poster || PLACEHOLDER_POSTER}
                        alt={content.titleEnglish}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = PLACEHOLDER_POSTER }}
                      />
                      {isUpcoming && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <span className="text-[10px] font-black font-rajdhani text-yellow-400 tracking-widest border border-yellow-400/25 px-2.5 py-1 rounded bg-yellow-400/5">
                            UPCOMING
                          </span>
                        </div>
                      )}
                    </Link>

                    {/* Metadata Detail */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-bold font-rajdhani uppercase">
                          <span style={{ color }}>{content.type}</span>
                          <span className="text-gray-600">•</span>
                          <span className="text-gray-400">{content.year || 'N/A'}</span>
                          <span className="text-gray-600">•</span>
                          <span className="text-gray-400" style={{ color }}>{phaseText}</span>
                          {content.imdbRating && (
                            <>
                              <span className="text-gray-600">•</span>
                              <span className="text-yellow-400">★ {content.imdbRating.toFixed(1)}</span>
                            </>
                          )}
                        </div>

                        <Link href={`/content/${content.slug}`}>
                          <h3 className="text-white text-lg sm:text-xl font-bold font-rajdhani group-hover:text-yellow-400 transition-colors truncate">
                            {content.titleEnglish}
                          </h3>
                        </Link>

                        {content.titleTelugu && (
                          <p className="font-telugu text-sm text-yellow-500/70 leading-none">
                            {content.titleTelugu}
                          </p>
                        )}

                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-rajdhani line-clamp-3">
                          {content.descriptionEnglish || 'No description available.'}
                        </p>
                      </div>

                      {/* Watch details & dub verification info */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black font-rajdhani uppercase tracking-widest text-gray-500">
                            Telugu Dub:
                          </span>
                          <span 
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              content.teluguDubAvail 
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}
                          >
                            {content.teluguDubAvail ? '✓ CONFIRMED' : '✗ NOT AVAILABLE'}
                          </span>
                        </div>

                        {/* Streaming platforms cards */}
                        {streams.length > 0 ? (
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-[10px] font-black font-rajdhani uppercase tracking-widest text-gray-500">
                              Stream on:
                            </span>
                            {streams.map((link: any) => (
                              <OttBadge 
                                key={link.platform} 
                                platform={link.platform} 
                                url={link.url} 
                                hidePrefix={true}
                              />
                            ))}
                          </div>
                        ) : !isUpcoming ? (
                          <span className="text-[10px] text-gray-500 font-bold font-rajdhani uppercase tracking-wider">
                            Direct Link Unavailable
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-20">
            <SectionHeader
              title="More Telugu-Dubbed Recommendations"
              titleTe="సిఫార్సులు"
              icon="favorite"
              description="Explore other high-quality action and fantasy discoveries"
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
              {recommendations.map((item) => (
                <Link 
                  key={item.id} 
                  href={`/content/${item.slug}`}
                  className="bg-surface border border-white/5 rounded-2xl overflow-hidden hover:border-yellow-400/30 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between shadow-[0_8px_25px_rgba(0,0,0,0.5)]"
                >
                  <div className="aspect-[2/3] w-full overflow-hidden bg-black/25 relative">
                    <img
                      src={item.poster || PLACEHOLDER_POSTER}
                      alt={item.titleEnglish}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = PLACEHOLDER_POSTER }}
                    />
                    <div className="absolute top-2 left-2">
                      <span className="text-[9px] font-black px-2 py-0.5 rounded bg-black/80 font-rajdhani border border-white/5" style={{ color: TYPE_COLORS[item.type] || '#FFD700' }}>
                        {item.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-3.5 space-y-1">
                    <h4 className="text-white text-xs font-bold font-rajdhani truncate group-hover:text-yellow-400 transition-colors">
                      {item.titleEnglish}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-gray-500 font-rajdhani">
                      <span>{item.year}</span>
                      {item.imdbRating && <span className="text-yellow-400 font-bold">★ {item.imdbRating.toFixed(1)}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
