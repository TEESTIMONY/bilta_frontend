const ORDER_DRAFTS_STORAGE_KEY = 'bilta_product_order_drafts_v1'

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
}

function readDrafts() {
  if (!isBrowser()) return {}

  try {
    const raw = window.sessionStorage.getItem(ORDER_DRAFTS_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeDrafts(drafts) {
  if (!isBrowser()) return
  window.sessionStorage.setItem(ORDER_DRAFTS_STORAGE_KEY, JSON.stringify(drafts))
}

function normalizeUploadedDesigns(items) {
  if (!Array.isArray(items)) return []

  return items
    .map((item) => ({
      name: String(item?.name || '').trim(),
      size: Number(item?.size || 0),
      type: String(item?.type || '').trim(),
    }))
    .filter((item) => item.name)
}

function normalizeDraft(draft) {
  return {
    quantity: Math.max(1, Number(draft?.quantity || 1)),
    size: String(draft?.size || '').trim(),
    finishing: String(draft?.finishing || '').trim(),
    notes: String(draft?.notes || '').trim(),
    uploadedDesigns: normalizeUploadedDesigns(draft?.uploadedDesigns),
  }
}

export function getOrderDraft(slug) {
  const drafts = readDrafts()
  return normalizeDraft(drafts?.[slug])
}

export function saveOrderDraft(slug, draft) {
  if (!slug) return
  const drafts = readDrafts()
  drafts[slug] = normalizeDraft(draft)
  writeDrafts(drafts)
}

export function clearOrderDraft(slug) {
  if (!slug) return
  const drafts = readDrafts()
  delete drafts[slug]
  writeDrafts(drafts)
}

export function buildSpecificationSummary(draft) {
  const parts = []

  if (draft?.size) parts.push(`Size/format: ${draft.size}`)
  if (draft?.finishing) parts.push(`Finishing: ${draft.finishing}`)
  if (draft?.notes) parts.push(`Notes: ${draft.notes}`)

  return parts.join(' | ')
}
