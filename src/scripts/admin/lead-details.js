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

      // SAVE ACTIVE LEAD

      localStorage.setItem(
        'crmActiveLead',
        leadId
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

      // REMOVE ACTIVE LEAD

      localStorage.removeItem(
        'crmActiveLead'
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

  // AUTO OPEN DETAILS SECTION

  const params =
    new URLSearchParams(
      window.location.search
    )

  const leadId =
    params.get('lead')

  if (leadId) {

    const dashboardSections =

      document.querySelectorAll(
        '.dashboard-section'
      )

    dashboardSections.forEach(
      (section) => {

        section.classList.add(
          'hidden'
        )

      }
    )

    document
      .getElementById(
        'leadDetailsSection'
      )
      ?.classList.remove(
        'hidden'
      )

  }

}

// =========================
// INIT
// =========================

initLeadDetails()