interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function callOpenAI(messages: Message[]): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
  const apiUrl = process.env.NEXT_PUBLIC_OPENAI_API_URL || 'https://api.openai.com/v1'
  const model = process.env.NEXT_PUBLIC_OPENAI_MODEL || 'gpt-4'

  if (!apiKey) {
    throw new Error('OpenAI API key is not configured in environment variables')
  }

  const response = await fetch(`${apiUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.error?.message || 'Failed to call OpenAI API')
  }

  const data = await response.json()
  return data.choices[0].message.content
} 