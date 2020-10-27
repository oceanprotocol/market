import { Cookies } from 'react-cookie-consent'

function deleteCookies(cookies: string[]) {
  cookies.forEach((cookie) => {
    Cookies.remove(cookie)
  })
}

function deleteGACookies() {
  const gaCookies = ['_gat', '_gid', '_ga']
  deleteCookies(gaCookies)
}

function deleteTwitterCookies() {
  const cookies = ['personalization_id', 'lang']
  deleteCookies(cookies)
}

export function deleteAllExternalCookies() {
  deleteGACookies()
  deleteTwitterCookies()
}

export function deleteConsentCookies() {
  const cookieBannerCookies = [
    'OceanCookieConsent',
    'OceanCookieConsent-legacy'
  ]

  cookieBannerCookies.forEach((cookie) => {
    Cookies.remove(cookie)
  })
}
