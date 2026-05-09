import {
  DJANGO_API_BASE,
  USE_DJANGO_API,
  clearAuthToken,
  fetchAllPages,
  fetchJson,
  getAuthToken,
  setAuthToken,
} from './api'

export function getStoredCmsToken() {
  return getAuthToken()
}

export function clearCmsSession() {
  clearAuthToken()
}

export async function loginCmsUser({ username, password }) {
  if (!USE_DJANGO_API) {
    throw new Error('CMS login requires the Django API to be enabled.')
  }

  const payload = await fetchJson(`${DJANGO_API_BASE}/auth/login/`, {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })

  setAuthToken(payload?.token || '')
  return payload
}

export async function logoutCmsUser() {
  if (USE_DJANGO_API && getAuthToken()) {
    try {
      await fetchJson(`${DJANGO_API_BASE}/auth/logout/`, {
        method: 'POST',
      })
    } catch {
      // Clear the local token even if the server-side token is already invalid.
    }
  }

  clearAuthToken()
}

export async function getCmsCurrentUser() {
  if (!USE_DJANGO_API || !getAuthToken()) {
    return null
  }

  return fetchJson(`${DJANGO_API_BASE}/auth/me/`)
}

export async function getStaffAccountsData() {
  if (!USE_DJANGO_API) return { accounts: [], source: 'disabled' }
  const accounts = await fetchAllPages(`${DJANGO_API_BASE}/staff-accounts/`)
  return { accounts, source: 'django' }
}

export async function getStaffInvitationsData() {
  if (!USE_DJANGO_API) return { invitations: [], source: 'disabled' }
  const invitations = await fetchAllPages(`${DJANGO_API_BASE}/staff-invitations/`)
  return { invitations, source: 'django' }
}

export async function createStaffInvitation(payload) {
  return fetchJson(`${DJANGO_API_BASE}/staff-invitations/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getStaffInvitationByToken(token) {
  return fetchJson(`${DJANGO_API_BASE}/auth/invitations/${token}/`)
}

export async function acceptStaffInvitation({ token, username, password }) {
  const payload = await fetchJson(`${DJANGO_API_BASE}/auth/invitations/accept/`, {
    method: 'POST',
    body: JSON.stringify({ token, username, password }),
  })

  setAuthToken(payload?.token || '')
  return payload
}

export async function updateStaffAccount(accountId, payload) {
  return fetchJson(`${DJANGO_API_BASE}/staff-accounts/${accountId}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function resetStaffAccountPassword(accountId, newPassword) {
  return fetchJson(`${DJANGO_API_BASE}/staff-accounts/${accountId}/reset-password/`, {
    method: 'POST',
    body: JSON.stringify({ new_password: newPassword }),
  })
}
