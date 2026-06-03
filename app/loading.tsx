export default function Loading() {
  return (
    <div className="min-h-screen bg-dark">
      {/* Branded hero skeleton */}
      <div className="relative" style={{ height: 'clamp(620px, 100vh, 940px)' }}>
        <div className="absolute inset-0 shimmer" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(7,8,16,0.95) 0%, rgba(7,8,16,0.7) 40%, transparent 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{ background: 'linear-gradient(to top, #070810, transparent)' }} />
        
        {/* Branded loader in center */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-cinzel font-black text-xl text-black animate-pulse"
              style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}
            >
              TV
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60 animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/40 animate-pulse" style={{ animationDelay: '0.15s' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/20 animate-pulse" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        </div>

        {/* Content skeleton on left */}
        <div className="absolute bottom-32 left-8 z-10 space-y-4 max-w-lg">
          <div className="h-3 w-24 rounded-full bg-white/5 shimmer" />
          <div className="h-10 w-80 rounded-lg bg-white/5 shimmer" />
          <div className="h-10 w-56 rounded-lg bg-white/5 shimmer" />
          <div className="flex gap-3 mt-2">
            <div className="h-4 w-14 rounded bg-white/5 shimmer" />
            <div className="h-4 w-20 rounded bg-white/5 shimmer" />
            <div className="h-4 w-16 rounded bg-white/5 shimmer" />
          </div>
          <div className="h-3 w-full rounded bg-white/[0.03] shimmer" />
          <div className="h-3 w-3/4 rounded bg-white/[0.03] shimmer" />
          <div className="flex gap-3 mt-4">
            <div className="h-11 w-40 rounded-xl bg-white/5 shimmer" />
            <div className="h-11 w-36 rounded-xl bg-white/[0.03] shimmer" />
          </div>
        </div>
      </div>

      {/* Content sections skeleton */}
      <div className="container-tv py-8 space-y-14">
        {[1, 2, 3].map(section => (
          <div key={section}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-8 rounded-full bg-white/5 shimmer" />
              <div>
                <div className="h-3 w-32 rounded bg-white/5 shimmer mb-2" />
                <div className="h-5 w-48 rounded bg-white/5 shimmer" />
              </div>
            </div>
            <div className="flex gap-5 overflow-hidden">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex-none w-44">
                  <div className="aspect-[2/3] rounded-2xl bg-white/[0.03] shimmer mb-3" />
                  <div className="h-3 w-3/4 rounded bg-white/[0.03] shimmer mb-1.5" />
                  <div className="h-2.5 w-1/2 rounded bg-white/[0.02] shimmer" />
                </div>
              ))}
            </div>
            <div className="section-divider mt-8" />
          </div>
        ))}
      </div>
    </div>
  )
}
