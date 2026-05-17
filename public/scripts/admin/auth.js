import {
  supabase
}
from '../../../src/lib/client/supabase.js'

// =========================
// AUTH
// =========================

export function initAuth() {

  const logoutBtn =

    document.getElementById(
      'logoutBtn'
    )

  // =========================
  // LOGOUT
  // =========================

  logoutBtn?.addEventListener(
    'click',
    async () => {

      // LOADING STATE

      logoutBtn.disabled = true

      logoutBtn.innerText =
        'Logging out...'

      logoutBtn.classList.add(
        'opacity-70',
        'pointer-events-none'
      )

      try {

        // SIGN OUT

        await supabase.auth.signOut()

        // CLEAR STORAGE

        localStorage.removeItem(
          'crmSection'
        )

        localStorage.removeItem(
          'crmLeadsView'
        )

        localStorage.removeItem(
          'crmActiveLead'
        )

        // REDIRECT

        window.location.href =
          '/login'

      } catch (err) {

        console.error(err)

        // RESTORE BUTTON

        logoutBtn.disabled = false

        logoutBtn.innerText =
          'Logout'

        logoutBtn.classList.remove(
          'opacity-70',
          'pointer-events-none'
        )

        // ALERT

        alert(
          'Logout failed. Please try again.'
        )

      }

    }
  )

}

// =========================
// INIT
// =========================

initAuth()