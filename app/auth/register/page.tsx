'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', username: '', displayName: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { setUser, setToken } = useStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setUser(data.user); setToken(data.token)
      toast.success('Welcome to TeluguVerse! 🎬')
      router.push('/')
    } catch (err: any) {
      toast.error(err.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 pt-16">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(255,215,0,0.04) 0%, transparent 60%)' }} />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-cinzel font-black text-2xl text-black mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg,#FFD700,#FFA500)', boxShadow: '0 0 40px rgba(255,215,0,0.3)' }}>TV</div>
          <h1 className="font-cinzel text-3xl font-black text-white mb-1">Join TeluguVerse</h1>
          <p className="font-telugu text-gray-500">TeluguVerse కి చేరండి</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-2xl p-8 space-y-5">
          <div>
            <label className="text-gray-400 text-xs font-bold font-rajdhani tracking-widest uppercase block mb-2">Display Name</label>
            <input required value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
              className="w-full bg-dark-3 border border-border rounded-xl px-4 py-3 text-white font-rajdhani outline-none focus:border-yellow-400/50 transition-all" placeholder="Your name" />
          </div>
          <div>
            <label className="text-gray-400 text-xs font-bold font-rajdhani tracking-widest uppercase block mb-2">Username</label>
            <input required value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase() }))}
              className="w-full bg-dark-3 border border-border rounded-xl px-4 py-3 text-white font-rajdhani outline-none focus:border-yellow-400/50 transition-all" placeholder="username (a-z, 0-9, _)" />
          </div>
          <div>
            <label className="text-gray-400 text-xs font-bold font-rajdhani tracking-widest uppercase block mb-2">Email</label>
            <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full bg-dark-3 border border-border rounded-xl px-4 py-3 text-white font-rajdhani outline-none focus:border-yellow-400/50 transition-all" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-gray-400 text-xs font-bold font-rajdhani tracking-widest uppercase block mb-2">Password</label>
            <input type="password" required minLength={8} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full bg-dark-3 border border-border rounded-xl px-4 py-3 text-white font-rajdhani outline-none focus:border-yellow-400/50 transition-all" placeholder="At least 8 characters" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-xl font-cinzel font-bold text-black text-sm tracking-wide transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg,#FFD700,#FFA500)', boxShadow: '0 0 30px rgba(255,215,0,0.2)' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
          <p className="text-center text-gray-500 text-sm font-rajdhani">
            Already a member? <Link href="/auth/login" className="text-yellow-400 font-bold hover:text-yellow-300 transition-colors">Sign in</Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}
