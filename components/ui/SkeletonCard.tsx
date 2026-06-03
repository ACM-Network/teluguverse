export default function SkeletonCard({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-none w-44 rounded-2xl overflow-hidden border border-white/[0.03] bg-surface p-3 flex flex-col gap-3">
          <div className="aspect-[2/3] w-full rounded-xl shimmer" />
          <div className="space-y-2">
            <div className="h-4 rounded shimmer w-3/4" />
            <div className="h-3 rounded shimmer w-1/2" />
          </div>
        </div>
      ))}
    </>
  )
}
