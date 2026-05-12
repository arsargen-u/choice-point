import dotenv from 'dotenv'
dotenv.config({ override: true })
import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'
import { buildSystemPrompt, type StoredValue } from './systemPrompt.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const port = process.env.PORT ?? 3001
const isProd = process.env.NODE_ENV === 'production'

app.use(cors())
app.use(express.json())

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    hasKey: Boolean(process.env.ANTHROPIC_API_KEY),
  })
})

// Main chat endpoint — streaming
app.post('/api/chat', async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      res.status(400).json({ error: 'Invalid request body — expected JSON.' })
      return
    }
    const {
      messages,
      values,
      memory,
    }: {
      messages: Array<{ role: 'user' | 'assistant'; content: string }>
      values?: StoredValue[]
      memory?: string
    } = req.body

    if (!process.env.ANTHROPIC_API_KEY) {
      res.status(500).json({
        error: 'ANTHROPIC_API_KEY is not set. Create a .env file with your key.',
      })
      return
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Transfer-Encoding', 'chunked')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('X-Accel-Buffering', 'no')

    const stream = anthropic.messages.stream({
      model: 'claude-opus-4-6',
      max_tokens: 2048,
      system: buildSystemPrompt(values, memory),
      messages,
    })

    stream.on('text', (text) => {
      res.write(text)
    })

    await stream.finalMessage()
    res.end()
  } catch (error) {
    console.error('Chat error:', error)
    if (!res.headersSent) {
      res.status(500).json({ error: 'Something went wrong. Please try again.' })
    } else {
      res.end()
    }
  }
})

// Committed action endpoint — streaming
app.post('/api/committed-action', async (req, res) => {
  try {
    const {
      value,
      context,
    }: { value: StoredValue; context?: string } = req.body

    if (!process.env.ANTHROPIC_API_KEY) {
      res.status(500).json({ error: 'ANTHROPIC_API_KEY is not set.' })
      return
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Transfer-Encoding', 'chunked')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('X-Accel-Buffering', 'no')

    const contextNote = context
      ? `\n\nAdditional context from the person: "${context}"`
      : ''

    const stream = anthropic.messages.stream({
      model: 'claude-opus-4-6',
      max_tokens: 1500,
      system: `You are a warm, skilled ACT therapist helping someone translate their values into committed action.

Your job: given a value they care about, suggest 4–6 specific, concrete, doable committed actions. These are behaviors — not outcomes — that express this value in everyday life.

Guidelines:
- Be specific and practical. Not "be more present with family" but "put my phone in another room during dinner."
- Each action should be something they could realistically do this week or build into routine.
- Keep it warm and encouraging — not a to-do list, but a menu of possibilities.
- For each action, give one brief sentence on how it connects to the value.
- Use plain language. No jargon.
- Format: use a numbered list, each item bold-titled with a brief explanation below it.`,
      messages: [
        {
          role: 'user',
          content: `My value is: **${value.name}** (${value.domain} domain)\n\nWhat this value means to me: ${value.description}${contextNote}\n\nCan you help me identify some specific committed actions that would bring this value to life?`,
        },
      ],
    })

    stream.on('text', (text) => {
      res.write(text)
    })

    await stream.finalMessage()
    res.end()
  } catch (error) {
    console.error('Committed action error:', error)
    if (!res.headersSent) {
      res.status(500).json({ error: 'Something went wrong. Please try again.' })
    } else {
      res.end()
    }
  }
})

// Serve built frontend static assets — registered AFTER API routes so /api/* always wins
if (isProd) {
  const staticDir = join(__dirname, '..')
  if (existsSync(staticDir)) {
    app.use(express.static(staticDir))
  }
}

// Catch unmatched /api/* routes — return JSON 404 instead of falling through to the SPA
app.all('/api/*', (_req, res) => {
  res.status(404).json({ error: 'API route not found.' })
})

// SPA fallback — serve index.html for any non-API route in production
if (isProd) {
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      res.status(404).json({ error: 'API route not found.' })
      return
    }
    const indexPath = join(__dirname, '..', 'index.html')
    if (existsSync(indexPath)) {
      res.sendFile(indexPath)
    } else {
      res.status(404).send('Not found')
    }
  })
}

app.listen(port, () => {
  console.log(`\n🌿 Choice Point server running at http://localhost:${port}`)
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn(
      '\n⚠️  ANTHROPIC_API_KEY is not set.\n   Create a .env file: cp .env.example .env\n   Then add your key from console.anthropic.com\n',
    )
  } else {
    console.log('   API key detected ✓\n')
  }
})
