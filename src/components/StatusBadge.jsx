export function StatusBadge({ status }) {
  const isBlackout = status === 'BLACKOUT'
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
      isBlackout ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'
    }`}>
      <span className={`w-2 h-2 rounded-full animate-pulse ${isBlackout ? 'bg-red-400' : 'bg-green-400'}`} />
      {status}
    </div>
  )
}
