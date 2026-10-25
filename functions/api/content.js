import { loadSiteConfig } from '../site-config.js'

export async function onRequestGet({ env }) {
  if (!env.CRM_DB) return Response.json({ content: {} }, { headers: { 'cache-control': 'no-store' } })
  try {
    const [rows, config] = await Promise.all([
      env.CRM_DB.prepare('SELECT content_key, content_value FROM site_content WHERE content_key IN (\'hero_title\',\'hero_description\',\'home_quote\')').all(),
      loadSiteConfig(env.CRM_DB)
    ])
    return Response.json({ content: Object.fromEntries(rows.results.map(row => [row.content_key, row.content_value])), config }, { headers: { 'cache-control': 'no-store' } })
  } catch { return Response.json({ content: {} }, { headers: { 'cache-control': 'no-store' } }) }
}
