export function AlertBanner({ alert }) {
  if (!alert) return null
  return (
    <div className="bg-red-600 text-white px-4 py-3 rounded-xl flex items-start gap-3">
      <span className="text-2xl mt-0.5">⚠️</span>
      <div>
        <p className="font-bold text-sm uppercase tracking-wide">Active Alert — {alert.zone}</p>
        <p className="text-sm mt-1">{alert.message}</p>
        <p className="text-xs text-red-200 mt-1">
          {new Date(alert.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}
