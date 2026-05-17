// =========================
// TABLE PAGINATION
// =========================

export function initPagination() {

  let currentPage = 1

  const perPage = 10

  const rows =

    Array.from(

      document.querySelectorAll(
        '#tableView tbody tr'
      )

    )

  const totalPages =

    Math.ceil(
      rows.length / perPage
    )

  const currentPageEl =

    document.getElementById(
      'currentPage'
    )

  const totalPagesEl =

    document.getElementById(
      'totalPages'
    )

  const nextPageBtn =

    document.getElementById(
      'nextPageBtn'
    )

  const prevPageBtn =

    document.getElementById(
      'prevPageBtn'
    )

  function renderPage() {

    rows.forEach(
      (row, index) => {

        const start =

          (currentPage - 1) *
          perPage

        const end =
          start + perPage

        if (

          index >= start &&
          index < end

        ) {

          row.style.display = ''

        } else {

          row.style.display =
            'none'

        }

      }
    )

    // CURRENT PAGE

    if (currentPageEl) {

      currentPageEl.innerText =
        currentPage

    }

    // TOTAL PAGES

    if (totalPagesEl) {

      totalPagesEl.innerText =
        totalPages

    }

    // BUTTON STATES

    if (prevPageBtn) {

      prevPageBtn.disabled =
        currentPage === 1

    }

    if (nextPageBtn) {

      nextPageBtn.disabled =
        currentPage === totalPages

    }

  }

  // GLOBAL ACCESS

  window.renderPagination =
    renderPage

  // NEXT

  nextPageBtn?.addEventListener(
    'click',
    () => {

      if (
        currentPage <
        totalPages
      ) {

        currentPage++

        renderPage()

      }

    }
  )

  // PREV

  prevPageBtn?.addEventListener(
    'click',
    () => {

      if (
        currentPage > 1
      ) {

        currentPage--

        renderPage()

      }

    }
  )

  // INITIAL

  renderPage()

}

// =========================
// INIT
// =========================

initPagination()