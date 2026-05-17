// =========================
// KANBAN DRAG & DROP
// =========================

export function initKanban() {

  let draggedCard = null

  const leadCards =

    document.querySelectorAll(
      '.lead-card'
    )

  const kanbanColumns =

    document.querySelectorAll(
      '.kanban-column'
    )

  // DRAG START

  leadCards.forEach((card) => {

    card.addEventListener(
      'dragstart',
      () => {

        draggedCard = card

        // DRAG STYLE

        card.classList.add(
          'opacity-50',
          'scale-[0.98]'
        )

      }
    )

    // DRAG END

    card.addEventListener(
      'dragend',
      () => {

        card.classList.remove(
          'opacity-50',
          'scale-[0.98]'
        )

      }
    )

  })

  // COLUMNS

  kanbanColumns.forEach((column) => {

    // DRAG OVER

    column.addEventListener(
      'dragover',
      (e) => {

        e.preventDefault()

        column.classList.add(
          'ring-2',
          'ring-zinc-300'
        )

      }
    )

    // DRAG LEAVE

    column.addEventListener(
      'dragleave',
      () => {

        column.classList.remove(
          'ring-2',
          'ring-zinc-300'
        )

      }
    )

    // DROP

    column.addEventListener(
      'drop',
      async () => {

        column.classList.remove(
          'ring-2',
          'ring-zinc-300'
        )

        if (!draggedCard) return

        // MOVE CARD

        column
          .querySelector(
            '.overflow-y-auto'
          )
          ?.appendChild(
            draggedCard
          )

        // UPDATE COUNTS

        kanbanColumns.forEach(
          (col) => {

            const count =

              col.querySelectorAll(
                '.lead-card'
              ).length

            const countEl =

              col.querySelector(
                '.kanban-count'
              )

            if (countEl) {

              countEl.innerText =
                count

            }

          }
        )

        // UPDATE STATUS

        const id =
          draggedCard.dataset.id

        const status =
          column.dataset.status

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

            console.error(
              'Failed to update status'
            )

          }

        } catch (err) {

          console.error(err)

        }

      }
    )

  })

}

// =========================
// INIT
// =========================

initKanban()