import {
  supabase
}
from '../../lib/client/supabase.js'

// =========================
// REALTIME LEADS
// =========================

export function initRealtime() {

  const channel =

    supabase

      .channel(
        'realtime-leads'
      )

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

          // =========================
          // TOAST NOTIFICATION
          // =========================

          const toast =

            document.createElement(
              'div'
            )

          toast.className =

            `
            fixed
            top-6
            right-6
            z-[9999]
            bg-zinc-900
            text-white
            px-5
            py-4
            rounded-2xl
            shadow-2xl
            text-sm
            font-medium
            animate-pulse
            `

          // TYPE

          if (
            payload.eventType ===
            'INSERT'
          ) {

            toast.innerText =
              '🔥 New lead received'

          } else if (

            payload.eventType ===
            'UPDATE'

          ) {

            toast.innerText =
              '✏️ Lead updated'

          } else {

            toast.innerText =
              '⚡ Lead activity'

          }

          document.body.appendChild(
            toast
          )

          // REMOVE TOAST

          setTimeout(() => {

            toast.remove()

          }, 3500)

          // =========================
          // OPTIONAL AUTO REFRESH
          // =========================

          if (
            payload.eventType ===
            'INSERT'
          ) {

            setTimeout(() => {

              window.location.reload()

            }, 1200)

          }

        }
      )

      .subscribe(

        (status) => {

          console.log(
            'Realtime status:',
            status
          )

        }

      )

  // CLEANUP

  window.addEventListener(
    'beforeunload',
    () => {

      supabase.removeChannel(
        channel
      )

    }
  )

}

// =========================
// INIT
// =========================

initRealtime()