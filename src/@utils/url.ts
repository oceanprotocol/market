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
