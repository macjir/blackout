import { useNavigate } from 'react-router-dom'
import { useAlerts } from '../hooks/useAlerts'

export default function AlertScreen() {
  const alerts = useAlerts()
  const navigate = useNavigate()
  const latest = alerts[0]

  return (
    <div className="min-h-full flex flex-col bg-slate-900">
      {/* Header */}
      <div className="bg-red-700 px-6 py-5 flex items-center gap-3">
        <span className="text-3xl">🚨</span>
        <div>
          <h1 className="text-xl font-bold text-white">EMERGENCY ALERT</h1>
          <p className="text-red-200 text-sm">Crisis Communication System</p>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 flex flex-col gap-6">
        {/* Current alert */}
        {latest ? (
          <div className="bg-red-900/50 border border-red-700 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wider text-red-400 font-semibold mb-1">
              Zone: {latest.zone}
            </p>
            <p className="text-white text-lg font-semibold leading-snug">{latest.message}</p>
            <p className="text-red-300 text-xs mt-2">
              Issued:{' '}
              {new Date(latest.created_at).toLocaleString('en-GB', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-2xl p-5 text-center">
            <p className="text-slate-400">Waiting for alerts from coordinator...</p>
            <div className="mt-3 w-8 h-8 mx-auto border-2 border-slate-600 border-t-slate-300 rounded-full animate-spin" />
          </div>
        )}

        {/* What this means */}
        <div className="bg-slate-800 rounded-2xl p-5">
          <h2 className="font-semibold text-slate-200 mb-3">What this means for you</h2>
          <ul className="text-sm text-slate-300 space-y-2">
            <li className="flex gap-2"><span>💧</span><span>Fill bathtubs and containers with water now</span></li>
            <li className="flex gap-2"><span>🕯️</span><span>Prepare flashlights, candles and batteries</span></li>
            <li className="flex gap-2"><span>📻</span><span>Keep a battery-powered radio for official updates</span></li>
            <li className="flex gap-2"><span>📱</span><span>Charge all devices immediately</span></li>
            <li className="flex gap-2"><span>🍞</span><span>Check your 72-hour food and water supplies</span></li>
            <li className="flex gap-2"><span>👴</span><span>Check on elderly or vulnerable neighbours</span></li>
          </ul>
        </div>

        {/* Recent alerts feed */}
        {alerts.length > 1 && (
          <div className="bg-slate-800 rounded-2xl p-5">
            <h2 className="font-semibold text-slate-200 mb-3 text-sm">Previous alerts</h2>
            <div className="space-y-2">
              {alerts.slice(1).map((a) => (
                <div key={a.id} className="text-xs text-slate-400 border-l-2 border-slate-600 pl-3">
                  <span className="text-slate-300">{a.message}</span>
                  <span className="ml-2 text-slate-500">
                    {new Date(a.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-4 pb-8 pt-2">
        <button
          onClick={() => navigate('/citizen')}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl text-lg transition-colors shadow-lg"
        >
          Open Citizen App →
        </button>
      </div>
    </div>
  )
}
