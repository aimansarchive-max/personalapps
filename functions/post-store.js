const KEY = 'archive_posts'

export async function loadPosts(db) {
  const row = await db.prepare('SELECT content_value FROM site_content WHERE content_key=?').bind(KEY).first()
  if (!row?.content_value) return []
  try { const items = JSON.parse(row.content_value); return Array.isArray(items) ? items : [] } catch { return [] }
}

export async function savePosts(db, posts) {
  const value = JSON.stringify(posts)
  if (value.length > 500000) throw new Error('Post storage is full. Shorten some post content or remove unused posts.')
  await db.prepare('INSERT INTO site_content(content_key,content_value,updated_at) VALUES(?,?,CURRENT_TIMESTAMP) ON CONFLICT(content_key) DO UPDATE SET content_value=excluded.content_value,updated_at=CURRENT_TIMESTAMP').bind(KEY, value).run()
}

export function normalisePost(data, previous = {}) {
  const title = clean(data.title, 160)
  const slug = clean(data.slug, 100).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
  const status = data.status === 'published' ? 'published' : 'draft'
  const image = clean(data.imageUrl, 1000)
  const video = clean(data.videoUrl, 1000)
  if (!title) throw new Error('Add a post title.')
  if (!slug) throw new Error('Add a URL slug using letters, numbers, and hyphens.')
  if (!clean(data.body, 24000)) throw new Error('Add some post content before saving.')
  if (image && !isHttps(image)) throw new Error('Cover image must be a public HTTPS link.')
  if (video && !isSupportedVideo(video)) throw new Error('Use a YouTube or Vimeo link for the video.')
  return {
    ...previous,
    title,
    slug,
    summary: clean(data.summary, 500),
    category: clean(data.category, 60),
    tags: clean(data.tags, 200),
    body: clean(data.body, 24000),
    imageUrl: image,
    imageAlt: clean(data.imageAlt, 200),
    videoUrl: video,
    status,
    updatedAt: new Date().toISOString(),
    publishedAt: status === 'published' ? (previous.publishedAt || new Date().toISOString()) : null
  }
}

export function isHttps(value) {
  try { return new URL(value).protocol === 'https:' } catch { return false }
}

export function isSupportedVideo(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && ['youtube.com','www.youtube.com','m.youtube.com','youtu.be','vimeo.com','www.vimeo.com'].includes(url.hostname)
  } catch { return false }
}

function clean(value, max) { return typeof value === 'string' ? value.trim().slice(0, max) : '' }
