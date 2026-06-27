'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const fullName = formData.get('fullName') as string

  // Supabase Auth stores user metadata like full_name in raw_user_meta_data
  const { error } = await supabase.auth.updateUser({
    data: { full_name: fullName }
  })

  if (error) {
    throw new Error('Failed to update profile: ' + error.message)
  }

  // Update public.users as well if it's handled manually, but according to PRD:
  // "Disinkronisasi otomatis dari auth.users Supabase via database trigger."
  // So updating auth.users should trigger the update on public.users.
  // Actually, auth.users update might not trigger an update trigger unless it's configured.
  // To be safe, we can manually update public.users since we only care about the UI displaying it.
  
  await supabase
    .from('users')
    .update({ full_name: fullName })
    .eq('id', user.id)

  revalidatePath('/settings')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
