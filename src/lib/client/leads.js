import { supabase }
from './supabase.js'

export async function getLeads(
  clientId
) {

  const {
    data,
    error
  } = await supabase

    .from('leads')

    .select('*')

    .eq('client_id', clientId)

    .order('created_at', {
      ascending: false
    })

  if (error) {

    console.error(error)

    return []

  }

  return data || []

}

export function getLeadAnalytics(
  leads
) {

  return {

    total:
      leads.length,

    newLeads:
      leads.filter(
        l => l.status === 'new'
      ).length,

    contacted:
      leads.filter(
        l => l.status === 'contacted'
      ).length,

    won:
      leads.filter(
        l => l.status === 'won'
      ).length,

    lost:
      leads.filter(
        l => l.status === 'lost'
      ).length

  }

}