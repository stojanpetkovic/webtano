import {
  supabase
}
from '../../lib/client/supabase.js'

// =========================
// REALTIME LEADS
// =========================

export function initRealtime() {

  supabase

    .channel('realtime-leads')

    .on(
      'postgres_changes',
      {

        event: '*',

        schema: 'public',

        table: 'leads'

      },

      (payload) => {

        console.log(
          'Realtime update:',
          payload
        )

      }
    )

    .subscribe()

}