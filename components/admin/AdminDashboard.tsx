'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Stats {
  totalContent: number; totalUsers: number; totalReviews: number; totalRatings: number
  byType: { type: string; _count: number }[]
  recentContent: { id: string; titleEnglish: string; type: string; createdAt: string; viewCount: number }[]
}

const TYPE_COLORS: Record<string, string> = {
  MOVIE: '#E50914', ANIME: '#a855f7', SERIES: '#3b82f6', KDRAMA: '#ec4899',
  CARTOON: '#22c55e', HOLLYWOOD: '#f59e0b', DOCUMENTARY: '#06b6d4'
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [activeView, setActiveView] = useState<'dashboard' | 'content' | 'users' | 'add'>('dashboard')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(d => { setStats(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="text-yellow-400 font-cinzel text-xl animate-pulse">Loading Admin Panel...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 fixed left-0 top-16 bottom-0 bg-dark-2 border-r border-border overflow-y-auto">
          <div className="p-6">
            <p className="text-yellow-400 text-xs font-bold font-rajdhani tracking-widest uppercase mb-6">Admin Panel</p>
            {[
              { icon: '📊', label: 'Dashboard', view: 'dashboard' },
              { icon: '🎬', label: 'Content', view: 'content' },
              { icon: '👥', label: 'Users', view: 'users' },
              { icon: '+', label: 'Add Content', view: 'add' },
            ].map(item => (
              <button key={item.view} onClick={() => setActiveView(item.view as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold font-rajdhani mb-1 transition-all text-left ${activeView === item.view ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-400/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="ml-64 flex-1 p-8 pt-24">
          {activeView === 'dashboard' && (
            <div>
              <h1 className="font-cinzel text-3xl font-black text-white mb-2">Dashboard</h1>
              <p className="font-telugu text-gray-500 mb-8 text-sm">TeluguVerse Admin Control Panel</p>

              {/* Stats cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Content', labelTe: 'మొత్తం కంటెంట్', value: stats?.totalContent || 0, icon: '🎬', color: '#FFD700' },
                  { label: 'Total Users', labelTe: 'మొత్తం వినియోగదారులు', value: stats?.totalUsers || 0, icon: '👥', color: '#60a5fa' },
                  { label: 'Total Reviews', labelTe: 'మొత్తం సమీక్షలు', value: stats?.totalReviews || 0, icon: '⭐', color: '#f59e0b' },
                  { label: 'Total Ratings', labelTe: 'మొత్తం రేటింగ్‌లు', value: stats?.totalRatings || 0, icon: '📊', color: '#a855f7' },
                ].map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="bg-surface border border-border rounded-2xl p-5 hover:border-yellow-400/20 transition-all">
                    <div className="text-3xl mb-3">{stat.icon}</div>
                    <p className="font-cinzel text-3xl font-black mb-1" style={{ color: stat.color }}>{stat.value.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm font-bold font-rajdhani">{stat.label}</p>
                    <p className="font-telugu text-gray-600 text-xs mt-0.5">{stat.labelTe}</p>
                  </motion.div>
                ))}
              </div>

              {/* Content by type */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-surface border border-border rounded-2xl p-6">
                  <h3 className="font-cinzel text-base font-bold text-white mb-5">Content by Type</h3>
                  <div className="space-y-3">
                    {stats?.byType.map(({ type, _count }) => {
                      const max = Math.max(...(stats?.byType.map(t => t._count) || [1]))
                      const pct = (_count / max) * 100
                      return (
                        <div key={type}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-semibold font-rajdhani" style={{ color: TYPE_COLORS[type] || '#9CA3AF' }}>{type}</span>
                            <span className="text-sm text-gray-400 font-rajdhani font-bold">{_count.toLocaleString()}</span>
                          </div>
                          <div className="h-2 bg-dark-3 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.3, duration: 0.8 }}
                              className="h-full rounded-full" style={{ background: TYPE_COLORS[type] || '#9CA3AF' }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Recent additions */}
                <div className="bg-surface border border-border rounded-2xl p-6">
                  <h3 className="font-cinzel text-base font-bold text-white mb-5">Recently Added</h3>
                  <div className="space-y-2">
                    {stats?.recentContent.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-none"
                          style={{ background: `${TYPE_COLORS[item.type] || '#9CA3AF'}20` }}>
                          🎬
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-semibold font-rajdhani truncate">{item.titleEnglish}</p>
                          <p className="text-gray-500 text-xs font-rajdhani">{new Date(item.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right flex-none">
                          <span className="text-xs font-bold px-2 py-0.5 rounded font-rajdhani" style={{ background: `${TYPE_COLORS[item.type] || '#9CA3AF'}20`, color: TYPE_COLORS[item.type] || '#9CA3AF' }}>
                            {item.type}
                          </span>
                          <p className="text-gray-500 text-xs mt-0.5 font-rajdhani">{item.viewCount} views</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="bg-surface border border-border rounded-2xl p-6">
                <h3 className="font-cinzel text-base font-bold text-white mb-5">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { label: 'Add Content', icon: '+', action: () => setActiveView('add') },
                    { label: 'Manage Users', icon: '👥', action: () => setActiveView('users') },
                    { label: 'Moderate Reviews', icon: '💬', action: () => {} },
                    { label: 'Feature Content', icon: '⭐', action: () => {} },
                    { label: 'Manage Genres', icon: '🏷️', action: () => {} },
                    { label: 'View Analytics', icon: '📈', action: () => {} },
                  ].map(({ label, icon, action }) => (
                    <button key={label} onClick={action}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-dark-3 border border-border hover:border-yellow-400/30 hover:bg-yellow-400/5 transition-all group">
                      <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
                      <span className="text-xs font-bold font-rajdhani text-gray-400 group-hover:text-yellow-400 transition-colors text-center">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeView === 'add' && <AddContentForm />}
          {activeView === 'content' && <ContentManager />}
          {activeView === 'users' && (
            <div>
              <h2 className="font-cinzel text-2xl font-bold text-white mb-6">User Management</h2>
              <div className="bg-surface border border-border rounded-2xl p-12 text-center">
                <p className="text-gray-500 font-rajdhani text-lg">User management interface</p>
                <p className="font-telugu text-gray-600 text-sm mt-2">వినియోగదారు నిర్వహణ</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AddContentForm() {
  const [form, setForm] = useState({ titleEnglish: '', titleTelugu: '', type: 'MOVIE', year: '', descriptionTelugu: '', studio: '', language: 'Telugu', teluguDubAvail: false })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/admin/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, year: form.year ? Number(form.year) : undefined }) })
    setSaving(false)
    if (res.ok) setSaved(true)
  }

  return (
    <div>
      <h2 className="font-cinzel text-2xl font-bold text-white mb-6">Add New Content</h2>
      <form onSubmit={handleSubmit} className="max-w-2xl bg-surface border border-border rounded-2xl p-8 space-y-5">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="text-gray-400 text-xs font-bold font-rajdhani tracking-widest uppercase block mb-2">English Title *</label>
            <input required value={form.titleEnglish} onChange={e => setForm(f => ({ ...f, titleEnglish: e.target.value }))}
              className="w-full bg-dark-3 border border-border rounded-xl px-4 py-3 text-white font-rajdhani outline-none focus:border-yellow-400/50 transition-all" placeholder="e.g. Attack on Titan" />
          </div>
          <div>
            <label className="text-gray-400 text-xs font-bold font-rajdhani tracking-widest uppercase block mb-2">Telugu Title</label>
            <input value={form.titleTelugu} onChange={e => setForm(f => ({ ...f, titleTelugu: e.target.value }))}
              className="w-full bg-dark-3 border border-border rounded-xl px-4 py-3 text-white font-telugu outline-none focus:border-yellow-400/50 transition-all" placeholder="తెలుగు పేరు" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-5">
          <div>
            <label className="text-gray-400 text-xs font-bold font-rajdhani tracking-widest uppercase block mb-2">Content Type *</label>
            <select required value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              className="w-full bg-dark-3 border border-border rounded-xl px-4 py-3 text-white font-rajdhani outline-none focus:border-yellow-400/50 transition-all">
              {['MOVIE', 'ANIME', 'SERIES', 'KDRAMA', 'CARTOON', 'HOLLYWOOD', 'DOCUMENTARY'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-gray-400 text-xs font-bold font-rajdhani tracking-widest uppercase block mb-2">Year</label>
            <input type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} min="1900" max="2030"
              className="w-full bg-dark-3 border border-border rounded-xl px-4 py-3 text-white font-rajdhani outline-none focus:border-yellow-400/50 transition-all" placeholder="2024" />
          </div>
          <div>
            <label className="text-gray-400 text-xs font-bold font-rajdhani tracking-widest uppercase block mb-2">Language</label>
            <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
              className="w-full bg-dark-3 border border-border rounded-xl px-4 py-3 text-white font-rajdhani outline-none focus:border-yellow-400/50 transition-all">
              {['Telugu', 'Hindi', 'Tamil', 'Japanese', 'Korean', 'English'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-gray-400 text-xs font-bold font-rajdhani tracking-widest uppercase block mb-2">Studio / Network</label>
          <input value={form.studio} onChange={e => setForm(f => ({ ...f, studio: e.target.value }))}
            className="w-full bg-dark-3 border border-border rounded-xl px-4 py-3 text-white font-rajdhani outline-none focus:border-yellow-400/50 transition-all" placeholder="e.g. MAPPA, Netflix" />
        </div>
        <div>
          <label className="text-gray-400 text-xs font-bold font-rajdhani tracking-widest uppercase block mb-2">Telugu Description / వివరణ</label>
          <textarea value={form.descriptionTelugu} onChange={e => setForm(f => ({ ...f, descriptionTelugu: e.target.value }))} rows={5}
            className="w-full bg-dark-3 border border-border rounded-xl px-4 py-3 text-white font-telugu outline-none focus:border-yellow-400/50 transition-all resize-none text-sm leading-8"
            placeholder="తెలుగులో వివరణ రాయండి..." />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="dub" checked={form.teluguDubAvail} onChange={e => setForm(f => ({ ...f, teluguDubAvail: e.target.checked }))} className="w-4 h-4 accent-yellow-400" />
          <label htmlFor="dub" className="text-gray-300 text-sm font-rajdhani font-semibold">Telugu Dubbed Available / తెలుగు డబ్ అందుబాటులో ఉంది</label>
        </div>
        <button type="submit" disabled={saving}
          className="w-full py-4 rounded-xl font-cinzel font-bold text-black text-sm tracking-wide transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', boxShadow: '0 0 30px rgba(255,215,0,0.3)' }}>
          {saving ? 'Saving...' : saved ? '✓ Saved Successfully' : '+ Add Content'}
        </button>
      </form>
    </div>
  )
}

function ContentManager() {
  const [items, setItems] = useState<any[]>([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetch(`/api/admin/content?q=${encodeURIComponent(query)}`).then(r => r.json()).then(d => setItems(d.items || []))
  }, [query])

  return (
    <div>
      <h2 className="font-cinzel text-2xl font-bold text-white mb-6">Content Manager</h2>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search content..."
        className="w-full max-w-md bg-surface border border-border rounded-xl px-4 py-3 text-white font-rajdhani outline-none focus:border-yellow-400/50 transition-all mb-6" />
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-border">
            <tr>
              {['Title', 'Type', 'Year', 'Rating', 'Views', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-gray-400 text-xs font-bold font-rajdhani tracking-widest uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id} className={`border-b border-border hover:bg-white/2 transition-all ${i % 2 === 0 ? '' : 'bg-white/1'}`}>
                <td className="px-5 py-3">
                  <p className="text-white text-sm font-semibold font-rajdhani">{item.titleEnglish}</p>
                  {item.titleTelugu && <p className="font-telugu text-gray-500 text-xs">{item.titleTelugu}</p>}
                </td>
                <td className="px-5 py-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded font-rajdhani" style={{ background: `${TYPE_COLORS[item.type] || '#9CA3AF'}20`, color: TYPE_COLORS[item.type] || '#9CA3AF' }}>{item.type}</span>
                </td>
                <td className="px-5 py-3 text-gray-400 text-sm font-rajdhani">{item.year || '—'}</td>
                <td className="px-5 py-3 text-yellow-400 text-sm font-bold font-rajdhani">{item.imdbRating?.toFixed(1) || '—'}</td>
                <td className="px-5 py-3 text-gray-400 text-sm font-rajdhani">{item.viewCount?.toLocaleString()}</td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button className="text-xs text-blue-400 hover:text-blue-300 font-rajdhani font-bold transition-colors">Edit</button>
                    <button className="text-xs text-red-400 hover:text-red-300 font-rajdhani font-bold transition-colors">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} className="text-center py-12 text-gray-600 font-rajdhani">No content found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
