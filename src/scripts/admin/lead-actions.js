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

        // LOADING

        if (savedText) {

          savedText.innerText =
            'Saving...'

          savedText.classList.remove(
            'text-red-500',
            'text-emerald-600'
          )

          savedText.classList.add(
            'text-zinc-400'
          )

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

          // ERROR

          if (!response.ok) {

            if (savedText) {

              savedText.innerText =
                'Error'

              savedText.classList.remove(
                'text-zinc-400'
              )

              savedText.classList.add(
                'text-red-500'
              )

            }

            return

          }

          // SUCCESS

          if (savedText) {

            savedText.innerText =
              'Saved ✓'

            savedText.classList.remove(
              'text-zinc-400'
            )

            savedText.classList.add(
              'text-emerald-600'
            )

          }

        } catch (err) {

          console.error(err)

          if (savedText) {

            savedText.innerText =
              'Error'

            savedText.classList.remove(
              'text-zinc-400'
            )

            savedText.classList.add(
              'text-red-500'
            )

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

        // LOADING

        if (savedText) {

          savedText.innerText =
            'Saving...'

          savedText.classList.remove(
            'text-red-500',
            'text-emerald-600'
          )

          savedText.classList.add(
            'text-zinc-400'
          )

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

          // ERROR

          if (!response.ok) {

            if (savedText) {

              savedText.innerText =
                'Error'

              savedText.classList.remove(
                'text-zinc-400'
              )

              savedText.classList.add(
                'text-red-500'
              )

            }

            return

          }

          // SUCCESS

          if (savedText) {

            savedText.innerText =
              'Saved ✓'

            savedText.classList.remove(
              'text-zinc-400'
            )

            savedText.classList.add(
              'text-emerald-600'
            )

          }

        } catch (err) {

          console.error(err)

          if (savedText) {

            savedText.innerText =
              'Error'

            savedText.classList.remove(
              'text-zinc-400'
            )

            savedText.classList.add(
              'text-red-500'
            )

          }

        }

      }
    )

  })

}

// =========================
// INIT
// =========================

initLeadActions()