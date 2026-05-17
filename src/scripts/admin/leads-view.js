// =========================
// LEADS VIEW SWITCHER
// =========================

export function initLeadsView() {

  const tableViewBtn =

    document.getElementById(
      'tableViewBtn'
    )

  const kanbanViewBtn =

    document.getElementById(
      'kanbanViewBtn'
    )

  const tableView =

    document.getElementById(
      'tableView'
    )

  const kanbanView =

    document.getElementById(
      'kanbanView'
    )

  const paginationWrapper =

    document.getElementById(
      'paginationWrapper'
    )

  const advancedFilters =

    document.getElementById(
      'advancedFilters'
    )

  function setLeadsView(view) {

    if (view === 'table') {

      // TABLE

      tableView?.classList.remove(
        'hidden'
      )

      kanbanView?.classList.add(
        'hidden'
      )

      // FILTERS

      advancedFilters?.classList.remove(
        'hidden'
      )

      // PAGINATION

      paginationWrapper?.classList.remove(
        'hidden'
      )

      // BUTTONS

      tableViewBtn?.classList.add(
        'bg-zinc-900',
        'text-white'
      )

      kanbanViewBtn?.classList.remove(
        'bg-zinc-900',
        'text-white'
      )

    } else {

      // KANBAN

      kanbanView?.classList.remove(
        'hidden'
      )

      tableView?.classList.add(
        'hidden'
      )

      // FILTERS

      advancedFilters?.classList.add(
        'hidden'
      )

      // PAGINATION

      paginationWrapper?.classList.add(
        'hidden'
      )

      // BUTTONS

      kanbanViewBtn?.classList.add(
        'bg-zinc-900',
        'text-white'
      )

      tableViewBtn?.classList.remove(
        'bg-zinc-900',
        'text-white'
      )

    }

    localStorage.setItem(
      'crmLeadsView',
      view
    )

  }

  // GLOBAL ACCESS

  window.setLeadsView =
    setLeadsView

  // EVENTS

  tableViewBtn?.addEventListener(
    'click',
    () => {

      setLeadsView(
        'table'
      )

    }
  )

  kanbanViewBtn?.addEventListener(
    'click',
    () => {

      setLeadsView(
        'kanban'
      )

    }
  )

  // RESTORE

  const savedView =

    localStorage.getItem(
      'crmLeadsView'
    )

  if (savedView) {

    setLeadsView(
      savedView
    )

  } else {

    setLeadsView(
      'table'
    )

  }

}

// =========================
// INIT
// =========================

initLeadsView()