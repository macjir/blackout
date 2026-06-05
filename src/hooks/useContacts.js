import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useContacts(userId) {
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    if (!userId) return

    supabase
      .from('contacts')
      .select('*')
      .eq('user_id', userId)
      .order('name')
      .then(({ data }) => setContacts(data ?? []))

    const channel = supabase
      .channel(`contacts-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contacts', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setContacts((prev) => [...prev, payload.new])
          } else if (payload.eventType === 'UPDATE') {
            setContacts((prev) => prev.map((c) => (c.id === payload.new.id ? payload.new : c)))
          } else if (payload.eventType === 'DELETE') {
            setContacts((prev) => prev.filter((c) => c.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [userId])

  return contacts
}

export function useAllContacts() {
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    supabase
      .from('contacts')
      .select('*')
      .order('updated_at', { ascending: false })
      .then(({ data }) => setContacts(data ?? []))

    const channel = supabase
      .channel('contacts-all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setContacts((prev) => [payload.new, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setContacts((prev) => prev.map((c) => (c.id === payload.new.id ? payload.new : c)))
        }
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return contacts
}
