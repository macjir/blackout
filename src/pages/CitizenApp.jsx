import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useAlerts } from '../hooks/useAlerts'
import { useMessages } from '../hooks/useMessages'
import { useContacts } from '../hooks/useContacts'
import { ChatWindow } from '../components/ChatWindow'
import { ContactList } from '../components/ContactList'
import { AlertBanner } from '../components/AlertBanner'
import { StatusBadge } from '../components/StatusBadge'
import { sendCitizenQuery } from '../lib/n8n'
import { supabase } from '../lib/supabase'
import { PERSONAS, ZONE } from '../lib/session'

export default function CitizenApp() {
  const { personaId } = useParams()
  const persona = PERSONAS[personaId]

  const alerts = useAlerts()
  const messages = useMessages(persona?.sessionId)
  const contacts = useContacts(persona?.userId)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  if (!persona) return <Navigate to="/citizen/1" replace />

  const latestAlert = alerts[0]
  const status = latestAlert ? 'BLACKOUT' : 'NORMAL'

  async function sendMessage(text) {
    if (!text?.trim() || loading) return

    if (text === '__send_ok__') {
      if (contacts.length === 0) return
      const now = new Date().toISOString()
      await Promise.all(
        contacts.map((c) =>
          supabase.from('contacts').update({ status: 'ok', last_seen: now, updated_at: now }).eq('id', c.id)
        )
      )
      return
    }

    await supabase.from('messages').insert({
      session_id: persona.sessionId,
      role: 'user',
      content: text,
    })

    setInput('')
    setLoading(true)

    await sendCitizenQuery({
      session_id: persona.sessionId,
      text,
      location_zone: ZONE,
      health_status: 'ok',
      contacts: contacts.map((c) => ({ name: c.name, phone: c.phone, status: c.status })),
    })

    setLoading(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const isPurple = persona.color === 'purple'
  const accent = {
    header: isPurple ? 'bg-purple-900' : 'bg-blue-900',
    ring: isPurple ? 'focus:ring-purple-500' : 'focus:ring-blue-500',
    btn: isPurple ? 'bg-purple-600 hover:bg-purple-500' : 'bg-blue-600 hover:bg-blue-500',
  }

  return (
    <div className="min-h-full flex flex-col bg-slate-900">
      {/* Header */}
      <div className={`${accent.header} px-4 py-3 flex items-center justify-between border-b border-slate-700`}>
        <div>
          <h1 className="font-bold text-white">
            {persona.name}{' '}
            <span className="text-slate-300 font-normal text-sm">— {persona.description}</span>
          </h1>
          <p className="text-xs text-slate-400">{ZONE}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-5">
          {latestAlert && <AlertBanner alert={latestAlert} />}

          <ContactList contacts={contacts} userId={persona.userId} />

          <div className="border-t border-slate-700" />

          {alerts.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Updates from coordinator
              </h3>
              <div className="flex flex-col gap-2">
                {alerts.map((a) => (
                  <div key={a.id} className="bg-slate-800 rounded-xl px-4 py-3 text-sm">
                    <p className="text-slate-200">{a.message}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {a.zone} &middot;{' '}
                      {new Date(a.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-slate-700" />

          <div className="flex flex-col flex-1 min-h-[300px]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              AI Assistant
            </h3>
            <ChatWindow messages={messages} onSendSuggestion={sendMessage} loading={loading} />
          </div>
        </div>

        {/* Chat input */}
        <div className="border-t border-slate-700 px-4 py-3 bg-slate-800 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about the situation..."
            className={`flex-1 bg-slate-700 text-slate-100 placeholder-slate-400 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 ${accent.ring}`}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className={`${accent.btn} disabled:opacity-40 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
