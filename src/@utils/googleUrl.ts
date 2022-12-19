// check if the url is a google domain
export const isGoogleUrl = (url: string): boolean => {
  if (!url) return
  const googleUrl = new URL(url)
  return googleUrl.hostname.endsWith('google.com')
}
