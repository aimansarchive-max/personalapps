const MODEL = '@cf/google/gemma-4-26b-a4b-it'
const MAX_MESSAGES = 8
const MAX_MESSAGE_LENGTH = 1200
const MAX_TOTAL_LENGTH = 5000
const MAX_OUTPUT_TOKENS = 500
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT = 8
const requestCounts = new Map()

function json(body, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    }
  })
}

function allowedByRateLimit(ip, now) {
  const existing = requestCounts.get(ip)
  if (!existing || now - existing.startedAt >= RATE_WINDOW_MS) {
    requestCounts.set(ip, { startedAt: now, count: 1 })
    return true
  }
  if (existing.count >= RATE_LIMIT) return false
  existing.count += 1
  return true
}

async function handleChatPost({ request, env }) {
  const ai = env.AI || env.Ai
  const origin = request.headers.get('Origin')
  if (origin && origin !== new URL(request.url).origin) {
    return json({ error: 'This request could not be verified.' }, 403)
  }

  if (!ai) {
    return json({ error: 'Gemma is not connected yet. Please check back soon.' }, 503)
  }

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
  if (!allowedByRateLimit(ip, Date.now())) {
    return json({ error: 'That’s enough questions for a little while. Please try again later.' }, 429)
  }

  let rawBody
  try {
    rawBody = await request.text()
  } catch {
    return json({ error: 'Please send a valid message.' }, 400)
  }
  if (rawBody.length > 12000) return json({ error: 'That message is too long.' }, 413)

  let payload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return json({ error: 'Please send a valid message.' }, 400)
  }

  if (!Array.isArray(payload?.messages) || payload.messages.length < 1 || payload.messages.length > MAX_MESSAGES) {
    return json({ error: 'Please send a shorter conversation.' }, 400)
  }

  const messages = []
  let totalLength = 0
  for (const item of payload.messages) {
    if (!item || !['user', 'assistant'].includes(item.role) || typeof item.content !== 'string') {
      return json({ error: 'That message format is not supported.' }, 400)
    }
    const content = item.content.trim()
    if (!content || content.length > MAX_MESSAGE_LENGTH) return json({ error: 'Each message must be under 1,200 characters.' }, 400)
    totalLength += content.length
    if (totalLength > MAX_TOTAL_LENGTH) return json({ error: 'Please start a new conversation with a shorter question.' }, 400)
    messages.push({ role: item.role, content })
  }

  if (messages[messages.length - 1].role !== 'user') {
    return json({ error: 'Please send a question to continue.' }, 400)
  }

  const prompt = [
    { role: 'system', content: 'You are Gemma, a concise, friendly assistant on Aiman’s Archive, a personal website about learning, practical tools, and lightly sarcastic philosophy. Be helpful, clear, and honest when uncertain. Do not claim to be Aiman. For medical, legal, or financial matters, give general information and encourage consulting a qualified professional. Keep answers reasonably brief.' },
    ...messages
  ]

  try {
    const result = await ai.run(MODEL, { messages: prompt, max_tokens: MAX_OUTPUT_TOKENS })
    const reply = typeof result?.response === 'string' ? result.response.trim() : ''
    if (!reply) return json({ error: 'Gemma returned an empty answer. Please try again.' }, 502)
    return json({ reply })
  } catch {
    return json({ error: 'Gemma could not answer right now. Please try again in a moment.' }, 502)
  }
}

export async function onRequest(context) {
  if (context.request.method === 'POST') return handleChatPost(context)
  return json({ error: 'Use POST to send a message.' }, 405)
}

