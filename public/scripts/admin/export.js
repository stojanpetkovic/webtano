// =========================
// EXPORT
// =========================

export function initExport() {

  const exportExcelBtn =

    document.getElementById(
      'exportExcelBtn'
    )

  exportExcelBtn?.addEventListener(
    'click',
    async () => {

      // LOADING STATE

      const originalText =

        exportExcelBtn.innerText

      exportExcelBtn.disabled = true

      exportExcelBtn.innerText =
        'Exporting...'

      exportExcelBtn.classList.add(
        'opacity-70',
        'pointer-events-none'
      )

      try {

        // DOWNLOAD

        window.open(
          '/api/export-leads',
          '_blank'
        )

        // SUCCESS

        setTimeout(() => {

          exportExcelBtn.disabled = false

          exportExcelBtn.innerText =
            originalText

          exportExcelBtn.classList.remove(
            'opacity-70',
            'pointer-events-none'
          )

        }, 1500)

      } catch (err) {

        console.error(err)

        // ERROR STATE

        exportExcelBtn.disabled = false

        exportExcelBtn.innerText =
          'Export Failed'

        exportExcelBtn.classList.remove(
          'opacity-70',
          'pointer-events-none'
        )

        // RESTORE

        setTimeout(() => {

          exportExcelBtn.innerText =
            originalText

        }, 2000)

      }

    }
  )

}

// =========================
// INIT
// =========================

initExport()