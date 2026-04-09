import { useState } from 'react'
import Sidebar, { navItems } from './components/Sidebar'
import Chat from './components/Chat'
import ValuesManager from './components/ValuesManager'
import ChoicePoint from './components/ChoicePoint'
import ACTMatrix from './components/ACTMatrix'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { View, Value } from './types'

function App() {
  const [view, setView] = useState<View>('chat')
  const [values, setValues] = useLocalStorage<Value[]>('act-values', [])
  const [pendingMessage, setPendingMessage] = useState<string | null>(null)

  const sendToChat = (message: string) => {
    setPendingMessage(message)
    setView('chat')
  }

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      <Sidebar currentView={view} onNavigate={setView} />

      {/* Main content — full width on mobile, fills remaining space on desktop */}
      <main className="flex-1 overflow-hidden min-w-0 pb-16 md:pb-0">
        {view === 'chat' && (
          <Chat
            values={values}
            pendingMessage={pendingMessage}
            onPendingMessageConsumed={() => setPendingMessage(null)}
          />
        )}
        {view === 'values' && (
          <ValuesManager values={values} onChange={setValues} />
        )}
        {view === 'choicepoint' && (
          <ChoicePoint values={values} onSendToChat={sendToChat} />
        )}
        {view === 'matrix' && (
          <ACTMatrix values={values} onSendToChat={sendToChat} />
        )}
      </main>

      {/* Mobile bottom tab bar — hidden on md+ where sidebar shows */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 flex z-50 safe-bottom">
        {navItems.map((item) => {
          const active = view === item.id
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors ${
                active ? 'text-sage-600' : 'text-stone-400'
              }`}
            >
              <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default App
