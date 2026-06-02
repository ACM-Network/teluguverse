import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import ParticleCanvas from '@/components/ui/ParticleCanvas'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Cinematic Universes – TeluguVerse',
  description: 'Explore storylines and chronological timelines of MCU, LCU, Baahubali, and other legendary universes.',
}

export default async function UniversesPage() {
  const universes = await prisma.universe.findMany({
    include: {
      contents: {
        include: {
          content: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="min-h-screen bg-dark pt-28 pb-20 relative select-none">
      <ParticleCanvas />
      
      <div className="container-tv relative z-10">
        <SectionHeader
          title="Cinematic Universes"
          titleTe="సినిమాటిక్ విశ్వాలు"
          icon="universe"
          description="Track the chronological timelines, storyline connections, and watch orders of your favorite film franchises."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {universes.map((uni) => {
            const themeColor = uni.color || '#FFD700'
            const movieCount = uni.contents.filter(c => c.content.type === 'MOVIE' || c.content.type === 'HOLLYWOOD').length
            const seriesCount = uni.contents.filter(c => c.content.type === 'SERIES' || c.content.type === 'ANIME').length
            
            return (
              <Link 
                key={uni.id} 
                href={`/universe/${uni.id}`}
                className="group relative rounded-2xl overflow-hidden bg-surface border border-white/5 p-6 hover:border-yellow-400/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-500 flex flex-col justify-between h-64"
              >
                {/* Decorative glowing gradient backing */}
                <div 
                  className="absolute -right-16 -top-16 w-40 h-40 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
                  style={{ background: themeColor }}
                />

                <div className="space-y-3">
                  <span 
                    className="text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded bg-black/40 border border-white/10"
                    style={{ color: themeColor, borderColor: `${themeColor}20` }}
                  >
                    Franchise
                  </span>
                  <h3 className="text-white text-xl sm:text-2xl font-black font-rajdhani mt-2 group-hover:text-yellow-400 transition-colors duration-300">
                    {uni.name}
                  </h3>
                  {uni.nameTe && (
                    <p className="font-telugu text-sm text-yellow-500/70 leading-none">
                      {uni.nameTe}
                    </p>
                  )}
                  <p className="text-gray-400 text-xs sm:text-sm font-semibold font-rajdhani line-clamp-2 mt-2 leading-relaxed">
                    {uni.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-black/45 border border-white/5 px-4 py-2.5 rounded-xl w-fit backdrop-blur-md mt-4">
                  <div className="text-center">
                    <span className="text-gray-500 text-[8px] uppercase tracking-wider font-bold block">Movies</span>
                    <span className="text-sm font-black text-white font-cinzel">{movieCount}</span>
                  </div>
                  <div className="text-center border-l border-white/5 pl-4">
                    <span className="text-gray-500 text-[8px] uppercase tracking-wider font-bold block">Series</span>
                    <span className="text-sm font-black text-white font-cinzel">{seriesCount}</span>
                  </div>
                </div>

                {/* Accent colored bottom border */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 transition-transform duration-300 translate-y-1 group-hover:translate-y-0"
                  style={{ background: themeColor }}
                />
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
