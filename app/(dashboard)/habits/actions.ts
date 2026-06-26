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
