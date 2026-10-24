const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } })
const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : ''
const submissions = new Map()
export async function onRequestPost({ request, env }) {
  if (!env.CRM_DB) return json({ error: 'Contact form is temporarily unavailable.' }, 503)
  const origin = request.headers.get('origin')
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'Request rejected.' }, 403)
  const ip = request.headers.get('cf-connecting-ip') || 'unknown'
  const now = Date.now(), prior = submissions.get(ip)
  if (prior && prior.until > now && prior.count >= 6) return json({ error: 'Please wait a while before sending another note.' }, 429)
  try {
    const data = await request.json()
    if (clean(data.website, 200)) return json({ ok: true }) // Honeypot
    const name = clean(data.name, 100), email = clean(data.email, 254), subject = clean(data.subject, 180), message = clean(data.message, 4000)
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) return json({ error: 'Please add your name, a valid email, and a message of at least 10 characters.' }, 400)
    await env.CRM_DB.prepare('INSERT INTO contacts(name,email,subject,message,source) VALUES(?,?,?,?,?)').bind(name,email,subject,message,'website contact form').run()
    submissions.set(ip, prior && prior.until > now ? { count: prior.count + 1, until: prior.until } : { count: 1, until: now + 10 * 60 * 1000 })
    return json({ ok: true }, 201)
  } catch { return json({ error: 'Unable to send your message right now. Please try again later.' }, 500) }
}
