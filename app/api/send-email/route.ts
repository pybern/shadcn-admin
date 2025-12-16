import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { to, subject, shipmentId, shipmentDetails } = await request.json()

    if (!to) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      )
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: [to],
      subject: subject || `Shipment Update - ${shipmentId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Shipment Update</h2>
          <p>Here are the details for your shipment:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #f5f5f5;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Reference ID</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${shipmentDetails?.ref_id || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Status</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${shipmentDetails?.status || '-'}</td>
            </tr>
            <tr style="background-color: #f5f5f5;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Route</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${shipmentDetails?.from || '-'} → ${shipmentDetails?.to || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Price</td>
              <td style="padding: 12px; border: 1px solid #ddd;">$${shipmentDetails?.price_sell?.toLocaleString('en-AU', { minimumFractionDigits: 2 }) || '-'}</td>
            </tr>
            ${shipmentDetails?.note_l1 ? `
            <tr style="background-color: #f5f5f5;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Title</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${shipmentDetails.note_l1}</td>
            </tr>
            ` : ''}
            ${shipmentDetails?.note_l2 ? `
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Notes</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${shipmentDetails.note_l2}</td>
            </tr>
            ` : ''}
          </table>
          
          <p style="color: #666; font-size: 14px;">
            This is a test email sent from the Shipments Management System.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}

