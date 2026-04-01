import { useState } from 'react'
import type { Value } from '../types'

interface ChoicePointProps {
  values: Value[]
  onSendToChat: (message: string) => void
}

export default function ChoicePoint({ values, onSendToChat }: ChoicePointProps) {
  const [situation, setSituation] = useState('')
  const [hooks, setHooks] = useState('')
  const [awayMoves, setAwayMoves] = useState('')
  const [towardsMoves, setTowardsMoves] = useState('')
  const [relevantValues, setRelevantValues] = useState('')

  const hasContent = situation.trim() || hooks.trim() || awayMoves.trim() || towardsMoves.trim()

  const sendToChat = () => {
    const parts: string[] = [
      "I've been working through a Choice Point and want to explore it with you.",
      '',
    ]
    if (situation) parts.push(`**Situation:** ${situation}`)
    if (hooks) parts.push(`\n**What's hooking me** (thoughts/feelings pulling me away): ${hooks}`)
    if (awayMoves) parts.push(`\n**Away moves I'm tempted by:** ${awayMoves}`)
    if (towardsMoves) parts.push(`\n**Towards moves I'm considering:** ${towardsMoves}`)
    if (relevantValues) parts.push(`\n**Values that feel relevant:** ${relevantValues}`)
    parts.push('\nCan you help me think through this?')

    onSendToChat(parts.join('\n'))
  }

  const clearAll = () => {
    setSituation('')
    setHooks('')
    setAwayMoves('')
    setTowardsMoves('')
    setRelevantValues('')
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-stone-800">Choice Point</h2>
          <p className="text-stone-500 mt-1.5 leading-relaxed max-w-xl">
            Any moment of difficulty is a choice point. You can move <strong>towards</strong> your values, or <strong>away</strong> from discomfort. This tool helps you see that choice more clearly.
          </p>
        </div>

        {/* Situation */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-stone-700 mb-2 uppercase tracking-wide">
            The Situation
          </label>
          <p className="text-xs text-stone-400 mb-3">
            Describe what's happening — the context where you face this choice.
          </p>
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="e.g. My manager gave me critical feedback in front of the team. I'm about to respond…"
            rows={3}
            className="w-full px-4 py-3 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sage-400 resize-none leading-relaxed"
          />
        </div>

        {/* Hooks */}
        <div className="mb-8 bg-red-50 border border-red-100 rounded-2xl p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12V8a4 4 0 00-4-4H8a4 4 0 00-4 4v4m0 0v4a4 4 0 004 4h8a4 4 0 004-4v-4m-16 0h16" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-stone-700 text-sm">Hooks</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                What thoughts, feelings, urges, or memories are showing up and pulling you away from your values?
              </p>
            </div>
          </div>
          <textarea
            value={hooks}
            onChange={(e) => setHooks(e.target.value)}
            placeholder="e.g. I feel humiliated. My mind is saying 'he's out to get me.' I want to shut down…"
            rows={3}
            className="w-full px-4 py-3 text-sm border border-red-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-300 resize-none leading-relaxed"
          />
        </div>

        {/* Two columns: Away / Towards */}
        <div className="grid grid-cols-2 gap-5 mb-8">
          {/* Away moves */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-amber-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <h3 className="font-semibold text-stone-700 text-sm">Away Moves</h3>
            </div>
            <p className="text-xs text-stone-500 mb-3">
              What might you do to escape, avoid, or get short-term relief — even if it moves you away from your values?
            </p>
            <textarea
              value={awayMoves}
              onChange={(e) => setAwayMoves(e.target.value)}
              placeholder="e.g. Snap back defensively. Shut down. Leave the room. Ruminate all day…"
              rows={4}
              className="w-full px-3 py-2.5 text-sm border border-amber-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none leading-relaxed"
            />
          </div>

          {/* Towards moves */}
          <div className="bg-sage-50 border border-sage-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-sage-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <h3 className="font-semibold text-stone-700 text-sm">Towards Moves</h3>
            </div>
            <p className="text-xs text-stone-500 mb-3">
              What could you do that aligns with your values — even with the discomfort present?
            </p>
            <textarea
              value={towardsMoves}
              onChange={(e) => setTowardsMoves(e.target.value)}
              placeholder="e.g. Take a breath. Ask a clarifying question. Listen openly. Respond with integrity…"
              rows={4}
              className="w-full px-3 py-2.5 text-sm border border-sage-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sage-400 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Values relevant to this */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-stone-700 mb-2">
            Relevant Values{' '}
            <span className="text-stone-400 font-normal">— what matters to you here?</span>
          </label>
          {values.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-3">
              {values.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    const current = relevantValues.split(',').map((s) => s.trim()).filter(Boolean)
                    if (current.includes(v.name)) {
                      setRelevantValues(current.filter((s) => s !== v.name).join(', '))
                    } else {
                      setRelevantValues([...current, v.name].join(', '))
                    }
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    relevantValues.includes(v.name)
                      ? 'bg-sage-600 text-white border-sage-600'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-sage-300 hover:text-sage-700'
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          ) : null}
          <input
            type="text"
            value={relevantValues}
            onChange={(e) => setRelevantValues(e.target.value)}
            placeholder={values.length > 0 ? 'Or type additional values…' : 'e.g. Integrity, Connection, Courage…'}
            className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sage-400"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={sendToChat}
            disabled={!hasContent}
            className="flex items-center gap-2 bg-sage-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-sage-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Reflect with Claude
          </button>
          {hasContent && (
            <button
              onClick={clearAll}
              className="text-sm text-stone-400 hover:text-stone-600 px-3 py-2.5 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Explanation */}
        <div className="mt-10 p-5 bg-stone-50 border border-stone-100 rounded-2xl">
          <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">About the Choice Point</h4>
          <p className="text-sm text-stone-600 leading-relaxed">
            The <strong>Choice Point</strong> model, developed by Russ Harris, helps us see that in any difficult moment, we have a choice: to move <em>towards</em> our values, or <em>away</em> from discomfort. Thoughts and feelings that pull us toward away-moves are called <strong>hooks</strong>. The goal isn't to eliminate discomfort — it's to act from values even while discomfort is present.
          </p>
        </div>
      </div>
    </div>
  )
}
