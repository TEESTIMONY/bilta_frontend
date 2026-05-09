const AUTH_TOKEN_STORAGE_KEY = 'bilta_cms_auth_token_v1'

export const DJANGO_API_BASE = import.meta.env.VITE_DJANGO_API_BASE || 'http://127.0.0.1:8000/api'
export const USE_DJANGO_API =
  import.meta.env.VITE_USE_DJANGO_API === 'true' || Boolean(import.meta.env.VITE_DJANGO_API_BASE)

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export function getAuthToken() {
  if (!isBrowser()) return ''
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || ''
}

export function setAuthToken(token) {
  if (!isBrowser()) return
  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
  } else {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
  }
}

export function clearAuthToken() {
  if (!isBrowser()) return
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
}

function buildHeaders(extraHeaders = {}) {
  const token = getAuthToken()
  const headers = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  }

  if (token) {
    headers.Authorization = `Token ${token}`
  }

  return headers
}

async function parseErrorPayload(response) {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    try {
      return await response.json()
    } catch {
      return null
    }
  }

  try {
    const text = await response.text()
    return text ? { detail: text } : null
  } catch {
    return null
  }
}

export async function fetchJson(url, options) {
  const response = await fetch(url, {
    headers: buildHeaders(options?.headers),
    ...options,
  })

  if (!response.ok) {
    const payload = await parseErrorPayload(response)
    const message =
      payload?.detail ||
      payload?.non_field_errors?.[0] ||
      `Request failed: ${response.status} ${response.statusText}`

    if (response.status === 401 && isBrowser()) {
      window.dispatchEvent(new CustomEvent('bilta-auth-expired'))
    }

    const error = new Error(message)
    error.status = response.status
    error.payload = payload
    throw error
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export async function fetchAllPages(url) {
  const all = []
  let nextUrl = url

  while (nextUrl) {
    const payload = await fetchJson(nextUrl)
    if (Array.isArray(payload)) return payload

    const results = Array.isArray(payload?.results) ? payload.results : []
    all.push(...results)
    nextUrl = payload?.next || null
  }

  return all
}
