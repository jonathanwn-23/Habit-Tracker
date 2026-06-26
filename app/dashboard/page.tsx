import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4">Selamat datang, {user.email}!</p>
      
      <form action="/api/auth/signout" method="POST" className="mt-8">
        <button className="rounded bg-red-600 px-4 py-2 text-white">
          Keluar
        </button>
      </form>
    </div>
  )
}
