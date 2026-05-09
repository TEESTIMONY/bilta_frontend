import { DJANGO_API_BASE, USE_DJANGO_API } from './api'

function ensureBackendEnabled() {
  if (!USE_DJANGO_API) {
    throw new Error('Website order submission requires the Django API to be enabled.')
  }
}

async function submitPublicMultipartRequest(url, payload, files = []) {
  ensureBackendEnabled()

  const formData = new FormData()
  formData.append('payload', JSON.stringify(payload))

  for (const file of files) {
    if (file) {
      formData.append('files', file)
    }
  }

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  })

  const contentType = response.headers.get('content-type') || ''
  const body = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    const message =
      body?.detail ||
      body?.non_field_errors?.[0] ||
      body?.uploaded_design_names?.[0] ||
      `Request failed: ${response.status} ${response.statusText}`
    throw new Error(message)
  }

  return body
}

export async function submitPublicCheckoutRequest(payload, files = []) {
  return submitPublicMultipartRequest(
    `${DJANGO_API_BASE}/public/order-requests/checkout/`,
    payload,
    files,
  )
}

export async function submitPublicDesignRequest(payload, files = []) {
  return submitPublicMultipartRequest(
    `${DJANGO_API_BASE}/public/order-requests/design/`,
    payload,
    files,
  )
}
