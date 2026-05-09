const RAW_WHATSAPP_NUMBER = '08034546604'

function normalizeWhatsAppNumber(value) {
  const digitsOnly = String(value || '').replace(/\D/g, '')

  if (digitsOnly.startsWith('234')) {
    return digitsOnly
  }

  if (digitsOnly.startsWith('0')) {
    return `234${digitsOnly.slice(1)}`
  }

  return digitsOnly
}

export const WHATSAPP_NUMBER = normalizeWhatsAppNumber(RAW_WHATSAPP_NUMBER)

export function buildWhatsAppUrl(message = '') {
  const baseUrl = `https://wa.me/${WHATSAPP_NUMBER}`

  if (!message) {
    return baseUrl
  }

  return `${baseUrl}?text=${encodeURIComponent(message)}`
}
