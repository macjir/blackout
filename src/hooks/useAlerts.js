import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useAlerts() {
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => setAlerts(data ?? []))

    const channel = supabase
      .channel('alerts-all')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'alerts' }, (payload) => {
        setAlerts((prev) => [payload.new, ...prev])
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return alerts
}
