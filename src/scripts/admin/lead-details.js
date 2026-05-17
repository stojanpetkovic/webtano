// =========================
// LEAD DETAILS
// =========================

export function initLeadDetails() {

  window.openLeadDetails =
    (leadId) => {

      // SAVE ACTIVE SECTION

      localStorage.setItem(
        'crmSection',
        'leadDetails'
      )

      // URL

      const url =
        new URL(
          window.location
        )

      url.searchParams.set(
        'lead',
        leadId
      )

      // REDIRECT

      window.location.href =
        url.toString()

    }

  window.closeLeadDetails =
    () => {

      // RESTORE SECTION

      localStorage.setItem(
        'crmSection',
        'leads'
      )

      // URL

      const url =
        new URL(
          window.location
        )

      url.searchParams.delete(
        'lead'
      )

      // REDIRECT

      window.location.href =
        url.toString()

    }

}