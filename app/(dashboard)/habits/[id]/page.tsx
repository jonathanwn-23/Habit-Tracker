import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { HabitCalendar } from '@/components/habits/HabitCalendar'
import { calculateStreak, calculateLongestStreak, calculateMonthlySuccessRate } from '@/lib/utils/streak'

export default async function HabitDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const resolvedParams = await Promise.resolve(params)

  const { data: habit } = await supabase
    .from('habits')
    .select('*')
    .eq('id', resolvedParams.id)
    .eq('user_id', user.id)
    .single()

  if (!habit) {
    redirect('/dashboard')
  }

  const { data: logs } = await supabase
    .from('habit_logs')
    .select('log_date')
    .eq('habit_id', habit.id)
    .order('log_date', { ascending: false })

  const logDates = logs?.map(log => log.log_date) || []
  const currentStreak = calculateStreak(logDates)
  const longestStreak = calculateLongestStreak(logDates)
  const monthlySuccessRate = calculateMonthlySuccessRate(logDates)
  const totalCompleted = logDates.length

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="text-sm font-medium text-zinc-500 hover:text-zinc-900">
            &larr; Kembali ke Dashboard
          </Link>
          <div className="mt-4 flex items-center gap-4">
            <div 
              className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-sm"
              style={{ 
                backgroundColor: (habit.color || '#6366f1') + '20',
                color: habit.color || '#6366f1' 
              }}
            >
              {habit.icon || '🎯'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-900">{habit.name}</h1>
              {habit.description && (
                <p className="mt-1 text-zinc-500">{habit.description}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Link
            href={`/habits/${habit.id}/edit`}
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50"
          >
            Edit Habit
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-medium text-zinc-500">Streak Saat Ini</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight text-zinc-900">{currentStreak}</span>
            <span className="text-sm text-zinc-500">hari</span>
          </div>
        </div>
        
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-medium text-zinc-500">Streak Terpanjang</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight text-zinc-900">{longestStreak}</span>
            <span className="text-sm text-zinc-500">hari</span>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-medium text-zinc-500">Sukses 30 Hari</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight text-zinc-900">{monthlySuccessRate}</span>
            <span className="text-sm text-zinc-500">%</span>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-medium text-zinc-500">Total Check-in</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight text-zinc-900">{totalCompleted}</span>
            <span className="text-sm text-zinc-500">hari</span>
          </div>
        </div>
      </div>

      {/* Calendar Heatmap */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-zinc-900">Riwayat Check-in</h2>
        <HabitCalendar logs={logDates} color={habit.color} />
      </div>
    </div>
  )
}
