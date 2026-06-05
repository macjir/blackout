import { useState } from 'react'
import { useAlerts } from '../hooks/useAlerts'
import { useAllContacts } from '../hooks/useContacts'
import { getMayorDraft, confirmMayorAlert } from '../lib/n8n'

const ZONE = 'Demo Zone'
const COORDINATOR_ID = 'mayor-1'

export default function MayorApp() {
  const alerts = useAlerts()
  const contacts = useAllContacts()

  const [rawMessage, setRawMessage] = useState('')
  const [draft, setDraft] = useState(null)
  const [editedDraft, setEditedDraft] = useState('')
  const [toneOk, setToneOk] = useState(null)
  const [revisionHint, setRevisionHint] = useState(null)
  const [loadingDraft, setLoadingDraft] = useState(false)
  const [loadingSend, setLoadingSend] = useState(false)
  const [sentAlertId, setSentAlertId] = useState(null)

  async function handleGenerateDraft() {
    if (!rawMessage.trim()) return
    setLoadingDraft(true)
    setDraft(null)
    setSentAlertId(null)
    try {
      const result = await getMayorDraft({ raw_message: rawMessage, zone: ZONE, coordinator_id: COORDINATOR_ID })
      setDraft(result.draft_message)
      setEditedDraft(result.draft_message)
      setToneOk(result.tone_ok)
      setRevisionHint(result.revision_hint)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingDraft(false)
    }
  }

  async function handleSend() {
    if (!editedDraft.trim()) return
    setLoadingSend(true)
    try {
      const result = await confirmMayorAlert({
        final_message: editedDraft,
        zone: ZONE,
        coordinator_id: COORDINATOR_ID,
        scheduled_at: null,
      })
      setSentAlertId(result.alert_id)
      setRawMessage('')
      setDraft(null)
      setEditedDraft('')
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingSend(false)
    }
  }

  async function handleRevise() {
    setDraft(null)
    setEditedDraft('')
  }

  return (
    <div className="min-h-full flex flex-col bg-slate-900">
      {/* Header */}
      <div className="bg-amber-800 px-4 py-4 flex items-center gap-3 border-b border-amber-900">
        <span className="text-2xl">🏛️</span>
        <div>
          <h1 className="font-bold text-white text-lg">Mayor / Coordinator</h1>
          <p className="text-amber-200 text-xs">{ZONE} — Crisis Management</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-6">

        {/* Issue Alert section */}
        <div className="bg-slate-800 rounded-2xl p-5">
          <h2 className="font-semibold text-slate-200 mb-3">Issue Alert</h2>
          <textarea
            value={rawMessage}
            onChange={(e) => setRawMessage(e.target.value)}
            placeholder="Type your raw message, e.g. 'Everyone meet at the square at 4pm'..."
            rows={3}
            className="w-full bg-slate-700 text-slate-100 placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-500 resize-none"
          />
          <button
            onClick={handleGenerateDraft}
            disabled={!rawMessage.trim() || loadingDraft}
            className="mt-3 w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loadingDraft ? 'Generating draft...' : 'Generate Draft'}
          </button>
        </div>

        {/* AI Draft */}
        {draft !== null && (
          <div className="bg-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-semibold text-slate-200">AI Draft</h2>
              {toneOk === true && (
                <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full">✓ Tone OK</span>
              )}
              {toneOk === false && (
                <span className="text-xs bg-orange-900 text-orange-300 px-2 py-0.5 rounded-full">⚠ Review tone</span>
              )}
            </div>
            {revisionHint && (
              <p className="text-xs text-amber-300 bg-amber-900/30 border border-amber-800 rounded-lg px-3 py-2 mb-3">
                💡 {revisionHint}
              </p>
            )}
            <textarea
              value={editedDraft}
              onChange={(e) => setEditedDraft(e.target.value)}
              rows={4}
              className="w-full bg-slate-700 text-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
            <div className="flex gap-3 mt-3">
              <button
                onClick={handleSend}
                disabled={!editedDraft.trim() || loadingSend}
                className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-colors"
              >
                {loadingSend ? 'Sending...' : '📢 Send to all'}
              </button>
              <button
                onClick={handleRevise}
                className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                ↩ Revise
              </button>
            </div>
            {sentAlertId && (
              <p className="text-green-400 text-xs text-center mt-2">
                ✓ Alert sent successfully — broadcasting to all citizens
              </p>
            )}
          </div>
        )}

        {/* Incoming reports */}
        <div className="bg-slate-800 rounded-2xl p-5">
          <h2 className="font-semibold text-slate-200 mb-3">
            Incoming reports
            {contacts.filter((c) => c.status === 'ok').length > 0 && (
              <span className="ml-2 text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full">
                {contacts.filter((c) => c.status === 'ok').length} checked in
              </span>
            )}
          </h2>
          {contacts.length === 0 ? (
            <p className="text-slate-500 text-sm">No citizen reports yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {contacts.map((c) => (
                <div key={c.id} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-slate-200 font-medium">{c.name}</span>
                    {c.phone && <span className="text-slate-500 text-xs ml-2">{c.phone}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        c.status === 'ok' ? 'bg-green-900 text-green-300' : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {c.status === 'ok' ? '✓ OK' : 'Unknown'}
                    </span>
                    {c.last_seen && (
                      <span className="text-slate-500 text-xs">
                        {new Date(c.last_seen).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sent alerts history */}
        {alerts.length > 0 && (
          <div className="bg-slate-800 rounded-2xl p-5">
            <h2 className="font-semibold text-slate-200 mb-3 text-sm">Sent alerts</h2>
            <div className="flex flex-col gap-2">
              {alerts.map((a) => (
                <div key={a.id} className="text-xs border-l-2 border-amber-700 pl-3">
                  <p className="text-slate-300">{a.message}</p>
                  <p className="text-slate-500 mt-0.5">
                    {a.zone} ·{' '}
                    {new Date(a.created_at).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
