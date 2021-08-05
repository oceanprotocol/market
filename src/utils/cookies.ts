import Cookies from 'js-cookie'

export enum SAME_SITE_OPTIONS {
  STRICT = 'strict',
  LAX = 'lax',
  NONE = 'none'
}

export const DEFAULT_COOKIE_OPTIONS = {
  expires: 365,
  sameSite: SAME_SITE_OPTIONS.STRICT
}

function deleteCookies(cookies: string[]) {
  cookies.forEach((cookie) => {
    Cookies.remove(cookie)
  })
}

function deleteGACookies() {
  const gaCookies = ['_gat', '_gid', '_ga']
  deleteCookies(gaCookies)
}

export function deleteAllExternalCookies(): void {
  deleteGACookies()
}

export function getLegacyCookieName(cookieName: string): string {
  return `${cookieName}-legacy`
}

// Consent-Cookie system adopted from react-cookie-consent, SEE: https://github.com/Mastermindzh/react-cookie-consent
export function getConsentCookieValue(cookieName: string): string {
  let cookieValue = Cookies.get(cookieName)

  // if the cookieValue is undefined check for the legacy cookie
  if (cookieValue === undefined) {
    cookieValue = Cookies.get(getLegacyCookieName(cookieName))
  }
  return cookieValue
}

export function setConsentCookies(
  cookieName: string,
  cookieValue: boolean,
  cookieOptions = DEFAULT_COOKIE_OPTIONS
): void {
  const cookieSecurity = location ? location.protocol === 'https:' : true

  const options = { ...cookieOptions, security: cookieSecurity }

  // Fallback for older browsers where can not set SameSite=None, SEE: https://web.dev/samesite-cookie-recipes/#handling-incompatible-clients
  if (cookieOptions.sameSite === SAME_SITE_OPTIONS.NONE)
    Cookies.set(getLegacyCookieName(cookieName), cookieValue.toString(), {
      ...options,
      sameSite: null
    })

  // set the regular cookie
  Cookies.set(cookieName, cookieValue.toString(), options)
}

export function deleteConsentCookies(cookieName: string): void {
  const cookieBannerCookies = [cookieName, getLegacyCookieName(cookieName)]

  cookieBannerCookies.forEach((cookie) => {
    Cookies.remove(cookie)
  })
}
