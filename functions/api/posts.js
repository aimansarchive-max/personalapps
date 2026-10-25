import { loadPosts } from '../post-store.js'

export async function onRequestGet({ env }) {
  if (!env.CRM_DB) return Response.json({ posts: [] }, { headers: { 'cache-control':'no-store' } })
  try {
    const posts = (await loadPosts(env.CRM_DB)).filter(post => post.status === 'published').sort((a,b) => String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')))
    return Response.json({ posts }, { headers: { 'cache-control':'no-store' } })
  } catch {
    return Response.json({ posts: [] }, { headers: { 'cache-control':'no-store' } })
  }
}
