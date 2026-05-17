// =========================
// LEADS FILTERS
// =========================

export function initFilters() {

  const searchInput =

    document.getElementById(
      'searchInput'
    )

  const statusFilter =

    document.getElementById(
      'statusFilter'
    )

  const fromDate =

    document.getElementById(
      'fromDate'
    )

  const toDate =

    document.getElementById(
      'toDate'
    )

  const rows =

    Array.from(

      document.querySelectorAll(
        '#tableView tbody tr'
      )

    )

  function filterLeads() {

    const search =

      searchInput?.value
        ?.toLowerCase() || ''

    const status =

      statusFilter?.value
        ?.toLowerCase() || ''

    const from =
      fromDate?.value

    const to =
      toDate?.value

    rows.forEach((row) => {

      const text =

        row.innerText
          .toLowerCase()

      const rowStatus =

        row.querySelector('select')
          ?.value
          ?.toLowerCase() || ''

      const dateText =

        row.querySelector(
          '.lead-date'
        )?.dataset.date

      const rowDate =

        dateText

          ? new Date(dateText)

          : null

      // SEARCH

      const matchesSearch =

        text.includes(search)

      // STATUS

      const matchesStatus =

        !status ||

        rowStatus === status

      // FROM

      const matchesFrom =

        !from ||

        (
          rowDate &&
          rowDate >= new Date(from)
        )

      // TO

      const matchesTo =

        !to ||

        (
          rowDate &&
          rowDate <= new Date(
            `${to}T23:59:59`
          )
        )

      // FINAL

      if (

        matchesSearch &&
        matchesStatus &&
        matchesFrom &&
        matchesTo

      ) {

        row.style.display = ''

      } else {

        row.style.display =
          'none'

      }

    })

  }

  // GLOBAL ACCESS

  window.filterLeads =
    filterLeads

  // EVENTS

  searchInput?.addEventListener(
    'input',
    filterLeads
  )

  statusFilter?.addEventListener(
    'change',
    filterLeads
  )

  fromDate?.addEventListener(
    'change',
    filterLeads
  )

  toDate?.addEventListener(
    'change',
    filterLeads
  )

}

// =========================
// INIT
// =========================

initFilters()