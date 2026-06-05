import { supabase } from '../lib/supabase'

export function ContactList({ contacts, userId, onCheckIn }) {
  async function handleCheckIn(contact) {
    await supabase
      .from('contacts')
      .update({ status: 'ok', last_seen: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', contact.id)
    onCheckIn?.(contact)
  }

  async function handleAdd() {
    const name = window.prompt('Contact name:')
    if (!name?.trim()) return
    const phone = window.prompt('Phone number (optional):') || null
    await supabase.from('contacts').insert({ user_id: userId, name: name.trim(), phone, status: 'unknown' })
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Contacts</h3>
        <button
          onClick={handleAdd}
          className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1 rounded-full border border-slate-600 transition-colors"
        >
          + Add contact
        </button>
      </div>
      {contacts.length === 0 && (
        <p className="text-slate-500 text-xs">No contacts yet. Add your family or neighbours.</p>
      )}
      {contacts.map((c) => (
        <div key={c.id} className="flex items-center justify-between bg-slate-800 rounded-xl px-4 py-3">
          <div>
            <p className="text-sm font-medium">{c.name}</p>
            {c.phone && <p className="text-xs text-slate-400">{c.phone}</p>}
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                c.status === 'ok' ? 'bg-green-900 text-green-300' : 'bg-slate-700 text-slate-400'
              }`}
            >
              {c.status === 'ok' ? '✓ OK' : 'Unknown'}
            </span>
            <button
              onClick={() => handleCheckIn(c)}
              className="text-xs bg-blue-700 hover:bg-blue-600 text-white px-2 py-1 rounded-lg transition-colors"
            >
              CHECK-IN
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
