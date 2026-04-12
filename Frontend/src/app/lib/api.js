// Central API service — backend URL is configurable via NEXT_PUBLIC_API_URL.
// Deployed backend is hosted at https://r4rupee.onrender.com.
const BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://r4rupee.onrender.com').replace(/\/$/, '') + '/api'

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
  if (!res.ok) throw new Error(data.message || data.error || 'Request failed')
  return data
}

// Wraps fetch — only catches true network errors (connection refused, offline)
// API errors (4xx/5xx) are re-thrown as-is with the real message
async function safeFetch(url, options) {
  let res
  try {
    res = await fetch(url, options)
  } catch {
    // True network error — backend is down, unreachable, or blocked by CORS
    throw new Error('Network error: Backend is unreachable. If deployed, it may be asleep or blocked by CORS. If local, make sure it is running.')
  }
  return handleResponse(res)
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (body) =>
    safeFetch(`${BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    }),

  login: (body) =>
    safeFetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    }),

  logout: () => Promise.resolve(),

  getMe: () =>
    safeFetch(`${BASE}/users/profile`, {
      headers: authHeaders(),
      credentials: 'include',
    }),
}

// ── Transactions ──────────────────────────────────────────────────────────────
export const transactionAPI = {
  getAll: () =>
    safeFetch(`${BASE}/transaction`, {
      headers: authHeaders(),
      credentials: 'include',
    }),

  add: (body) =>
    safeFetch(`${BASE}/transaction`, {
      method: 'POST',
      headers: authHeaders(),
      credentials: 'include',
      body: JSON.stringify(body),
    }),

  remove: (id) =>
    safeFetch(`${BASE}/transaction/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
      credentials: 'include',
    }),

  uploadCSV: (formData) =>
    safeFetch(`${BASE}/scan`, {
      method: 'POST',
      headers: {
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      },
      credentials: 'include',
      body: formData,
    }),
}
