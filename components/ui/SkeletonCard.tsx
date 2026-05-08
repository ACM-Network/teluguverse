export default function SkeletonCard({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-none w-44 rounded-xl overflow-hidden animate-pulse">
          <div className="h-64 bg-surface-2 rounded-xl" />
          <div className="mt-2 h-4 bg-surface-2 rounded w-3/4" />
          <div className="mt-1 h-3 bg-surface-2 rounded w-1/2" />
        </div>
      ))}
    </>
  )
}
