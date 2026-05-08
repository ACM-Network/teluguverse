import AdminDashboard from '@/components/admin/AdminDashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Dashboard – TeluguVerse' }

export default function AdminPage() {
  return <AdminDashboard />
}
