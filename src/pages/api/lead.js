export const prerender = false

import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

import { client } from '../../config/client'

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
)

const resend = new Resend(
  import.meta.env.RESEND_API_KEY
)

export async function POST({ request }) {

  try {

    const body = await request.json()

    console.log('BODY:', body)

    const {

      // Lead data
      name,
      phone,
      message,

      // Client system
      client_id,
      source,
      status,

      // Tracking
      page_url,

      utm_source,
      utm_campaign,
      utm_medium,

      gclid

    } = body

    // =========================
    // VALIDATION
    // =========================

    if (!name || !phone) {

      return new Response(
        JSON.stringify({
          error: 'Name and phone are required'
        }),
        {
          status: 400
        }
      )

    }

    // =========================
    // INSERT LEAD
    // =========================

    const { error } = await supabase
      .from('leads')
      .insert([
        {

          // Lead data
          name,
          phone,
          message,

          // Client
          client_id,

          // System
          source,
          status,

          // Tracking
          page_url,

          utm_source,
          utm_campaign,
          utm_medium,

          gclid

        }
      ])

    // =========================
    // DATABASE ERROR
    // =========================

    if (error) {

      console.error(
        'SUPABASE ERROR:',
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
    // EMAIL NOTIFICATION
    // =========================

    const { error: emailError } =
      await resend.emails.send({

        from: 'onboarding@resend.dev',

        to: [
          client.notificationEmail,
          client.internalNotificationEmail
        ],

        subject:
          `🔥 New Lead - ${client.businessName}`,

        html: `

          <div
            style="
              font-family: Arial;
              padding: 30px;
              background: #111;
              color: white;
            "
          >

            <h1
              style="
                margin-bottom: 10px;
              "
            >
              New Lead Received
            </h1>

            <p
              style="
                color: #999;
                margin-bottom: 30px;
              "
            >
              ${client.businessName}
            </p>

            <div
              style="
                background: #1a1a1a;
                padding: 20px;
                border-radius: 16px;
                margin-bottom: 20px;
              "
            >

              <p>
                <strong>Name:</strong>
                ${name}
              </p>

              <p>
                <strong>Phone:</strong>
                ${phone}
              </p>

              <p>
                <strong>Message:</strong>
                ${message || 'No message'}
              </p>

            </div>

            <div
              style="
                background: #1a1a1a;
                padding: 20px;
                border-radius: 16px;
              "
            >

              <h3>
                Tracking Data
              </h3>

              <p>
                <strong>Source:</strong>
                ${source || '-'}
              </p>

              <p>
                <strong>Campaign:</strong>
                ${utm_campaign || '-'}
              </p>

              <p>
                <strong>UTM Source:</strong>
                ${utm_source || '-'}
              </p>

              <p>
                <strong>UTM Medium:</strong>
                ${utm_medium || '-'}
              </p>

              <p>
                <strong>Page URL:</strong>
                ${page_url || '-'}
              </p>

              <p>
                <strong>GCLID:</strong>
                ${gclid || '-'}
              </p>

            </div>

          </div>

        `
      })

    // =========================
    // EMAIL ERROR
    // =========================

    if (emailError) {

      console.error(
        'EMAIL ERROR:',
        emailError
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