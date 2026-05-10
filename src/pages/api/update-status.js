export const prerender = false

import { createClient }
from '@supabase/supabase-js'

const supabase = createClient(

  import.meta.env.PUBLIC_SUPABASE_URL,

  import.meta.env.PUBLIC_SUPABASE_ANON_KEY

)

export async function POST({ request }) {

  try {

    const body =
      await request.json()

    console.log(
      'UPDATE BODY:',
      body
    )

    const {
      id,
      status
    } = body

    // =========================
    // VALIDATION
    // =========================

    if (!id || !status) {

      return new Response(

        JSON.stringify({
          error: 'Missing fields'
        }),

        {
          status: 400
        }

      )

    }

    // =========================
    // FIX ID TYPE
    // =========================

    const leadId =
      Number(id)

    // =========================
    // UPDATE STATUS
    // =========================

const { data, error } =
  await supabase
    .from('leads')
    .update({
      status
    })
    .eq('id', leadId)
    .select()

console.log('UPDATED:', data)

    // =========================
    // UPDATE ERROR
    // =========================

    if (error) {

      console.error(
        'UPDATE ERROR:',
        error
      )

      return new Response(

        JSON.stringify({
          error: error.message
        }),

        {
          status: 500
        }

      )

    }

    // =========================
    // SUCCESS
    // =========================

    return new Response(

      JSON.stringify({
        success: true
      }),

      {
        status: 200
      }

    )

  } catch (err) {

    console.error(
      'SERVER ERROR:',
      err
    )

    return new Response(

      JSON.stringify({
        error: 'Server error'
      }),

      {
        status: 500
      }

    )

  }

}