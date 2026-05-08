import { clsx, type ClassValue } from 'clsx'

export const cn = (...inputs: ClassValue[]) => clsx(inputs)

export const slugify = (text: string): string =>
  text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

export const formatRuntime = (minutes: number): string => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export const formatDate = (date: Date | string): string =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

export const getContentColor = (type: string): string => {
  const map: Record<string, string> = {
    MOVIE: '#E50914', ANIME: '#a855f7', SERIES: '#3b82f6',
    KDRAMA: '#ec4899', CARTOON: '#22c55e', HOLLYWOOD: '#f59e0b', DOCUMENTARY: '#06b6d4'
  }
  return map[type] || '#FFD700'
}

export const truncate = (str: string, n: number) => str.length > n ? str.substring(0, n) + '...' : str

export const paginate = (page: number = 1, limit: number = 20) => ({
  skip: (page - 1) * limit,
  take: limit,
})
