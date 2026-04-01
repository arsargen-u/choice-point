import { useState } from 'react'
import type { Value } from '../types'

interface ACTMatrixProps {
  values: Value[]
  onSendToChat: (message: string) => void
}

interface QuadrantProps {
  title: string
  subtitle: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  colorClass: string
  borderClass: string
  ringClass: string
  icon: React.ReactNode
}

function Quadrant({
  title,
  subtitle,
  placeholder,
  value,
  onChange,
  colorClass,
  borderClass,
  ringClass,
  icon,
}: QuadrantProps) {
  return (
    <div className={`${colorClass} ${borderClass} border rounded-2xl p-4 flex flex-col`}>
      <div className="flex items-start gap-2 mb-3">
        <div className="mt-0.5 flex-shrink-0">{icon}</div>
        <div>
          <h3 className="font-semibold text-stone-700 text-sm">{title}</h3>
          <p className="text-xs text-stone-500 mt-0.5 leading-snug">{subtitle}</p>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className={`flex-1 w-full px-3 py-2.5 text-sm border ${borderClass} rounded-xl bg-white focus:outline-none focus:ring-2 ${ringClass} resize-none leading-relaxed placeholder-stone-400`}
      />
    </div>
  )
}

export default function ACTMatrix({ values, onSendToChat }: ACTMatrixProps) {
  const [innerAway, setInnerAway] = useState('')
  const [outerAway, setOuterAway] = useState('')
  const [innerTowards, setInnerTowards] = useState('')
  const [outerTowards, setOuterTowards] = useState('')

  const hasContent =
    innerAway.trim() || outerAway.trim() || innerTowards.trim() || outerTowards.trim()

  const sendToChat = () => {
    const parts = [
      "I've filled out an ACT Matrix and want to explore it with you.",
      '',
    ]
    if (innerAway) parts.push(`**What hooks me / inner away** (thoughts, feelings, fears):\n${innerAway}`)
    if (outerAway) parts.push(`\n**What I do to get away** (behaviors, avoidance):\n${outerAway}`)
    if (innerTowards) parts.push(`\n**Who/what matters to me** (values, people):\n${innerTowards}`)
    if (outerTowards) parts.push(`\n**Values-guided action I could take:**\n${outerTowards}`)
    parts.push('\nCan you help me see this more clearly and find a path forward?')

    onSendToChat(parts.join('\n'))
  }

  const clearAll = () => {
    setInnerAway('')
    setOuterAway('')
    setInnerTowards('')
    setOuterTowards('')
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-stone-800">ACT Matrix</h2>
          <p className="text-stone-500 mt-1.5 leading-relaxed max-w-xl">
            A four-quadrant map of your inner experience and outer behavior. Fill in what's true for you right now — there are no wrong answers.
          </p>
        </div>

        {/* Axis labels */}
        <div className="relative mb-2">
          <div className="text-center">
            <span className="inline-block text-xs font-semibold text-stone-400 uppercase tracking-widest px-3 py-1 bg-stone-100 rounded-full">
              Thoughts & Feelings (Inner Experience)
            </span>
          </div>
        </div>

        {/* Matrix grid */}
        <div className="relative">
          {/* Center axis labels */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest">← Away</span>
              <div className="w-px h-8 bg-stone-200" />
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest">Towards →</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Top-left: Inner Away */}
            <Quadrant
              title="What hooks me"
              subtitle="Thoughts, feelings, fears, memories that pull you away from your values"
              placeholder={`e.g. "I'm not good enough." Fear of failure. Shame. Anxiety about what others think…`}
              value={innerAway}
              onChange={setInnerAway}
              colorClass="bg-red-50"
              borderClass="border-red-100"
              ringClass="focus:ring-red-300"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-red-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            {/* Top-right: Inner Towards */}
            <Quadrant
              title="Who / what matters"
              subtitle="People, things, and values you care deeply about"
              placeholder={`e.g. My kids. Being a present partner. Doing work I'm proud of. My health. Creative expression…`}
              value={innerTowards}
              onChange={setInnerTowards}
              colorClass="bg-sage-50"
              borderClass="border-sage-200"
              ringClass="focus:ring-sage-400"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-sage-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              }
            />

            {/* Bottom-left: Outer Away */}
            <Quadrant
              title="What I do to get away"
              subtitle="Behaviors you use to escape, avoid, or seek short-term relief"
              placeholder="e.g. Scroll my phone for hours. Snap at people. Overwork. Drink. Withdraw. Procrastinate…"
              value={outerAway}
              onChange={setOuterAway}
              colorClass="bg-amber-50"
              borderClass="border-amber-100"
              ringClass="focus:ring-amber-300"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-amber-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              }
            />

            {/* Bottom-right: Outer Towards */}
            <Quadrant
              title="Values-guided action"
              subtitle="Concrete things you could do that move you towards what matters"
              placeholder="e.g. Put my phone away at dinner. Have the conversation I've been avoiding. Go for a walk…"
              value={outerTowards}
              onChange={setOuterTowards}
              colorClass="bg-emerald-50"
              borderClass="border-emerald-200"
              ringClass="focus:ring-emerald-400"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-emerald-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>
        </div>

        {/* Bottom axis label */}
        <div className="mt-2 text-center">
          <span className="inline-block text-xs font-semibold text-stone-400 uppercase tracking-widest px-3 py-1 bg-stone-100 rounded-full">
            Actions & Behaviors (Outer Behavior)
          </span>
        </div>

        {/* Your values as reference */}
        {values.length > 0 && (
          <div className="mt-6 p-4 bg-stone-50 border border-stone-200 rounded-2xl">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Your saved values</p>
            <div className="flex flex-wrap gap-2">
              {values.map((v) => (
                <span
                  key={v.id}
                  className="text-xs bg-white border border-stone-200 rounded-full px-3 py-1 text-stone-600"
                >
                  <span className="font-medium">{v.name}</span>
                  <span className="text-stone-400 ml-1">· {v.domain}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex items-center gap-3">
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
        <div className="mt-8 p-5 bg-stone-50 border border-stone-100 rounded-2xl">
          <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">About the ACT Matrix</h4>
          <p className="text-sm text-stone-600 leading-relaxed">
            The <strong>ACT Matrix</strong>, developed by Kevin Polk, maps your experience on two axes: <em>inner vs. outer</em> (what you think/feel vs. what you do), and <em>away vs. towards</em> (moving away from discomfort vs. toward what matters). It helps you notice patterns — and find a path toward values-guided living.
          </p>
        </div>
      </div>
    </div>
  )
}
