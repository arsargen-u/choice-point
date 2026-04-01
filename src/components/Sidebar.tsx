import type { View } from '../types'

interface SidebarProps {
  currentView: View
  onNavigate: (view: View) => void
}

const navItems: { id: View; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: 'chat',
    label: 'Chat',
    description: 'Talk it through',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12a8 8 0 01-8 8H5l-2 2V8a8 8 0 0116 0v4z" />
      </svg>
    ),
  },
  {
    id: 'values',
    label: 'My Values',
    description: 'What matters to you',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-10l6-3m6 16l-5.447 2.724A1 1 0 0115 21.382V10.618a1 1 0 011.447-.894L21 7v13z" />
      </svg>
    ),
  },
  {
    id: 'choicepoint',
    label: 'Choice Point',
    description: 'Towards or away?',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v6m0 0l-3-3m3 3l3-3M6 18l-3-3m3 3l-3 3m15-6l-3 3m3-3l3 3M12 9v6" />
      </svg>
    ),
  },
  {
    id: 'matrix',
    label: 'ACT Matrix',
    description: 'Map your experience',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="8" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
        <rect x="13" y="13" width="8" height="8" rx="1" />
      </svg>
    ),
  },
]

export default function Sidebar({ currentView, onNavigate }: SidebarProps) {
  return (
    <aside className="w-56 flex-shrink-0 bg-stone-100 border-r border-stone-200 flex flex-col">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-stone-200">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl select-none">🌿</span>
          <div>
            <h1 className="font-semibold text-stone-800 text-sm leading-tight">Choice Point</h1>
            <p className="text-xs text-stone-500 leading-tight">ACT Companion</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = currentView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group ${
                active
                  ? 'bg-sage-600 text-white shadow-sm'
                  : 'text-stone-600 hover:bg-stone-200 hover:text-stone-800'
              }`}
            >
              <span className={active ? 'text-white' : 'text-stone-400 group-hover:text-stone-600'}>
                {item.icon}
              </span>
              <div className="min-w-0">
                <div className={`text-sm font-medium leading-tight ${active ? 'text-white' : ''}`}>
                  {item.label}
                </div>
                <div className={`text-xs leading-tight mt-0.5 ${active ? 'text-sage-100' : 'text-stone-400'}`}>
                  {item.description}
                </div>
              </div>
            </button>
          )
        })}
      </nav>

      {/* Footer note */}
      <div className="px-4 py-4 border-t border-stone-200">
        <p className="text-xs text-stone-400 leading-relaxed">
          Grounded in ACT — Acceptance & Commitment Therapy
        </p>
      </div>
    </aside>
  )
}
