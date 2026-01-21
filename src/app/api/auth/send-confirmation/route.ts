import { NextRequest, NextResponse } from 'next/server'
import { getResend, getFromAddress, buildEmailTags } from '@/lib/email/resend'
import { renderBrandedEmail } from '@/lib/email/templates'

export async function POST(req: NextRequest) {
  try {
    const { email, actionLink } = await req.json()

    if (!email || !actionLink) {
      return NextResponse.json(
        { error: 'Missing email or actionLink' },
        { status: 400 }
      )
    }

    const resend = getResend()
    await resend.emails.send({
      from: getFromAddress(),
      to: email,
      subject: 'Confirm your email',
      html: renderBrandedEmail({
        heading: 'Confirm your email',
        paragraphs: ['Click below to confirm your email address.'],
        button: { label: 'Confirm', url: actionLink },
        signature: 'Thanks!<br>The Travelama Team',
      }),
      text: `Confirm your email: ${actionLink}`,
      tags: buildEmailTags('signup'),
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
