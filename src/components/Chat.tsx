import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Value, Message } from '../types'

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `Welcome. This is a quiet space for reflection, grounded in ACT — Acceptance and Commitment Therapy.

Whether you're wrestling with a difficult decision, caught in a loop of difficult thoughts, or simply wanting to reconnect with what matters to you — I'm here to explore alongside you.

What's on your mind today?`,
  timestamp: new Date(),
}

const PROMPTS = [
  "I'm wrestling with a difficult decision",
  'I keep getting caught in anxious thoughts',
  'I want to reconnect with what matters to me',
  'Something is weighing on me',
  'What is the Choice Point?',
  'Help me understand my values better',
]

interface ChatProps {
  values: Value[]
  pendingMessage: string | null
  onPendingMessageConsumed: () => void
}

export default function Chat({ values, pendingMessage, onPendingMessageConsumed }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const streamingIdRef = useRef<string | null>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle pending message from tools (ChoicePoint / Matrix)
  useEffect(() => {
    if (pendingMessage) {
      setInput(pendingMessage)
      onPendingMessageConsumed()
      textareaRef.current?.focus()
    }
  }, [pendingMessage, onPendingMessageConsumed])

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
  }

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return

      setError(null)
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      }

      const assistantId = crypto.randomUUID()
      streamingIdRef.current = assistantId

      const assistantMsg: Message = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMsg, assistantMsg])
      setInput('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
      setIsStreaming(true)

      // Build API message history (skip the static welcome message)
      const apiMessages = [...messages, userMsg]
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }))

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: apiMessages,
            values: values.map((v) => ({
              id: v.id,
              name: v.name,
              description: v.description,
              domain: v.domain,
            })),
          }),
        })

        if (!response.ok) {
          // Safely read the error body — it may be empty or non-JSON
          const text = await response.text().catch(() => '')
          let errorMsg = `Server error (${response.status})`
          if (text) {
            try {
              const data = JSON.parse(text) as { error?: string }
              errorMsg = data.error ?? errorMsg
            } catch {
              errorMsg = text.slice(0, 200)
            }
          }
          throw new Error(errorMsg)
        }

        const reader = response.body!.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m,
            ),
          )
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Something went wrong'
        setError(msg)
        setMessages((prev) => prev.filter((m) => m.id !== assistantId))
      } finally {
        setIsStreaming(false)
        streamingIdRef.current = null
      }
    },
    [messages, values, isStreaming],
  )

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE])
    setError(null)
  }

  const hasUserMessages = messages.some((m) => m.role === 'user')

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white">
        <div>
          <h2 className="font-semibold text-stone-800">Conversation</h2>
          <p className="text-xs text-stone-400 mt-0.5">
            {values.length > 0
              ? `${values.length} value${values.length === 1 ? '' : 's'} loaded`
              : 'Add values in the sidebar for richer guidance'}
          </p>
        </div>
        {hasUserMessages && (
          <button
            onClick={clearChat}
            className="text-xs text-stone-400 hover:text-stone-600 transition-colors px-2 py-1 rounded hover:bg-stone-100"
          >
            New conversation
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isStreaming={isStreaming && msg.id === streamingIdRef.current}
          />
        ))}

        {/* Prompt suggestions — shown before first message */}
        {!hasUserMessages && (
          <div className="pt-2">
            <p className="text-xs text-stone-400 mb-3 font-medium uppercase tracking-wide">
              You might start with...
            </p>
            <div className="flex flex-wrap gap-2">
              {PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-sm text-stone-600 bg-white border border-stone-200 rounded-full px-4 py-1.5 hover:bg-sage-50 hover:border-sage-300 hover:text-sage-700 transition-all duration-150"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-stone-200 bg-white px-6 py-4">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="What's on your mind…"
              rows={1}
              disabled={isStreaming}
              className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ minHeight: '48px', maxHeight: '160px' }}
            />
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isStreaming}
            className="flex-shrink-0 w-10 h-10 bg-sage-600 text-white rounded-xl flex items-center justify-center hover:bg-sage-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
            aria-label="Send message"
          >
            {isStreaming ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-xs text-stone-400 mt-2 ml-1">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}

function MessageBubble({
  message,
  isStreaming,
}: {
  message: Message
  isStreaming: boolean
}) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] bg-sage-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed shadow-sm">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] bg-white border border-stone-200 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
        {message.content ? (
          <div className={`chat-prose ${isStreaming ? 'streaming-cursor' : ''}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-stone-400">
            <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
        )}
      </div>
    </div>
  )
}
