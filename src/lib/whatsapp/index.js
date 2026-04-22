import twilio from 'twilio'

export async function sendWhatsAppToAdmins({ type, action, entity, entityId, metadata }) {
  const numbers = process.env.ADMIN_WHATSAPP_NUMBERS
    ?.split(',')
    .map(n => n.trim())
    .filter(Boolean)
    .map(n => n.startsWith('whatsapp:') ? n : `whatsapp:${n}`)

  if (!numbers?.length) {
    console.warn('[WhatsApp] ADMIN_WHATSAPP_NUMBERS is not set — skipping notification')
    return
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_WHATSAPP_FROM

  if (!accountSid || !authToken || !from) {
    console.warn('[WhatsApp] Missing Twilio credentials — skipping notification')
    return
  }

  const client = twilio(accountSid, authToken)

  const lines = [
    `*[Impervia Estates]*`,
    `Event: ${type}`,
    `Action: ${action}`,
    `Entity: ${entity}${entityId ? ` (${entityId})` : ''}`,
  ]

  if (metadata && Object.keys(metadata).length) {
    const detail = Object.entries(metadata)
      .map(([k, v]) => `  ${k}: ${v}`)
      .join('\n')
    lines.push(`Details:\n${detail}`)
  }

  lines.push(`Time: ${new Date().toUTCString()}`)

  const body = lines.join('\n')

  const results = await Promise.allSettled(
    numbers.map(to =>
      client.messages.create({ from, to, body })
    )
  )

  results.forEach((result, i) => {
    if (result.status === 'rejected') {
      console.error(`[WhatsApp] Failed to send to ${numbers[i]}:`, result.reason?.message || result.reason)
    }
  })
}
