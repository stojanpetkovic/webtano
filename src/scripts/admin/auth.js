import {
  supabase
}
from '../../lib/client/supabase.js'

// =========================
// AUTH
// =========================

export function initAuth() {

  const logoutBtn =
    document.getElementById(
      'logoutBtn'
    )

  logoutBtn?.addEventListener(
    'click',
    async () => {

      try {

        await supabase.auth.signOut()

        window.location.href =
          '/login'

      } catch (err) {

        console.error(err)

      }

    }
  )

}