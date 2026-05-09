const CART_STORAGE_KEY = 'bilta_cart_v1'

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function normalizeItem(item) {
  return {
    cartKey: String(item?.cartKey || item?.slug || ''),
    slug: String(item?.slug || ''),
    title: String(item?.title || 'Untitled Product'),
    price: String(item?.price || 'Price on request'),
    image: String(item?.image || ''),
    quantity: Math.max(1, Number(item?.quantity || 1)),
    requestMode: String(item?.requestMode || 'standard'),
    specificationSummary: String(item?.specificationSummary || ''),
    uploadBundleId: String(item?.uploadBundleId || ''),
    uploadedDesignNames: Array.isArray(item?.uploadedDesignNames)
      ? item.uploadedDesignNames.map((entry) => String(entry || '').trim()).filter(Boolean)
      : [],
  }
}

function emitCartUpdated() {
  if (!isBrowser()) return
  window.dispatchEvent(new Event('cart:updated'))
}

export function getCartItems() {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map(normalizeItem).filter((item) => item.slug && item.cartKey)
  } catch {
    return []
  }
}

function saveCartItems(items) {
  if (!isBrowser()) return
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  emitCartUpdated()
}

export function addCartItem(item) {
  const incoming = normalizeItem(item)
  if (!incoming.slug) return

  const current = getCartItems()
  const existingIndex = current.findIndex((entry) => entry.cartKey === incoming.cartKey)

  if (existingIndex >= 0) {
    current[existingIndex] = {
      ...current[existingIndex],
      quantity: current[existingIndex].quantity + incoming.quantity,
    }
  } else {
    current.push(incoming)
  }

  saveCartItems(current)
}

export function updateCartItemQuantity(slug, quantity) {
  const current = getCartItems()
  const updated = current.map((item) =>
    item.cartKey === slug ? { ...item, quantity: Math.max(1, Number(quantity || 1)) } : item,
  )
  saveCartItems(updated)
}

export function removeCartItem(slug) {
  const current = getCartItems()
  saveCartItems(current.filter((item) => item.cartKey !== slug))
}

export function clearCart() {
  if (!isBrowser()) return
  window.localStorage.removeItem(CART_STORAGE_KEY)
  emitCartUpdated()
}

export function getCartCount() {
  return getCartItems().reduce((sum, item) => sum + item.quantity, 0)
}
