export function SuggestedButtons({ buttons, onSelect }) {
  if (!buttons || buttons.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {buttons.map((label, i) => (
        <button
          key={i}
          onClick={() => onSelect(label)}
          className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-full border border-slate-600 transition-colors"
        >
          {label}
        </button>
      ))}
    </div>
  )
}
