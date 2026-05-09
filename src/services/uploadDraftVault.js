const uploadDrafts = new Map()

function buildUploadDraftId() {
  return `upload_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

export function saveUploadDraftFiles(entries) {
  const normalizedEntries = Array.isArray(entries) ? entries.filter((item) => item?.file) : []
  if (!normalizedEntries.length) {
    return ''
  }

  const draftId = buildUploadDraftId()
  uploadDrafts.set(draftId, normalizedEntries)
  return draftId
}

export function getUploadDraftFiles(draftId) {
  return draftId ? uploadDrafts.get(draftId) || [] : []
}

export function clearUploadDraftFiles(draftId) {
  if (!draftId) return
  uploadDrafts.delete(draftId)
}
