import type {
  APIRoute
}
from 'astro'

import * as XLSX
from 'xlsx'

import {
  supabase
}
from '../../../public/scripts/supabase'

// =========================
// EXPORT LEADS
// =========================

export const GET: APIRoute =
  async () => {

    try {

      // LOAD LEADS

      const {
        data: leads,
        error
      } = await supabase

        .from('leads')

        .select('*')

        .order(
          'created_at',
          {
            ascending: false
          }
        )

      if (error) {

        return new Response(

          JSON.stringify({
            error: error.message
          }),

          {
            status: 500
          }

        )

      }

      // FORMAT DATA

      const formattedLeads =
        (leads || []).map(
          (lead: any) => ({

            Name:
              lead.name || '',

            Phone:
              lead.phone || '',

            Status:
              lead.status || '',

            Source:
              lead.utm_source ||
              lead.source ||
              '',

            Campaign:
              lead.utm_campaign || '',

            Message:
              lead.message || '',

            Notes:
              lead.notes || '',

            Created:
              new Date(
                lead.created_at
              ).toLocaleString()

          })
        )

      // CREATE WORKBOOK

      const workbook =
        XLSX.utils.book_new()

      const worksheet =
        XLSX.utils.json_to_sheet(
          formattedLeads
        )

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'Leads'
      )

      // GENERATE BUFFER

      const excelBuffer =
        XLSX.write(
          workbook,
          {

            type: 'buffer',

            bookType: 'xlsx'

          }
        )

      // FILE NAME

      const date =
        new Date()
          .toISOString()
          .split('T')[0]

      const fileName =
        `crm-leads-${date}.xlsx`

      // RESPONSE

      return new Response(
        excelBuffer,
        {

          status: 200,

          headers: {

            'Content-Type':
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

            'Content-Disposition':
              `attachment; filename="${fileName}"`

          }

        }
      )

    } catch (err: any) {

      return new Response(

        JSON.stringify({
          error:
            err.message
        }),

        {
          status: 500
        }

      )

    }

  }