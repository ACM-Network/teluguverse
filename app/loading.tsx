export default function Loading() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-cinzel font-black text-2xl text-black mx-auto mb-4 animate-pulse"
          style={{ background:'linear-gradient(135deg,#FFD700,#FFA500)' }}>TV</div>
        <p className="font-cinzel text-yellow-400 text-sm tracking-widest animate-pulse">Loading...</p>
        <p className="font-telugu text-gray-600 text-xs mt-1">లోడ్ అవుతోంది...</p>
      </div>
    </div>
  )
}
