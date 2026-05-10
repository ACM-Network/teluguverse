'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ContentItem } from '@/types'
import { useStore } from '@/store/useStore'
import { formatRuntime, formatDate, getContentColor } from '@/lib/utils'
import OttBadge from '@/components/ui/OttBadge'
import RatingStars from '@/components/ui/RatingStars'
import ContentCard from '@/components/ui/ContentCard'
import SectionHeader from '@/components/ui/SectionHeader'

const TABS = ['Overview', 'Episodes', 'Characters', 'Cast', 'Reviews', 'Gallery', 'Similar', 'Info']

const TYPE_LABELS: Record<string, string> = { MOVIE: 'Movie', ANIME: 'Anime', SERIES: 'Series', KDRAMA: 'K-Drama', CARTOON: 'Cartoon', HOLLYWOOD: 'Hollywood', DOCUMENTARY: 'Documentary' }
const TYPE_EMOJIS: Record<string, string> = { MOVIE: '🎬', ANIME: '⚡', SERIES: '📺', KDRAMA: '🌸', CARTOON: '🎭', HOLLYWOOD: '🎪', DOCUMENTARY: '📽️' }
const OTT_COLORS: Record<string, string> = { NETFLIX: '#E50914', AMAZON_PRIME: '#00A8E0', HOTSTAR: '#1B74E4', ZEE5: '#7B2FBE', CRUNCHYROLL: '#F47521', VIKI: '#1DA462', OTHER: '#9CA3AF' }

interface Props { content: ContentItem; similar?: ContentItem[] }

export default function ContentDetailPage({ content, similar = [] }: Props) {
  const [activeTab, setActiveTab] = useState('Overview')
  const [userRating, setUserRating] = useState<number | null>(null)
  const [showTrailer, setShowTrailer] = useState(false)
  const [watchedEps, setWatchedEps] = useState<Set<number>>(new Set())
  const { toggleWatchlist, toggleFavorite, watchlist, favorites, language } = useStore()
  const color = getContentColor(content.type)
  const title = language === 'te' && content.titleTelugu ? content.titleTelugu : content.titleEnglish
  const desc = language === 'te' && content.descriptionTelugu ? content.descriptionTelugu : content.descriptionEnglish

  const inWatchlist = watchlist.includes(content.id)
  const isFav = favorites.includes(content.id)

  return (
    <div className="min-h-screen bg-dark">
      {/* HERO BANNER */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {content.banner || content.poster ? (
          <Image src={(content.banner || content.poster)!} alt={content.titleEnglish} fill priority
            className="object-cover scale-105" sizes="100vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: `radial-gradient(ellipse at center, ${color}20 0%, #070810 70%)` }}>
            <span className="text-[180px] opacity-30">{TYPE_EMOJIS[content.type]}</span>
          </div>
        )}

        {/* Multi-layer overlays for cinematic depth */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(7,8,16,0.97) 0%, rgba(7,8,16,0.6) 50%, rgba(7,8,16,0.3) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #070810 0%, rgba(7,8,16,0.4) 40%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to top, #070810 0%, transparent 100%)' }} />

        {/* Glowing accent */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full opacity-5 pointer-events-none"
          style={{ background: color, filter: 'blur(100px)' }} />
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-screen-xl mx-auto px-6 -mt-72 relative z-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">

          {/* LEFT: Poster */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden border-2 shadow-2xl"
              style={{ borderColor: `${color}50`, boxShadow: `0 30px 80px rgba(0,0,0,0.8), 0 0 40px ${color}20` }}>
              {content.poster ? (
                <Image
                  src={content.poster || '/placeholder.jpg'}
                  alt={content.titleEnglish}
                  fill
                  className="object-cover"
                  sizes="280px"
              />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${color}22, ${color}08)`
                  }}
                >
                  <span className="text-8xl opacity-40">
                    {TYPE_EMOJIS[content.type]}
                  </span>
                </div>
              )}
            </div>

            {/* Streaming platforms */}
            {content.streamingLinks && content.streamingLinks.length > 0 && (
              <div className="mt-5 space-y-2">
                <p className="text-gray-500 text-xs font-bold font-rajdhani tracking-widest uppercase mb-3">Available On</p>
                {content.streamingLinks.filter(l => l.isAvailable).map((link) => (
                  <OttBadge key={link.id} platform={link.platform} isTeluguDub={link.isTeluguDub} url={link.url} />
                ))}
              </div>
            )}

            {/* Dub status */}
            <div className="mt-4 space-y-2">
              <DubStatusBadge available={content.teluguDubAvail} label="Telugu Dubbed" labelTe="తెలుగు డబ్" color="#FFD700" />
              <DubStatusBadge available={content.teluguSubAvail} label="Telugu Subtitles" labelTe="తెలుగు సబ్టైటిల్స్" color="#60a5fa" />
              <DubStatusBadge available={content.hindiDubAvail} label="Hindi Dubbed" labelTe="హిందీ డబ్" color="#f97316" />
            </div>
          </motion.div>

          {/* RIGHT: Info */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="pt-16 lg:pt-0">
              {/* Badges */}
              <div className="flex gap-2 flex-wrap mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold font-rajdhani tracking-wide"
                  style={{ background: `${color}20`, color, border: `1px solid ${color}50` }}>
                  {TYPE_LABELS[content.type]}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold font-rajdhani tracking-wide ${content.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : content.status === 'ONGOING' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>
                  {content.status}
                </span>
                {content.ageRating && <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30 font-rajdhani">{content.ageRating}</span>}
              </div>

              {/* Title */}
              <h1 className="font-cinzel text-4xl lg:text-5xl font-black text-white leading-tight mb-2"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
                {content.titleEnglish}
              </h1>
              {content.titleTelugu && (
                <p className="font-telugu text-xl text-yellow-400/80 font-light mb-1">{content.titleTelugu}</p>
              )}
              {content.titleOriginal && content.titleOriginal !== content.titleEnglish && (
                <p className="text-gray-500 text-sm font-rajdhani mb-4 italic">{content.titleOriginal}</p>
              )}

              {/* Meta row */}
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                {content.imdbRating && (
                  <div className="flex items-center gap-2 bg-surface border border-yellow-400/20 rounded-xl px-4 py-2">
                    <span className="font-cinzel text-2xl font-black text-yellow-400">{content.imdbRating.toFixed(1)}</span>
                    <div>
                      <div className="flex gap-0.5"><RatingStars rating={content.imdbRating} maxRating={10} size="sm" /></div>
                      <p className="text-gray-500 text-[10px] font-rajdhani uppercase tracking-widest">Rating</p>
                    </div>
                  </div>
                )}
                <div className="flex gap-4 text-gray-400 font-rajdhani text-sm font-semibold flex-wrap">
                  {content.year && <span className="flex items-center gap-1">📅 {content.year}</span>}
                  {content.runtime && <span>⏱ {formatRuntime(content.runtime)}</span>}
                  {content.totalEpisodes && <span>📺 {content.totalEpisodes} Episodes</span>}
                  {content.totalSeasons && <span>🗂 {content.totalSeasons} Seasons</span>}
                  {content.language && <span>🌐 {content.language}</span>}
                  {content.studio && <span>🏢 {content.studio}</span>}
                </div>
              </div>

              {/* Genres */}
              {content.genres && content.genres.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-5">
                  {content.genres.map(({ genre }) => (
                    <span key={genre.id} className="px-3 py-1.5 rounded-lg text-xs font-bold font-rajdhani tracking-wide text-gray-200 border border-white/10 bg-white/5 hover:border-white/20 transition-all cursor-pointer">
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              {desc && (
                <p className="font-telugu text-gray-300 text-base leading-8 mb-6 max-w-2xl">{desc}</p>
              )}

              {/* Your rating */}
              <div className="flex items-center gap-3 mb-6 p-3 bg-surface border border-border rounded-xl w-fit">
                <span className="text-gray-400 text-sm font-rajdhani font-semibold">Your Rating:</span>
                <RatingStars rating={userRating} maxRating={10} size="md" interactive onRate={setUserRating} />
                {userRating && <span className="text-yellow-400 font-bold font-rajdhani ml-1">{userRating}/10</span>}
              </div>

              {/* Actions */}
              <div className="flex gap-3 flex-wrap">
                <button onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold font-rajdhani tracking-wide text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #E50914, #c0000f)', boxShadow: '0 0 25px rgba(229,9,20,0.4)' }}>
                  ▶ Watch Trailer
                </button>
                <button onClick={() => toggleWatchlist(content.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold font-rajdhani tracking-wide border transition-all ${inWatchlist ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' : 'bg-white/5 border-white/10 text-gray-300 hover:border-yellow-400/30 hover:text-yellow-400'}`}>
                  {inWatchlist ? '✓ In Watchlist' : '+ Watchlist'}
                </button>
                <button onClick={() => toggleFavorite(content.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold font-rajdhani tracking-wide border transition-all ${isFav ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-white/5 border-white/10 text-gray-300 hover:border-red-400/30 hover:text-red-400'}`}>
                  {isFav ? '♥ Favorited' : '♡ Favorite'}
                </button>
                <button className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold font-rajdhani text-gray-400 bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                  ↗ Share
                </button>
              </div>

              {/* Directors */}
              {content.directors && content.directors.length > 0 && (
                <div className="mt-6 flex items-center gap-3">
                  <span className="text-gray-500 text-sm font-rajdhani font-semibold">Director:</span>
                  {content.directors.map(d => (
                    <span key={d.id} className="text-white text-sm font-semibold font-rajdhani">{d.name}</span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* TABS */}
        <div className="mt-12 border-b border-white/10 flex gap-0 overflow-x-auto">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-bold font-rajdhani tracking-wide whitespace-nowrap transition-all border-b-2 ${activeTab === tab ? 'text-yellow-400 border-yellow-400' : 'text-gray-500 border-transparent hover:text-gray-300'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

              {activeTab === 'Overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Synopsis */}
                    <div className="bg-surface border border-border rounded-2xl p-6">
                      <h3 className="font-cinzel text-base font-bold text-yellow-400 mb-4 flex items-center gap-2">📖 Synopsis / కథాసారాంశం</h3>
                      <p className="font-telugu text-gray-300 leading-8 text-base">{content.descriptionTelugu || content.descriptionEnglish || 'Description coming soon...'}</p>
                    </div>
                    {/* Story explanation */}
                    {content.storyExplanation && (
                      <div className="bg-surface border border-border rounded-2xl p-6">
                        <h3 className="font-cinzel text-base font-bold text-yellow-400 mb-4">🧩 Story Explained (Telugu)</h3>
                        <p className="font-telugu text-gray-300 leading-8">{content.storyExplanation}</p>
                      </div>
                    )}
                    {/* Ending explanation */}
                    {content.endingExplanation && (
                      <div className="bg-surface border border-border rounded-2xl p-6 border-l-4" style={{ borderLeftColor: color }}>
                        <h3 className="font-cinzel text-base font-bold text-yellow-400 mb-4">🔚 Ending Explained</h3>
                        <p className="font-telugu text-gray-300 leading-8">{content.endingExplanation}</p>
                      </div>
                    )}
                    {/* Trailer */}
                    <div className="bg-surface border border-border rounded-2xl p-6">
                      <h3 className="font-cinzel text-base font-bold text-yellow-400 mb-4">🎬 Trailer</h3>
                      {content.trailer ? (
                        <div className="relative aspect-video rounded-xl overflow-hidden">
                          <iframe src={content.trailer} className="w-full h-full" allowFullScreen />
                        </div>
                      ) : (
                        <div className="aspect-video bg-dark-3 rounded-xl flex items-center justify-center border border-border cursor-pointer hover:border-yellow-400/30 transition-all group"
                          onClick={() => setShowTrailer(true)}>
                          <div className="text-center">
                            <div className="text-6xl mb-3 group-hover:scale-110 transition-transform">▶</div>
                            <p className="text-gray-500 font-rajdhani">Trailer coming soon</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right sidebar: details */}
                  <div className="space-y-4">
                    <div className="bg-surface border border-border rounded-2xl p-5">
                      <h3 className="font-cinzel text-sm font-bold text-yellow-400 mb-4 tracking-wide">Details</h3>
                      {[
                        { label: 'Type', value: TYPE_LABELS[content.type] },
                        { label: 'Year', value: content.year },
                        { label: 'Status', value: content.status },
                        { label: 'Episodes', value: content.totalEpisodes },
                        { label: 'Seasons', value: content.totalSeasons },
                        { label: 'Runtime', value: content.runtime ? formatRuntime(content.runtime) : null },
                        { label: 'Language', value: content.language },
                        { label: 'Country', value: content.country },
                        { label: 'Studio', value: content.studio },
                        { label: 'Release', value: content.releaseDate ? formatDate(content.releaseDate) : null },
                      ].filter(d => d.value).map(({ label, value }) => (
                        <div key={label} className="flex justify-between py-2.5 border-b border-border last:border-0">
                          <span className="text-gray-500 text-sm font-rajdhani font-semibold">{label}</span>
                          <span className="text-white text-sm font-rajdhani font-semibold text-right max-w-[60%]">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                    {content._count && (
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'Reviews', value: content._count.reviews },
                          { label: 'Ratings', value: content._count.ratings },
                          { label: 'Watchlist', value: content._count.watchlist },
                          { label: 'Favorites', value: content._count.favorites },
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-surface border border-border rounded-xl p-3 text-center">
                            <p className="font-cinzel text-xl font-bold text-yellow-400">{value.toLocaleString()}</p>
                            <p className="text-gray-500 text-xs font-rajdhani mt-1 uppercase tracking-wide">{label}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'Episodes' && (
                <div className="space-y-6">
                  {content.seasons && content.seasons.length > 0 ? (
                    content.seasons.map((season) => (
                      <div key={season.id} className="bg-surface border border-border rounded-2xl p-6">
                        <h3 className="font-cinzel text-base font-bold text-white mb-1">Season {season.number}: {season.title}</h3>
                        {season.titleTe && <p className="font-telugu text-yellow-400/70 text-sm mb-4">{season.titleTe}</p>}
                        <div className="grid grid-cols-auto-fill gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))' }}>
                          {season.episodeList?.map((ep) => (
                            <button key={ep.id} onClick={() => setWatchedEps(prev => { const n = new Set(prev); n.has(ep.number) ? n.delete(ep.number) : n.add(ep.number); return n })}
                              className={`p-2 rounded-lg text-xs font-bold font-rajdhani border transition-all ${watchedEps.has(ep.number) ? 'bg-green-500/20 border-green-500/40 text-green-400' : 'bg-dark-3 border-border text-gray-400 hover:border-yellow-400/30 hover:text-yellow-400'}`}
                              title={ep.title || `Episode ${ep.number}`}>
                              Ep {ep.number}
                            </button>
                          ))}
                        </div>
                        {season.episodeList && season.episodeList.length > 0 && (
                          <p className="text-gray-500 text-xs mt-3 font-rajdhani">
                            {watchedEps.size} / {season.episodeList.length} watched
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="bg-surface border border-border rounded-2xl p-6">
                      <p className="text-gray-500 font-rajdhani text-center py-8">Episode list coming soon...</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Characters' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {content.characters && content.characters.length > 0 ? (
                    content.characters.map((char) => (
                      <div key={char.id} className="bg-surface border border-border rounded-xl overflow-hidden hover:border-yellow-400/30 transition-all group">
                        <div className="aspect-square bg-dark-3 flex items-center justify-center text-4xl" style={{ background: `linear-gradient(135deg, ${color}15, ${color}05)` }}>
                          {char.photo ? <Image src={char.photo} alt={char.name} fill className="object-cover" /> : '👤'}
                        </div>
                        <div className="p-3">
                          <p className="text-white text-sm font-bold font-rajdhani">{char.name}</p>
                          {char.nameTe && <p className="font-telugu text-gray-500 text-xs mt-0.5">{char.nameTe}</p>}
                          {char.voiceActor && <p className="text-gray-500 text-xs mt-1 font-rajdhani">VA: {char.voiceActor}</p>}
                          {char.isMain && <span className="text-yellow-400 text-[10px] font-bold font-rajdhani">★ Main</span>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-full text-gray-500 text-center py-12 font-rajdhani">Character information coming soon...</p>
                  )}
                </div>
              )}

              {activeTab === 'Cast' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {content.cast && content.cast.length > 0 ? (
                    content.cast.map((member) => (
                      <div key={member.id} className="bg-surface border border-border rounded-xl overflow-hidden hover:border-yellow-400/20 transition-all">
                        <div className="aspect-square bg-dark-3 flex items-center justify-center text-5xl" style={{ background: `linear-gradient(135deg, ${color}12, ${color}04)` }}>
                          {member.photo ? <Image src={member.photo} alt={member.name} fill className="object-cover" /> : '🎭'}
                        </div>
                        <div className="p-3">
                          <p className="text-white text-sm font-bold font-rajdhani truncate">{member.name}</p>
                          {member.character && <p className="text-gray-500 text-xs mt-0.5 font-rajdhani truncate">as {member.character}</p>}
                          {member.isVoiceActor && <span className="text-purple-400 text-[10px] font-bold font-rajdhani">Voice Actor</span>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-full text-gray-500 text-center py-12 font-rajdhani">Cast information coming soon...</p>
                  )}
                </div>
              )}

              {activeTab === 'Reviews' && (
                <div className="max-w-3xl space-y-4">
                  {content.reviews && content.reviews.length > 0 ? (
                    content.reviews.map((review) => (
                      <div key={review.id} className="bg-surface border border-border rounded-2xl p-5 hover:border-yellow-400/20 transition-all">
                        <div className="flex items-start gap-4 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-black text-sm flex-none">
                            {review.user.displayName.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <p className="text-white font-bold font-rajdhani text-sm">{review.user.displayName}</p>
                              <p className="text-gray-600 text-xs">@{review.user.username}</p>
                              {review.rating && <div className="flex gap-0.5"><RatingStars rating={review.rating} maxRating={10} size="sm" /></div>}
                            </div>
                            <p className="text-gray-500 text-xs mt-0.5">{formatDate(review.createdAt)}</p>
                          </div>
                          {review.rating && <span className="text-yellow-400 font-bold font-cinzel text-lg">{review.rating}</span>}
                        </div>
                        {review.title && <h4 className="text-white font-bold font-rajdhani mb-2">{review.title}</h4>}
                        <p className="font-telugu text-gray-300 leading-7 text-sm">{review.body}</p>
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                          <button className="text-gray-500 hover:text-yellow-400 text-xs font-rajdhani font-semibold transition-colors">👍 {review.likes} Helpful</button>
                          <button className="text-gray-500 hover:text-gray-300 text-xs font-rajdhani font-semibold transition-colors">Report</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16">
                      <p className="text-gray-500 font-rajdhani text-lg">No reviews yet. Be the first!</p>
                      <button className="mt-4 px-6 py-3 rounded-xl font-bold font-rajdhani text-sm" style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
                        Write a Review
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Gallery' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {content.screenshots.length > 0 ? (
                    content.screenshots.map((ss, i) => (
                      <div key={i} className="aspect-video rounded-xl overflow-hidden bg-dark-3 border border-border hover:border-yellow-400/30 transition-all cursor-zoom-in">
                        <Image src={ss} alt={`Screenshot ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 33vw" />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="aspect-video rounded-xl bg-dark-3 border border-border flex items-center justify-center">
                          <span className="text-gray-700 font-rajdhani text-sm">Screenshot {i + 1}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Similar' && (
                <div>
                  {similar.length > 0 ? (
                    <div className="grid grid-cols-auto-fill gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
                      {similar.map((item, i) => <ContentCard key={item.id} content={item} index={i} />)}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-16 font-rajdhani">No similar content found yet.</p>
                  )}
                </div>
              )}

              {activeTab === 'Info' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Fun facts */}
                  {content.funFacts && Array.isArray(content.funFacts) && (
                    <div className="bg-surface border border-border rounded-2xl p-6">
                      <h3 className="font-cinzel text-base font-bold text-yellow-400 mb-4">💡 Fun Facts & Trivia</h3>
                      <div className="space-y-3">
                        {(content.funFacts as string[]).map((fact, i) => (
                          <div key={i} className="flex gap-3 py-3 border-b border-border last:border-0">
                            <span className="text-yellow-400 flex-none">✦</span>
                            <span className="text-gray-300 text-sm font-rajdhani leading-relaxed">{fact}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technical details */}
                  <div className="bg-surface border border-border rounded-2xl p-6">
                    <h3 className="font-cinzel text-base font-bold text-yellow-400 mb-4">📊 Statistics</h3>
                    <div className="space-y-3">
                      <StatRow label="View Count" value={content.viewCount.toLocaleString()} />
                      <StatRow label="Popularity Score" value={content.popularityScore.toFixed(1)} />
                      <StatRow label="Trending Score" value={content.trendingScore.toFixed(1)} />
                      {content._count && (
                        <>
                          <StatRow label="Total Reviews" value={content._count.reviews.toLocaleString()} />
                          <StatRow label="Total Ratings" value={content._count.ratings.toLocaleString()} />
                          <StatRow label="In Watchlists" value={content._count.watchlist.toLocaleString()} />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Similar section at bottom */}
        {similar.length > 0 && activeTab === 'Overview' && (
          <div className="mt-16">
            <SectionHeader title="More Like This" titleTe="ఇలాంటివి మరిన్ని" icon="🎯" />
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
              {similar.map((item, i) => <ContentCard key={item.id} content={item} index={i} />)}
            </div>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      <AnimatePresence>
        {showTrailer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setShowTrailer(false)}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              className="w-full max-w-4xl aspect-video bg-dark rounded-2xl overflow-hidden border border-border"
              onClick={e => e.stopPropagation()}>
              {content.trailer ? (
                <iframe src={content.trailer} className="w-full h-full" allowFullScreen />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-400 font-rajdhani">Trailer not available yet</p>
                </div>
              )}
            </motion.div>
            <button className="absolute top-4 right-4 text-white text-3xl hover:text-yellow-400 transition-colors" onClick={() => setShowTrailer(false)}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DubStatusBadge({ available, label, labelTe, color }: { available: boolean; label: string; labelTe: string; color: string }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold font-rajdhani ${available ? 'border-opacity-40' : 'opacity-40 grayscale'}`}
      style={available ? { background: `${color}12`, borderColor: `${color}40`, color } : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)', color: '#9CA3AF' }}>
      <span>{available ? '✓' : '✗'}</span>
      <span>{label}</span>
      <span className="font-telugu ml-1 opacity-70">{labelTe}</span>
    </div>
  )
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-border last:border-0">
      <span className="text-gray-500 text-sm font-rajdhani font-semibold">{label}</span>
      <span className="text-white text-sm font-semibold font-rajdhani">{value}</span>
    </div>
  )
}
