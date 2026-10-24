export async function onRequestGet({ env }) {
  if (!env.CRM_DB) return Response.json({ content: {} }, { headers: { 'cache-control': 'public, max-age=60' } })
  try {
    const rows = await env.CRM_DB.prepare('SELECT content_key, content_value FROM site_content').all()
    return Response.json({ content: Object.fromEntries(rows.results.map(row => [row.content_key, row.content_value])) }, { headers: { 'cache-control': 'public, max-age=60' } })
  } catch { return Response.json({ content: {} }, { headers: { 'cache-control': 'no-store' } }) }
}
