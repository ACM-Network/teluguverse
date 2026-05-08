'use client'
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center text-center px-4">
      <div>
        <div className="text-8xl mb-6">⚠️</div>
        <h1 className="font-cinzel text-3xl font-black text-white mb-3">Something went wrong</h1>
        <p className="font-telugu text-gray-500 mb-8">ఏదో తప్పు జరిగింది. దయచేసి మళ్ళీ ప్రయత్నించండి.</p>
        <button onClick={reset} className="px-8 py-4 rounded-xl font-cinzel font-bold text-black text-sm tracking-wide"
          style={{ background:'linear-gradient(135deg,#FFD700,#FFA500)' }}>
          Try Again
        </button>
      </div>
    </div>
  )
}
