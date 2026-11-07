// Data source: NASA Science's APOD feed (science.nasa.gov).
//
// The old api.nasa.gov/planetary/apod endpoint still reads the retired
// apod.nasa.gov site, so since APOD moved it returns the same "NASA
// Science" logo placeholder for every date. This feed has the real
// pictures, needs no API key, and allows cross-origin requests.

import { explanationHtml, htmlToText, sanitizeHtml } from '../utils/sanitizeHtml'

const BASE = 'https://science.nasa.gov/wp-json/wp/v2/apod-basic'
const TIMEOUT_MS = 15000
const GALLERY_PAGE_SIZE = 24

const cache = new Map() // ISO date → normalized entry
let archiveSize = null // total number of entries, learned from response headers

// 2026-11-07 → 261107 (the feed's date format)
function toCode(isoDate) {
  return isoDate.slice(2, 4) + isoDate.slice(5, 7) + isoDate.slice(8, 10)
}

async function request(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  let response
  try {
    response = await fetch(url, { signal: controller.signal })
  } catch (err) {
    throw new Error(
      err.name === 'AbortError'
        ? 'NASA is taking too long to respond. Please try again.'
        : 'Network error. Check your connection and try again.',
    )
  } finally {
    clearTimeout(timer)
  }

  if (response.status === 404) {
    const error = new Error('No picture has been published for this date yet.')
    error.code = 'not_found'
    throw error
  }
  if (!response.ok) {
    throw new Error(`NASA's server returned an error (${response.status}). Please try again.`)
  }

  const total = Number(response.headers.get('X-WP-Total'))
  if (total > 0) archiveSize = total
  return { body: await response.json(), headers: response.headers }
}

// Images on assets.science.nasa.gov can be resized on the fly, but only
// under /dynamicimage/. /content/dam/ URLs always serve the full file.
export function resizeImage(url, width) {
  if (!url) return null
  try {
    const u = new URL(url)
    if (u.hostname !== 'assets.science.nasa.gov') return url
    u.pathname = u.pathname.replace('/content/dam/science/', '/dynamicimage/assets/science/')
    if (!u.pathname.startsWith('/dynamicimage/')) return url
    u.search = `?w=${width}&fit=clip`
    return u.toString()
  } catch {
    return url
  }
}

function extractVideoUrl(html = '') {
  const match =
    html.match(/<iframe[^>]+src=["']([^"']+)["']/i) ||
    html.match(/<(?:video|source)[^>]+src=["']([^"']+)["']/i)
  if (!match) return null
  const src = match[1].startsWith('//') ? `https:${match[1]}` : match[1]
  try {
    const u = new URL(src)
    return u.protocol === 'https:' ? u.toString() : null
  } catch {
    return null
  }
}

function youtubeId(url) {
  return (
    url?.match(/(?:youtube(?:-nocookie)?\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([\w-]{11})/)?.[1] ??
    null
  )
}

// Generic site images the feed sometimes puts in place of a real picture.
const PLACEHOLDER_IMAGE = /news-thumbnail|nasa-logo/i

function normalize(raw) {
  const videoUrl = raw.media_type === 'video' ? extractVideoUrl(raw.basic_html) : null
  const hdUrl = !videoUrl && raw.hdurl && !PLACEHOLDER_IMAGE.test(raw.hdurl) ? raw.hdurl : null
  const ytId = youtubeId(videoUrl)
  const title = htmlToText(raw.title) || 'Untitled'
  const alt = htmlToText(raw.alt)

  const entry = {
    date: raw.date,
    title,
    alt: alt && !/^see explanation/i.test(alt) ? alt : title,
    explanationHtml: explanationHtml(raw.explanation),
    creditHtml: sanitizeHtml(raw.credit || raw.copyright),
    permalink: raw.permalink,
    mediaType: videoUrl ? 'video' : hdUrl ? 'image' : 'other',
    hdUrl,
    imageUrl: resizeImage(hdUrl, 1600),
    imageSrcSet: hdUrl
      ? [800, 1600, 2400].map((w) => `${resizeImage(hdUrl, w)} ${w}w`).join(', ')
      : null,
    thumbUrl: videoUrl
      ? ytId
        ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`
        : null
      : resizeImage(hdUrl, 480),
    videoUrl,
    videoKind: videoUrl ? (/\.(mp4|webm|mov)(\?|$)/i.test(videoUrl) ? 'file' : 'embed') : null,
  }
  cache.set(entry.date, entry)
  return entry
}

export async function getApod(isoDate) {
  if (cache.has(isoDate)) return cache.get(isoDate)
  const { body } = await request(`${BASE}/${toCode(isoDate)}`)
  return normalize(body)
}

export async function getLatest() {
  const { body } = await request(`${BASE}?per_page=1&page=1`)
  if (!Array.isArray(body) || body.length === 0) throw new Error('NASA returned no pictures.')
  return normalize(body[0])
}

// Newest first, one page at a time.
export async function getRecent(page = 1) {
  const { body, headers } = await request(`${BASE}?per_page=${GALLERY_PAGE_SIZE}&page=${page}`)
  const totalPages = Number(headers.get('X-WP-TotalPages')) || page
  return { items: body.map(normalize), totalPages }
}

// One random entry from the whole archive. Picking a random page of size
// 1 never lands on a day without a picture.
export async function getRandom() {
  if (!archiveSize) await getLatest()
  const page = 1 + Math.floor(Math.random() * archiveSize)
  const { body } = await request(`${BASE}?per_page=1&page=${page}`)
  if (!Array.isArray(body) || body.length === 0) throw new Error('Could not pick a random picture.')
  return normalize(body[0])
}
