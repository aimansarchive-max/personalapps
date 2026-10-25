import { SITE_DEFAULTS } from './site-defaults.js'

export async function loadSiteConfig(db) {
  const stored = await db.prepare("SELECT content_value FROM site_content WHERE content_key='site_config'").first()
  if (stored?.content_value) {
    try { return JSON.parse(stored.content_value) } catch { /* Repair an invalid record from the safe defaults below. */ }
  }
  const legacy = await db.prepare("SELECT content_key,content_value FROM site_content WHERE content_key IN ('hero_title','hero_description','home_quote')").all()
  const config = structuredClone(SITE_DEFAULTS)
  for (const row of legacy.results || []) {
    if (row.content_key === 'hero_title') config.home.title = row.content_value
    if (row.content_key === 'hero_description') config.home.description = row.content_value
    if (row.content_key === 'home_quote') config.home.quote = row.content_value
  }
  await db.prepare("INSERT INTO site_content(content_key,content_value,updated_at) VALUES('site_config',?,CURRENT_TIMESTAMP) ON CONFLICT(content_key) DO UPDATE SET content_value=excluded.content_value,updated_at=CURRENT_TIMESTAMP").bind(JSON.stringify(config)).run()
  return config
}

export function validateSiteConfig(config) {
  if (!config || typeof config !== 'object' || Array.isArray(config)) return 'Invalid site settings.'
  if (!config.site || !config.home || !config.learning || !config.resources || !config.about || !config.seo) return 'A required site section is missing.'
  if (!Array.isArray(config.resources.tools) || config.resources.tools.length > 40) return 'Keep the tools list to 40 entries or fewer.'
  if (!Array.isArray(config.learning.chapters) || config.learning.chapters.length !== 7) return 'The interactive book needs exactly seven chapter records after its cover.'
  if (!Array.isArray(config.home.collections) || config.home.collections.length !== 3) return 'Keep the three homepage destination cards in place; you can edit their copy.'
  if (!Array.isArray(config.about.values) || config.about.values.length > 8) return 'Keep the about values list to eight or fewer.'
  const serialized = JSON.stringify(config)
  if (serialized.length > 80000) return 'The complete site settings exceed 80 KB.'
  const safeUrl = value => {
    if (!value) return true
    try { const url = new URL(value); return url.protocol === 'https:' || url.protocol === 'http:' || url.protocol === 'mailto:' }
    catch { return false }
  }
  if (!safeUrl(config.site.facebook) || !safeUrl(config.site.instagram) || config.resources.tools.some(tool => !safeUrl(tool.url))) return 'Links must be valid https, http, or mailto URLs.'
  const hex = value => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)
  if (![config.site.paper, config.site.ink, config.site.green, config.site.lime].every(hex)) return 'Theme colors must be six-digit hex colors.'
  return null
}

export async function saveSiteConfig(db, config) {
  const error = validateSiteConfig(config)
  if (error) throw new Error(error)
  const value = JSON.stringify(config)
  await db.prepare("INSERT INTO site_content(content_key,content_value,updated_at) VALUES('site_config',?,CURRENT_TIMESTAMP) ON CONFLICT(content_key) DO UPDATE SET content_value=excluded.content_value,updated_at=CURRENT_TIMESTAMP").bind(value).run()
  return config
}
