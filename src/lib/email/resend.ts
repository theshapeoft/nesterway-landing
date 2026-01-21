import { Resend } from 'resend'

export type EmailTag = { name: string; value: string }

let resendInstance: Resend | null = null

export function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set')
  }
  if (!resendInstance) {
    resendInstance = new Resend(apiKey)
  }
  return resendInstance
}

export function getFromAddress() {
  const from = process.env.RESEND_FROM
  if (!from) {
    throw new Error('RESEND_FROM is not set')
  }
  return from
}

export function buildEmailTags(category: string, extra: EmailTag[] = []): EmailTag[] {
  const env = process.env.APP_ENV || process.env.NODE_ENV || 'development'
  return [{ name: 'category', value: category }, { name: 'env', value: env }, ...extra]
}
