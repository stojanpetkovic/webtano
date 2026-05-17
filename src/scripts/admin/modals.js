// =========================
// MODALS
// =========================

export function initModals() {

  window.openModal =
    (index) => {

      document
        .getElementById(
          `modal-${index}`
        )
        ?.classList.remove(
          'hidden'
        )

    }

  window.closeModal =
    (index) => {

      document
        .getElementById(
          `modal-${index}`
        )
        ?.classList.add(
          'hidden'
        )

    }

}