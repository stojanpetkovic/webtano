import { supabase }
from './supabase.js'

export async function getUserByEmail(
  email
) {

  const {
    data,
    error
  } = await supabase

    .from('users')

    .select('*')

    .ilike(
      'email',
      email.trim()
    )

    .maybeSingle()

  if (error) {

    console.error(error)

    return null

  }

  return data

}