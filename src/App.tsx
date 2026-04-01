import { useState } from 'react'
import Sidebar from './components/Sidebar'
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
      <main className="flex-1 overflow-hidden min-w-0">
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
    </div>
  )
}

export default App
