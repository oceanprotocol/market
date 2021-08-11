import React, {
  useContext,
  useState,
  createContext,
  useEffect,
  ReactNode,
  ReactElement
} from 'react'
import { deleteCookie, getCookieValue, setCookie } from '../utils/cookies'
import { UseGdprMetadata, useGdprMetadata } from '../hooks/useGdprMetadata'
import { useSiteMetadata } from '../hooks/useSiteMetadata'

export enum CookieConsentStatus {
  NOT_AVAILABLE = -1,
  APPROVED = 0,
  REJECTED = 1
}

export interface ConsentStatus {
  [name: string]: CookieConsentStatus
}

interface ConsentProviderValue {
  cookies: UseGdprMetadata['optionalCookies']
  cookieConsentStatus: ConsentStatus
  setConsentStatus: (cookieName: string, status: CookieConsentStatus) => void
  resetConsentStatus: (status?: CookieConsentStatus) => void
}

const ConsentContext = createContext({} as ConsentProviderValue)

function ConsentProvider({ children }: { children: ReactNode }): ReactElement {
  const cookies = useGdprMetadata()

  const { privacyPreferenceCenter } = useSiteMetadata().appConfig

  const [consentStatus, setConsentStatus] = useState({} as ConsentStatus)

  function resetConsentStatus(status = CookieConsentStatus.NOT_AVAILABLE) {
    const resetCookieConsent = {} as ConsentStatus
    cookies.optionalCookies?.map((cookie) => {
      deleteCookie(cookie.cookieName)
      resetCookieConsent[cookie.cookieName] = status
    })
    setConsentStatus(resetCookieConsent)
  }

  function setCookieConsentStatus(
    cookieName: string,
    status: CookieConsentStatus
  ) {
    setConsentStatus({ ...consentStatus, [cookieName]: status })
  }

  function handleAccept(cookieName: string) {
    setCookie(cookieName, true)
    switch (cookieName) {
      case 'AnalyticsCookieConsent':
        break
      default:
        break
      // Add your specific logic here
      // e.g.
      /* function handleAnalytics() {
          ReactGA.initialize(analyticsId)
          ReactGA.pageview(window.location.pathname + window.location.search)
        } */
    }
  }

  function handleReject(cookieName: string) {
    setCookie(cookieName, false)
    switch (cookieName) {
      case 'AnalyticsCookieConsent':
        break
      default:
        break
      // Add your specific logic here
    }
  }

  useEffect(() => {
    if (!privacyPreferenceCenter) return

    const initialValues = {} as ConsentStatus
    cookies.optionalCookies?.map((cookie) => {
      const cookieValue = getCookieValue(cookie.cookieName)

      switch (cookieValue) {
        case 'true':
          initialValues[cookie.cookieName] = CookieConsentStatus.APPROVED
          break
        case 'false':
          initialValues[cookie.cookieName] = CookieConsentStatus.REJECTED
          break
        default:
          initialValues[cookie.cookieName] = CookieConsentStatus.NOT_AVAILABLE
          break
      }
    })

    setConsentStatus(initialValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!privacyPreferenceCenter || !window || !navigator) return

    if (
      (window.doNotTrack && window.doNotTrack === '1') || // Safari >7.1.3, Edge
      (navigator.doNotTrack && navigator.doNotTrack === '1') || // Chrome, Opera, Safari <7.1.3, Blink-based
      (navigator.doNotTrack && navigator.doNotTrack === 'yes') // Firefox
    ) {
      // console.log('donot track')
      resetConsentStatus(CookieConsentStatus.REJECTED)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    Object.keys(consentStatus).map((cookieName) => {
      switch (consentStatus[cookieName]) {
        case CookieConsentStatus.APPROVED:
          handleAccept(cookieName)
          break
        case CookieConsentStatus.REJECTED:
          handleReject(cookieName)
          break
      }
    })
  }, [consentStatus])

  return (
    <ConsentContext.Provider
      value={
        {
          cookies: cookies.optionalCookies || [],
          cookieConsentStatus: consentStatus,
          setConsentStatus: setCookieConsentStatus,
          resetConsentStatus
        } as ConsentProviderValue
      }
    >
      {children}
    </ConsentContext.Provider>
  )
}

const useConsent = (): ConsentProviderValue => useContext(ConsentContext)

export { ConsentProvider, useConsent, ConsentProviderValue, ConsentContext }
export default ConsentProvider
