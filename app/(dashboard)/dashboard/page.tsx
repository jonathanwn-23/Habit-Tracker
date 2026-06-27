import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TodayChecklist } from '@/components/dashboard/TodayChecklist'
import { calculateStreak } from '@/lib/utils/streak'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Dapatkan string tanggal hari ini
  const today = new Date()
  const todayStr = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0]

  // Fetch semua habit aktif
  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_archived', false)
    .order('created_at', { ascending: false }) // Default urutan berdasar waktu buat

  // Fetch semua log untuk habit-habit di atas (untuk MVP, ambil semua log user ini)
  const { data: allLogs } = await supabase
    .from('habit_logs')
    .select('habit_id, log_date')
    .in('habit_id', habits?.map(h => h.id) || [])

  if (!habits || habits.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-4 text-zinc-500">Selamat datang, {user.email}!</p>
        <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 p-12 text-center">
          <p className="text-sm text-zinc-500">Anda belum memiliki habit aktif. Mulai dari menu Kelola Habit!</p>
        </div>
      </div>
    )
  }

  // Petakan habit dengan data log & hitung streak
  const habitsWithData = habits.map(habit => {
    const habitLogs = allLogs?.filter(log => log.habit_id === habit.id).map(l => l.log_date) || []
    const isCompletedToday = habitLogs.includes(todayStr)
    const currentStreak = calculateStreak(habitLogs)

    return {
      id: habit.id,
      name: habit.name,
      description: habit.description,
      color: habit.color,
      isCompletedToday,
      currentStreak
    }
  })

  // Format tanggal untuk ditampilkan (contoh: Rabu, 26 Juni 2026)
  const displayDate = today.toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Hari Ini</h1>
        <p className="mt-2 text-zinc-500">{displayDate}</p>
      </div>

      <TodayChecklist habits={habitsWithData} todayStr={todayStr} />
    </div>
  )
}
