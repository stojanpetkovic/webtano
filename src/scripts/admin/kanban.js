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

      }
    )

    // DROP

    column.addEventListener(
      'drop',
      async () => {

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

        } catch (err) {

          console.error(err)

        }

      }
    )

  })

}