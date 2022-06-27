export function sanitizeUrl(url: string) {
  const u = decodeURI(url).trim().toLowerCase()
  if (
    u.startsWith('javascript:') ||
    u.startsWith('data:') ||
    u.startsWith('vbscript:')
  )
    return 'about:blank'
  return url
}

export function isUrl(string: string) {
  let url

  try {
    url = new URL(string)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}
