import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Value, ValueDomain } from '../types'
import { useStreamingText } from '../hooks/useStreamingText'

const DOMAINS: ValueDomain[] = [
  'Relationships & Family',
  'Work & Career',
  'Health & Body',
  'Personal Growth',
  'Community & Citizenship',
  'Creativity & Arts',
  'Spirituality & Meaning',
  'Leisure & Play',
  'Education & Learning',
  'Environment & Nature',
  'Other',
]

interface ValuesManagerProps {
  values: Value[]
  onChange: (values: Value[]) => void
}

interface NewValueForm {
  name: string
  description: string
  domain: ValueDomain
}

const EMPTY_FORM: NewValueForm = {
  name: '',
  description: '',
  domain: 'Relationships & Family',
}

export default function ValuesManager({ values, onChange }: ValuesManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<NewValueForm>(EMPTY_FORM)
  const [selectedValueId, setSelectedValueId] = useState<string | null>(null)
  const [actionContext, setActionContext] = useState('')

  const { text: actionText, isStreaming, error, generate, reset } = useStreamingText({
    endpoint: '/api/committed-action',
  })

  const addValue = () => {
    if (!form.name.trim()) return
    const newValue: Value = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      description: form.description.trim(),
      domain: form.domain,
      createdAt: new Date().toISOString(),
    }
    onChange([...values, newValue])
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const deleteValue = (id: string) => {
    onChange(values.filter((v) => v.id !== id))
    if (selectedValueId === id) {
      setSelectedValueId(null)
      reset()
    }
  }

  const handleGenerateActions = (value: Value) => {
    setSelectedValueId(value.id)
    generate({ value, context: actionContext || undefined })
  }

  const selectedValue = values.find((v) => v.id === selectedValueId)

  return (
    <div className="flex h-full">
      {/* Left column: values list */}
      <div className="w-80 flex-shrink-0 border-r border-stone-200 bg-white flex flex-col">
        <div className="px-5 py-4 border-b border-stone-200">
          <h2 className="font-semibold text-stone-800">My Values</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            The qualities that guide your life
          </p>
        </div>

        {/* Value list */}
        <div className="flex-1 overflow-y-auto py-3">
          {values.length === 0 && !showForm && (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-stone-400 leading-relaxed">
                Your values are the compass, not the destination. Add ones that matter to you.
              </p>
            </div>
          )}

          <div className="space-y-1 px-3">
            {values.map((v) => (
              <button
                key={v.id}
                onClick={() => {
                  setSelectedValueId(v.id)
                  setActionContext('')
                  reset()
                }}
                className={`w-full text-left px-3 py-3 rounded-lg transition-all group ${
                  selectedValueId === v.id
                    ? 'bg-sage-50 border border-sage-200'
                    : 'hover:bg-stone-50 border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-medium text-sm text-stone-800 truncate">{v.name}</div>
                    <div className="text-xs text-stone-400 mt-0.5">{v.domain}</div>
                    {v.description && (
                      <div className="text-xs text-stone-500 mt-1 leading-relaxed line-clamp-2">
                        {v.description}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteValue(v.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-red-500 transition-all flex-shrink-0 rounded"
                    aria-label="Delete value"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </button>
            ))}
          </div>

          {/* Add value form */}
          {showForm && (
            <div className="mx-3 mt-2 p-4 bg-sage-50 border border-sage-200 rounded-lg">
              <h3 className="text-sm font-medium text-stone-700 mb-3">New Value</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Presence, Courage, Kindness…"
                  className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                  autoFocus
                />
                <select
                  value={form.domain}
                  onChange={(e) => setForm({ ...form, domain: e.target.value as ValueDomain })}
                  className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sage-400 appearance-none"
                >
                  {DOMAINS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What does this value mean to you? How do you want to live it?"
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sage-400 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addValue}
                    disabled={!form.name.trim()}
                    className="flex-1 bg-sage-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-sage-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Value
                  </button>
                  <button
                    onClick={() => { setShowForm(false); setForm(EMPTY_FORM) }}
                    className="px-3 py-2 text-sm text-stone-500 hover:text-stone-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add button */}
        {!showForm && (
          <div className="px-3 py-3 border-t border-stone-200">
            <button
              onClick={() => setShowForm(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-sage-700 border border-dashed border-sage-300 rounded-lg hover:bg-sage-50 hover:border-sage-400 transition-all"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add a value
            </button>
          </div>
        )}
      </div>

      {/* Right column: committed action panel */}
      <div className="flex-1 overflow-y-auto">
        {!selectedValue ? (
          <div className="flex items-center justify-center h-full px-8">
            <div className="max-w-sm text-center">
              <div className="text-4xl mb-4">🧭</div>
              <h3 className="text-lg font-semibold text-stone-700 mb-2">Values → Action</h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                Select a value on the left to explore committed actions — specific behaviors that bring that value to life.
              </p>
              <p className="text-xs text-stone-400 mt-4 italic">
                "A value is like a compass heading — it gives direction, not a destination."
                <span className="block mt-1">— Russ Harris</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto px-8 py-8">
            <div className="mb-6">
              <span className="text-xs font-medium text-sage-600 uppercase tracking-wide">
                {selectedValue.domain}
              </span>
              <h2 className="text-2xl font-semibold text-stone-800 mt-1">{selectedValue.name}</h2>
              {selectedValue.description && (
                <p className="text-stone-600 mt-2 leading-relaxed">{selectedValue.description}</p>
              )}
            </div>

            {/* Context input */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-stone-600 mb-2">
                Any specific context? <span className="text-stone-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={actionContext}
                onChange={(e) => setActionContext(e.target.value)}
                placeholder="e.g. I'm struggling with this at work, or I want to focus on my relationship with my kids…"
                rows={2}
                className="w-full px-4 py-3 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sage-400 resize-none"
              />
            </div>

            <button
              onClick={() => handleGenerateActions(selectedValue)}
              disabled={isStreaming}
              className="flex items-center gap-2 bg-sage-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-sage-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm mb-8"
            >
              {isStreaming ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating…
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {actionText ? 'Regenerate' : 'Generate committed actions'}
                </>
              )}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 mb-6">
                {error}
              </div>
            )}

            {actionText && (
              <div className="bg-white border border-stone-200 rounded-2xl px-6 py-6 shadow-sm">
                <div className={`chat-prose ${isStreaming ? 'streaming-cursor' : ''}`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{actionText}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
