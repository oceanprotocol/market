export function sanitizeUrl(url: string) {
  const u = decodeURI(url).trim().toLowerCase()
  const isAllowedUrlScheme = u.startsWith('http://') || u.startsWith('https://')
  return isAllowedUrlScheme ? url : 'about:blank'
}
