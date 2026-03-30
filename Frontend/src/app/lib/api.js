// Central API service — all calls to http://localhost:5000/api/v1

const BASE = 'http://localhost:5000/api/v1'

function getToken() {
  if (typeof window === 'undefined') return null
  const token = localStorage.getItem('token')
  // Guard against literally stored "undefined" or "null" strings
  if (!token || token === 'undefined' || token === 'null') {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return null
  }
  return token
}

function authHeaders() {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function handleResponse(res) {
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

// Wraps fetch — only catches true network errors (connection refused, offline)
// API errors (4xx/5xx) are re-thrown as-is with the real message
async function safeFetch(url, options) {
  let res
  try {
    res = await fetch(url, options)
  } catch {
    // True network error — backend is down or unreachable
    throw new Error('Backend unreachable. Make sure the server is running on port 5000.')
  }
  return handleResponse(res)
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (body) =>
    safeFetch(`${BASE}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    }),

  login: (body) =>
    safeFetch(`${BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    }),

  logout: () =>
    safeFetch(`${BASE}/users/logout`, {
      method: 'POST',
      headers: authHeaders(),
      credentials: 'include',
    }),

  getMe: () =>
    safeFetch(`${BASE}/users/me`, {
      headers: authHeaders(),
      credentials: 'include',
    }),
}

// ── Transactions ──────────────────────────────────────────────────────────────
export const transactionAPI = {
  getAll: () =>
    safeFetch(`${BASE}/transactions`, {
      headers: authHeaders(),
      credentials: 'include',
    }),

  add: (body) =>
    safeFetch(`${BASE}/transactions/add`, {
      method: 'POST',
      headers: authHeaders(),
      credentials: 'include',
      body: JSON.stringify(body),
    }),

  uploadCSV: (formData) =>
    safeFetch(`${BASE}/transactions/upload`, {
      method: 'POST',
      headers: {
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      },
      credentials: 'include',
      body: formData,
    }),
}
