import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useMessages(sessionId) {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    if (!sessionId) return

    supabase
      .from('messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at')
      .then(({ data }) => setMessages(data ?? []))

    const channel = supabase
      .channel(`messages-${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [sessionId])

  return messages
}
