const BASE = import.meta.env.VITE_N8N_BASE_URL

export async function sendCitizenQuery(payload) {
  const res = await fetch(`${BASE}/citizen-query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res.json()
}

export async function getMayorDraft(payload) {
  const res = await fetch(`${BASE}/mayor-draft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res.json()
}

export async function confirmMayorAlert(payload) {
  const res = await fetch(`${BASE}/mayor-confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res.json()
}
