import { supabase }
from './supabase.js'

export async function getSession() {

  const {
    data: { session }
  } = await supabase.auth.getSession()

  return session

}

export async function signOut() {

  await supabase.auth.signOut()

}