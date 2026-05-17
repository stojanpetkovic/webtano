// =========================
// SIDEBAR NAVIGATION
// =========================

export function initNavigation() {

  const sidebarLinks =

    document.querySelectorAll(
      '.sidebar-link'
    )

  const dashboardSections =

    document.querySelectorAll(
      '.dashboard-section'
    )

  function openSection(sectionId) {

    // HIDE ALL

    dashboardSections.forEach(
      (section) => {

        section.classList.add(
          'hidden'
        )

      }
    )

    // ACTIVE SECTION

    const activeSection =

      document.getElementById(
        `${sectionId}Section`
      )

    activeSection?.classList.remove(
      'hidden'
    )

    // SAVE STATE

    localStorage.setItem(
      'crmSection',
      sectionId
    )

    // CHART INIT

    if (
      sectionId === 'analytics'
    ) {

      setTimeout(() => {

        window.initLeadChart?.()

      }, 200)

    }

  }

  // GLOBAL ACCESS

  window.openSection =
    openSection

  // SIDEBAR EVENTS

  sidebarLinks.forEach(
    (link) => {

      link.addEventListener(
        'click',
        () => {

          const view =
            link.dataset.view

          openSection(view)

        }
      )

    }
  )

  // RESTORE STATE

  const savedSection =

    localStorage.getItem(
      'crmSection'
    )

  if (savedSection) {

    openSection(savedSection)

  } else {

    openSection(
      'dashboard'
    )

  }

}