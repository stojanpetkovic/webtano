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
    () => {

      window.open(
        '/api/export-leads',
        '_blank'
      )

    }
  )

}