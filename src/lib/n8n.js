const BASE = (import.meta.env.VITE_N8N_BASE_URL ?? '').replace(/\/+$/, '')

export function buildCitizenPayload({ text, zone, health, contacts, alerts, sessionId }) {
  const coordinatorUpdates = alerts.map((a) => ({
    message: a.message,
    valid_until: a.scheduled_at ?? null,
  }))

  return {
    input: {
      text,
      source: 'chat',
    },
    context: {
      crisis: {
        type: 'blackout',
        area: zone,
      },
      location: zone,
      health: health ?? 'No known conditions',
      contacts: contacts.map((c) => ({
        id: c.id,
        name: c.name,
        phone: c.phone ?? null,
        status: c.status,
      })),
      coordinator_updates: coordinatorUpdates,
    },
    // n8n uses session_id to look up session_context from Supabase
    session_id: sessionId,
  }
}

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
