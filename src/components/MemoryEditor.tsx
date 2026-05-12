interface MemoryEditorProps {
  memory: string
  onChange: (memory: string) => void
}

export default function MemoryEditor({ memory, onChange }: MemoryEditorProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-stone-200 bg-white">
        <h2 className="font-semibold text-stone-800">My Context</h2>
        <p className="text-xs text-stone-400 mt-0.5">
          Background the AI carries into every conversation
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 md:py-6">
        <p className="text-sm text-stone-600 mb-4 leading-relaxed">
          Write anything that gives the AI helpful background — your situation, what you're working through, what tends to hook you, or what you've found helpful in the past. The AI reads this before every conversation, so you don't have to re-explain.
        </p>

        <div className="bg-stone-50 rounded-xl border border-stone-200 p-4 mb-4 text-xs text-stone-500 leading-relaxed">
          <p className="font-medium text-stone-600 mb-1">Examples of what to include:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Your current life situation or stressors</li>
            <li>Patterns you notice in yourself (e.g., "I tend to catastrophize")</li>
            <li>What's helped you before in difficult moments</li>
            <li>Things that haven't been helpful</li>
            <li>Values or relationships that matter most to you</li>
          </ul>
        </div>

        <textarea
          value={memory}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write freely — this is just for you and the AI..."
          className="w-full h-56 resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all leading-relaxed"
        />

        <p className="text-xs text-stone-400 mt-2">
          {memory.length > 0
            ? `${memory.length.toLocaleString()} characters · `
            : ''}
          Saved automatically · Only shared with the AI, not stored on any server
        </p>
      </div>
    </div>
  )
}
