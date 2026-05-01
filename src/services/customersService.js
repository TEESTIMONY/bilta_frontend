const DJANGO_API_BASE = import.meta.env.VITE_DJANGO_API_BASE || 'http://127.0.0.1:8000/api'
const USE_DJANGO_API = import.meta.env.VITE_USE_DJANGO_API === 'true' || Boolean(import.meta.env.VITE_DJANGO_API_BASE)

async function fetchJson(url, options) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  }

  return response.status === 204 ? null : response.json()
}

async function fetchAllPages(url) {
  const all = []
  let nextUrl = url

  while (nextUrl) {
    const payload = await fetchJson(nextUrl)
    const results = Array.isArray(payload?.results) ? payload.results : []
    all.push(...results)
    nextUrl = payload?.next || null
  }

  return all
}

function normalizeCustomer(item) {
  return {
    ...item,
    ordersCount: Number(item?.orders_count || 0),
    isReturningCustomer: Boolean(item?.is_returning_customer),
  }
}

export async function getCustomersData() {
  if (!USE_DJANGO_API) return { customers: [], source: 'disabled' }
  const customers = await fetchAllPages(`${DJANGO_API_BASE}/customers/`)
  return { customers: customers.map(normalizeCustomer), source: 'django' }
}

export async function createCustomer(payload) {
  const created = await fetchJson(`${DJANGO_API_BASE}/customers/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return normalizeCustomer(created)
}
