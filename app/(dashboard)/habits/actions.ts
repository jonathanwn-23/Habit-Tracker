'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createHabit(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const color = formData.get('color') as string

  const { error } = await supabase.from('habits').insert({
    user_id: user.id,
    name,
    description,
    color,
    icon: '', // Sesuai permintaan, tidak menggunakan ikon
  })

  if (error) {
    throw new Error('Failed to create habit: ' + error.message)
  }

  revalidatePath('/habits')
  redirect('/habits')
}

export async function updateHabit(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const color = formData.get('color') as string

  const { error } = await supabase
    .from('habits')
    .update({ name, description, color })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw new Error('Failed to update habit: ' + error.message)
  }

  revalidatePath('/habits')
  redirect('/habits')
}

export async function archiveHabit(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error } = await supabase
    .from('habits')
    .update({ is_archived: true })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw new Error('Failed to archive habit: ' + error.message)
  }

  revalidatePath('/habits')
}

export async function restoreHabit(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error } = await supabase
    .from('habits')
    .update({ is_archived: false })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw new Error('Failed to restore habit: ' + error.message)
  }

  revalidatePath('/habits')
}

export async function toggleHabitLog(habitId: string, logDate: string, isChecked: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // Verifikasi habit milik user
  const { data: habit } = await supabase
    .from('habits')
    .select('id')
    .eq('id', habitId)
    .eq('user_id', user.id)
    .single()

  if (!habit) {
    throw new Error('Habit not found or unauthorized')
  }

  if (isChecked) {
    const { error } = await supabase
      .from('habit_logs')
      .insert({ habit_id: habitId, log_date: logDate })
    
    if (error && error.code !== '23505') { // Abaikan error duplikat jika sudah ada
      throw new Error('Failed to check in: ' + error.message)
    }
  } else {
    const { error } = await supabase
      .from('habit_logs')
      .delete()
      .eq('habit_id', habitId)
      .eq('log_date', logDate)

    if (error) {
      throw new Error('Failed to uncheck: ' + error.message)
    }
  }

  revalidatePath('/dashboard')
}
