'use client'

import { useOptimistic, useTransition } from 'react'
import { HabitCard } from '@/components/habits/HabitCard'
import { toggleHabitLog } from '@/app/(dashboard)/habits/actions'
import { toast } from 'react-hot-toast'

interface Habit {
  id: string
  name: string
  description: string | null
  color: string | null
}

interface HabitWithLog extends Habit {
  isCompletedToday: boolean
  currentStreak: number
}

interface TodayChecklistProps {
  habits: HabitWithLog[]
  todayStr: string
}

export function TodayChecklist({ habits, todayStr }: TodayChecklistProps) {
  const [isPending, startTransition] = useTransition()
  
  // State optimistic untuk menampung status completion dari tiap habit
  const [optimisticHabits, toggleOptimisticHabit] = useOptimistic(
    habits,
    (state, { habitId, newChecked }: { habitId: string, newChecked: boolean }) => {
      return state.map(habit => {
        if (habit.id === habitId) {
          return {
            ...habit,
            isCompletedToday: newChecked,
            currentStreak: newChecked ? habit.currentStreak + 1 : Math.max(0, habit.currentStreak - 1)
          }
        }
        return habit
      })
    }
  )

  const handleToggle = (habitId: string, currentChecked: boolean) => {
    const newChecked = !currentChecked
    const habit = habits.find(h => h.id === habitId)
    
    // Update UI seketika
    toggleOptimisticHabit({ habitId, newChecked })

    // Lakukan request server di background
    startTransition(async () => {
      try {
        await toggleHabitLog(habitId, todayStr, newChecked)
        if (newChecked) {
          toast.success(`${habit?.name} diselesaikan!`, { icon: '🔥' })
        }
      } catch (error) {
        console.error('Failed to toggle habit:', error)
        toast.error('Gagal memperbarui status habit')
      }
    })
  }

  // Sorting: belum selesai di atas, sudah selesai di bawah
  const sortedHabits = [...optimisticHabits].sort((a, b) => {
    if (a.isCompletedToday === b.isCompletedToday) {
      // Jika sama-sama selesai / belum, pertahankan urutan aslinya
      return 0
    }
    return a.isCompletedToday ? 1 : -1
  })

  if (habits.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center">
        <p className="text-sm text-zinc-500">Belum ada habit untuk dicentang. Mulai buat habit pertamamu!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sortedHabits.map(habit => (
        <HabitCard
          key={habit.id}
          habit={habit}
          isCompleted={habit.isCompletedToday}
          streak={habit.currentStreak}
          onToggle={() => handleToggle(habit.id, habit.isCompletedToday)}
          disabled={isPending}
        />
      ))}
    </div>
  )
}
