import { useRef, useEffect } from 'react'
import { SuggestedButtons } from './SuggestedButtons'

export function ChatWindow({ messages, onSendSuggestion, loading }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div className="flex flex-col gap-3 overflow-y-auto flex-1 py-2">
      {messages.length === 0 && (
        <p className="text-slate-500 text-sm text-center mt-4">
          Ask anything about the crisis situation...
        </p>
      )}
      {messages.map((msg) => (
        <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
          <div
            className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-slate-700 text-slate-100 rounded-bl-sm'
            }`}
          >
            {msg.content}
          </div>
          {msg.role === 'ai' && (
            <>
              <SuggestedButtons buttons={msg.suggested_buttons} onSelect={onSendSuggestion} />
              <div className="flex gap-3 mt-2 ml-1">
                {msg.call_izs && (
                  <a
                    href="tel:112"
                    className="text-xs bg-red-700 hover:bg-red-600 text-white px-3 py-1.5 rounded-full font-bold transition-colors"
                  >
                    📞 Call 112 (IZS)
                  </a>
                )}
                {msg.send_ok_to_contacts && (
                  <button
                    onClick={() => onSendSuggestion('__send_ok__')}
                    className="text-xs bg-green-700 hover:bg-green-600 text-white px-3 py-1.5 rounded-full font-bold transition-colors"
                  >
                    ✅ Send OK to family
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      ))}
      {loading && (
        <div className="flex items-start">
          <div className="bg-slate-700 px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm text-slate-400 italic">
            AI is thinking...
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
