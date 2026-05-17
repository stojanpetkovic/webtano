import { supabase }
from '../../lib/client/supabase.js'

export async function POST({
  request
}) {

  try {

    const {
      id,
      notes
    } = await request.json()

    const { error } =
      await supabase

        .from('leads')

        .update({
          notes
        })

        .eq('id', id)

    if (error) {

      console.error(error)

      return new Response(

        JSON.stringify({
          success: false
        }),

        {
          status: 500
        }

      )

    }

    return new Response(

      JSON.stringify({
        success: true
      }),

      {
        status: 200
      }

    )

  } catch (err) {

    console.error(err)

    return new Response(

      JSON.stringify({
        success: false
      }),

      {
        status: 500
      }

    )

  }

}