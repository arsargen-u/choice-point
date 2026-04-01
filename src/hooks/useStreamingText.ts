import { useState, useCallback } from 'react'

interface UseStreamingTextOptions {
  endpoint: string
}

export function useStreamingText({ endpoint }: UseStreamingTextOptions) {
  const [text, setText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(
    async (body: object) => {
      setText('')
      setError(null)
      setIsStreaming(true)

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })

        if (!response.ok) {
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
          setText((prev) => prev + decoder.decode(value, { stream: true }))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setIsStreaming(false)
      }
    },
    [endpoint],
  )

  const reset = useCallback(() => {
    setText('')
    setError(null)
  }, [])

  return { text, isStreaming, error, generate, reset }
}
