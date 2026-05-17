// =========================
// LEAD ACTIONS
// =========================

export function initLeadActions() {

  // =========================
  // SAVE STATUS
  // =========================

  const saveButtons =

    document.querySelectorAll(
      '.saveBtn'
    )

  saveButtons.forEach((button) => {

    button.addEventListener(
      'click',
      async () => {

        const id =
          button.dataset.id

        const statusSelect =
          document.getElementById(
            `status-${id}`
          )

        const status =
          statusSelect?.value

        const savedText =
          document.getElementById(
            `saved-${id}`
          )

        if (savedText) {

          savedText.innerText =
            'Saving...'

        }

        try {

          const response =

            await fetch(
              '/api/update-status',
              {

                method: 'POST',

                headers: {

                  'Content-Type':
                    'application/json'

                },

                body: JSON.stringify({

                  id,
                  status

                })

              }
            )

          if (!response.ok) {

            if (savedText) {

              savedText.innerText =
                'Error'

            }

            return

          }

          if (savedText) {

            savedText.innerText =
              'Saved ✓'

          }

        } catch (err) {

          console.error(err)

          if (savedText) {

            savedText.innerText =
              'Error'

          }

        }

      }
    )

  })

  // =========================
  // SAVE NOTES
  // =========================

  const saveNotesButtons =

    document.querySelectorAll(
      '.saveNotesBtn'
    )

  saveNotesButtons.forEach((button) => {

    button.addEventListener(
      'click',
      async () => {

        const id =
          button.dataset.id

        const notesTextarea =
          document.getElementById(
            `notes-${id}`
          )

        const notes =
          notesTextarea?.value || ''

        const savedText =
          document.getElementById(
            `notesSaved-${id}`
          )

        if (savedText) {

          savedText.innerText =
            'Saving...'

        }

        try {

          const response =

            await fetch(
              '/api/update-notes',
              {

                method: 'POST',

                headers: {

                  'Content-Type':
                    'application/json'

                },

                body: JSON.stringify({

                  id,
                  notes

                })

              }
            )

          if (!response.ok) {

            if (savedText) {

              savedText.innerText =
                'Error'

            }

            return

          }

          if (savedText) {

            savedText.innerText =
              'Saved ✓'

          }

        } catch (err) {

          console.error(err)

          if (savedText) {

            savedText.innerText =
              'Error'

          }

        }

      }
    )

  })

}