// =========================
// MODALS
// =========================

export function initModals() {

  window.openModal =
    (index) => {

      const modal =

        document.getElementById(
          `modal-${index}`
        )

      if (!modal) return

      modal.classList.remove(
        'hidden'
      )

      // PREVENT BODY SCROLL

      document.body.classList.add(
        'overflow-hidden'
      )

    }

  window.closeModal =
    (index) => {

      const modal =

        document.getElementById(
          `modal-${index}`
        )

      if (!modal) return

      modal.classList.add(
        'hidden'
      )

      // RESTORE BODY SCROLL

      document.body.classList.remove(
        'overflow-hidden'
      )

    }

  // CLOSE ON BACKDROP CLICK

  document
    .querySelectorAll(
      '.modal-backdrop'
    )
    .forEach((backdrop) => {

      backdrop.addEventListener(
        'click',
        (e) => {

          if (
            e.target === backdrop
          ) {

            backdrop.classList.add(
              'hidden'
            )

            document.body.classList.remove(
              'overflow-hidden'
            )

          }

        }
      )

    })

  // ESC CLOSE

  document.addEventListener(
    'keydown',
    (e) => {

      if (e.key === 'Escape') {

        document
          .querySelectorAll(
            '.modal-backdrop'
          )
          .forEach((modal) => {

            modal.classList.add(
              'hidden'
            )

          })

        document.body.classList.remove(
          'overflow-hidden'
        )

      }

    }
  )

}

// =========================
// INIT
// =========================

initModals()