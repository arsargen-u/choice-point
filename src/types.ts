export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export type ValueDomain =
  | 'Relationships & Family'
  | 'Work & Career'
  | 'Health & Body'
  | 'Personal Growth'
  | 'Community & Citizenship'
  | 'Creativity & Arts'
  | 'Spirituality & Meaning'
  | 'Leisure & Play'
  | 'Education & Learning'
  | 'Environment & Nature'
  | 'Other'

export interface Value {
  id: string
  name: string
  description: string
  domain: ValueDomain
  createdAt: string
}

export type View = 'chat' | 'values' | 'choicepoint' | 'matrix' | 'memory'

export interface Conversation {
  id: string
  title: string
  savedAt: string
  messages: Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: string
  }>
}

export interface ChoicePointData {
  situation: string
  hooks: string
  awayMoves: string
  towardsMoves: string
}

export interface ACTMatrixData {
  innerAway: string
  outerAway: string
  innerTowards: string
  outerTowards: string
}
