const DJANGO_API_BASE = import.meta.env.VITE_DJANGO_API_BASE || 'http://127.0.0.1:8000/api'
const USE_DJANGO_API = import.meta.env.VITE_USE_DJANGO_API === 'true' || Boolean(import.meta.env.VITE_DJANGO_API_BASE)

function normalizeOrder(item) {
  return {
    ...item,
    customerName: item?.customer_name || '',
    paymentStatus: item?.payment_status || 'unpaid',
    hasBeenMessaged: Boolean(item?.has_been_messaged),
    totalAmount: Number(item?.total_amount || 0),
    amountPaid: Number(item?.amount_paid || 0),
    balanceDue: Number(item?.balance_due || 0),
  }
}

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

export async function getOrdersData() {
  if (!USE_DJANGO_API) {
    return { orders: [], source: 'disabled' }
  }

  const orders = await fetchAllPages(`${DJANGO_API_BASE}/orders/`)
  return { orders: orders.map(normalizeOrder), source: 'django' }
}

export async function updateOrderQuickFields(orderId, updates) {
  const payload = {
    ...updates,
  }

  if ('paymentStatus' in payload) {
    payload.payment_status = payload.paymentStatus
    delete payload.paymentStatus
  }

  if ('hasBeenMessaged' in payload) {
    payload.has_been_messaged = payload.hasBeenMessaged
    delete payload.hasBeenMessaged
  }

  const updated = await fetchJson(`${DJANGO_API_BASE}/orders/${orderId}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })

  return normalizeOrder(updated)
}

export async function createManualOrder({ customerName, phone, totalAmount, notes }) {
  const normalizedAmount = Number(totalAmount || 0)

  const customer = await fetchJson(`${DJANGO_API_BASE}/customers/`, {
    method: 'POST',
    body: JSON.stringify({ full_name: customerName, phone }),
  })

  const code = `JOB-${Date.now()}`
  const order = await fetchJson(`${DJANGO_API_BASE}/orders/`, {
    method: 'POST',
    body: JSON.stringify({
      code,
      customer: customer.id,
      source: 'manual',
      payment_status: 'paid',
      status: 'new',
      total_amount: String(normalizedAmount),
      amount_paid: String(normalizedAmount),
      internal_notes: notes || '',
      currency: 'NGN',
      items: [],
    }),
  })

  return normalizeOrder(order)
}
