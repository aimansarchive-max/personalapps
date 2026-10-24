const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } })
const cookieName = '__Host-aiman_crm'
const enc = new TextEncoder()
const loginAttempts = new Map()

function b64(bytes) { return btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_') }
function unb64(text) { const s = text.replace(/-/g, '+').replace(/_/g, '/'); return Uint8Array.from(atob(s + '='.repeat((4 - s.length % 4) % 4)), c => c.charCodeAt(0)) }
async function sign(value, secret) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return b64(await crypto.subtle.sign('HMAC', key, enc.encode(value)))
}
async function verifyCookie(request, secret) {
  const raw = request.headers.get('cookie') || ''
  const token = raw.split(';').map(v => v.trim()).find(v => v.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1)
  if (!token) return false
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false
  try {
    if (await sign(payload, secret) !== signature) return false
    const session = JSON.parse(new TextDecoder().decode(unb64(payload)))
    return session.email && session.exp > Date.now()
  } catch { return false }
}
function sameOrigin(request) {
  const origin = request.headers.get('origin')
  return !origin || origin === new URL(request.url).origin
}
async function body(request) {
  const data = await request.json()
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid request body')
  return data
}
function clean(value, max = 2000) { return typeof value === 'string' ? value.trim().slice(0, max) : '' }

export async function onRequest({ request, env, params }) {
  if (!env.CRM_DB) return json({ error: 'CRM database is not configured.' }, 503)
  const secret = env.CRM_SESSION_SECRET
  const adminEmail = env.CRM_ADMIN_EMAIL
  const adminPassword = env.CRM_ADMIN_PASSWORD
  const path = (Array.isArray(params.path) ? params.path : []).join('/')
  const method = request.method
  if (method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'access-control-allow-methods': 'GET,POST,PATCH,DELETE,OPTIONS', 'access-control-allow-headers': 'content-type' } })

  if (path === 'session' && method === 'GET') return json({ authenticated: Boolean(secret && adminEmail && adminPassword && await verifyCookie(request, secret)) })
  if (path === 'login' && method === 'POST') {
    if (!sameOrigin(request)) return json({ error: 'Request origin rejected.' }, 403)
    if (!secret || !adminEmail || !adminPassword) return json({ error: 'CRM login secrets are not configured.' }, 503)
    const ip = request.headers.get('cf-connecting-ip') || 'unknown'
    const now = Date.now()
    const attempt = loginAttempts.get(ip)
    if (attempt && attempt.until > now && attempt.count >= 8) return json({ error: 'Too many sign-in attempts. Wait 15 minutes and try again.' }, 429)
    let data
    try { data = await body(request) } catch { return json({ error: 'Invalid request.' }, 400) }
    if (clean(data.email, 254).toLowerCase() !== adminEmail.toLowerCase() || clean(data.password, 256) !== adminPassword) {
      loginAttempts.set(ip, attempt && attempt.until > now ? { count: attempt.count + 1, until: attempt.until } : { count: 1, until: now + 15 * 60 * 1000 })
      return json({ error: 'Email or password is incorrect.' }, 401)
    }
    loginAttempts.delete(ip)
    const payload = b64(enc.encode(JSON.stringify({ email: adminEmail, exp: Date.now() + 8 * 60 * 60 * 1000 })))
    const token = `${payload}.${await sign(payload, secret)}`
    return json({ authenticated: true }, 200, { 'set-cookie': `${cookieName}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800` })
  }
  if (path === 'logout' && method === 'POST') return json({ authenticated: false }, 200, { 'set-cookie': `${cookieName}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0` })
  if (!secret || !await verifyCookie(request, secret)) return json({ error: 'Please sign in.' }, 401)

  try {
    if (path === 'dashboard' && method === 'GET') {
      const [total, fresh, qualified, openTasks, recent] = await Promise.all([
        env.CRM_DB.prepare('SELECT COUNT(*) AS n FROM contacts').first(),
        env.CRM_DB.prepare("SELECT COUNT(*) AS n FROM contacts WHERE status='new'").first(),
        env.CRM_DB.prepare("SELECT COUNT(*) AS n FROM contacts WHERE status='qualified'").first(),
        env.CRM_DB.prepare('SELECT COUNT(*) AS n FROM tasks WHERE done=0').first(),
        env.CRM_DB.prepare('SELECT * FROM contacts ORDER BY created_at DESC LIMIT 8').all()
      ])
      return json({ counts: { contacts: total.n, new: fresh.n, qualified: qualified.n, tasks: openTasks.n }, recent: recent.results })
    }
    if (path === 'contacts' && method === 'GET') {
      const search = clean(new URL(request.url).searchParams.get('q'), 100)
      const rows = await env.CRM_DB.prepare("SELECT * FROM contacts WHERE name LIKE ? OR email LIKE ? OR subject LIKE ? ORDER BY created_at DESC LIMIT 200").bind(`%${search}%`, `%${search}%`, `%${search}%`).all()
      return json({ contacts: rows.results })
    }
    const contactMatch = path.match(/^contacts\/(\d+)$/)
    if (contactMatch && method === 'PATCH') {
      if (!sameOrigin(request)) return json({ error: 'Request origin rejected.' }, 403)
      const data = await body(request)
      if (data.status && !['new','contacted','qualified','won','archived'].includes(data.status)) return json({ error: 'Invalid status.' }, 400)
      await env.CRM_DB.prepare('UPDATE contacts SET status=COALESCE(?,status), notes=COALESCE(?,notes), follow_up_at=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(data.status || null, data.notes === undefined ? null : clean(data.notes, 4000), data.follow_up_at ? clean(data.follow_up_at, 30) : null, Number(contactMatch[1])).run()
      return json({ ok: true })
    }
    if (path === 'tasks' && method === 'GET') {
      const rows = await env.CRM_DB.prepare('SELECT tasks.*, contacts.name AS contact_name FROM tasks LEFT JOIN contacts ON contacts.id=tasks.contact_id ORDER BY done ASC, due_at ASC LIMIT 200').all()
      return json({ tasks: rows.results })
    }
    if (path === 'tasks' && method === 'POST') {
      if (!sameOrigin(request)) return json({ error: 'Request origin rejected.' }, 403)
      const data = await body(request); const title = clean(data.title, 180)
      if (!title) return json({ error: 'Task title is required.' }, 400)
      const result = await env.CRM_DB.prepare('INSERT INTO tasks(title,due_at,contact_id) VALUES(?,?,?)').bind(title, data.due_at ? clean(data.due_at, 30) : null, Number(data.contact_id) || null).run()
      return json({ ok: true, id: result.meta.last_row_id }, 201)
    }
    const taskMatch = path.match(/^tasks\/(\d+)$/)
    if (taskMatch && method === 'PATCH') {
      if (!sameOrigin(request)) return json({ error: 'Request origin rejected.' }, 403)
      const data = await body(request)
      await env.CRM_DB.prepare('UPDATE tasks SET done=? WHERE id=?').bind(data.done ? 1 : 0, Number(taskMatch[1])).run()
      return json({ ok: true })
    }
    if (path === 'content' && method === 'GET') {
      const rows = await env.CRM_DB.prepare('SELECT content_key,content_value FROM site_content').all()
      return json({ content: Object.fromEntries(rows.results.map(row => [row.content_key, row.content_value])) })
    }
    if (path === 'content' && method === 'PUT') {
      if (!sameOrigin(request)) return json({ error: 'Request origin rejected.' }, 403)
      const data = await body(request)
      const allowed = ['hero_title','hero_description','home_quote']
      for (const key of allowed) if (typeof data[key] === 'string') await env.CRM_DB.prepare('INSERT INTO site_content(content_key,content_value,updated_at) VALUES(?,?,CURRENT_TIMESTAMP) ON CONFLICT(content_key) DO UPDATE SET content_value=excluded.content_value,updated_at=CURRENT_TIMESTAMP').bind(key, clean(data[key], key === 'hero_description' ? 600 : 240)).run()
      return json({ ok: true })
    }
    return json({ error: 'Not found.' }, 404)
  } catch { return json({ error: 'CRM request failed.' }, 500) }
}
