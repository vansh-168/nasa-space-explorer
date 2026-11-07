// NASA's explanations and credits arrive as HTML. This keeps only simple
// formatting and safe external links, so nothing from the feed can run
// scripts or break the page layout.

const KEEP = new Set(['A', 'B', 'STRONG', 'I', 'EM', 'BR', 'SUP', 'SUB'])
const DROP = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'NOSCRIPT', 'TEMPLATE', 'FORM', 'IMG', 'VIDEO', 'AUDIO'])

function clean(node) {
  for (const child of [...node.childNodes]) {
    if (child.nodeType === Node.TEXT_NODE) continue
    if (child.nodeType !== Node.ELEMENT_NODE || DROP.has(child.tagName)) {
      child.remove()
      continue
    }
    clean(child)
    if (!KEEP.has(child.tagName)) {
      child.replaceWith(...child.childNodes)
      continue
    }
    const href = child.tagName === 'A' ? (child.getAttribute('href') || '').trim() : ''
    for (const { name } of [...child.attributes]) child.removeAttribute(name)
    if (child.tagName === 'A') {
      if (/^https?:\/\//i.test(href)) {
        child.setAttribute('href', href)
        child.setAttribute('target', '_blank')
        child.setAttribute('rel', 'noopener noreferrer')
      } else {
        // Old relative APOD links (e.g. "ap230101.html") no longer resolve.
        child.replaceWith(...child.childNodes)
      }
    }
  }
}

export function sanitizeHtml(html) {
  if (!html) return ''
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html')
  const root = doc.body.firstElementChild
  clean(root)
  return root.innerHTML
    .replace(/\s+([,.;:])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

export function htmlToText(html) {
  if (!html) return ''
  return new DOMParser().parseFromString(html, 'text/html').body.textContent.trim()
}

// "<strong>Explanation:</strong> Why is..." → "Why is..."
// Also drops APOD's trailing "Tomorrow's picture: …" teaser.
export function explanationHtml(raw) {
  return sanitizeHtml(raw)
    .replace(/^\s*<(strong|b)>\s*Explanation:\s*<\/\1>\s*/i, '')
    .replace(/(<br>\s*)*<(strong|b)>\s*Tomorrow['’]s picture:?\s*<\/\2>[\s\S]*$/i, '')
    .trim()
}
