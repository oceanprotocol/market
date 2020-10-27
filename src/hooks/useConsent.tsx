import React, {
  useContext,
  useState,
  createContext,
  useEffect,
  ReactNode
} from 'react'
import {
  deleteConsentCookies,
  deleteAllExternalCookies
} from '../utils/cookies'
import { Cookies } from 'react-cookie-consent'
import ReactGA from 'react-ga'
import { useSiteMetadata } from './useSiteMetadata'
import { useGdprMetadata } from './useGdprMetadata'

export enum CookieConsentStatus {
  NOT_AVAILABLE = -1,
  APPROVED = 0,
  REJECTED = 1
}

interface ConsentProviderValue {
  cookies: any
  cookieConsentStatus: CookieConsentStatus
  setConsentStatus: (status: CookieConsentStatus) => void
  resetConsentStatus: () => void
}

const ConsentContext = createContext({} as ConsentProviderValue)

function ConsentProvider({ children }: { children: ReactNode }) {
  const { analyticsId } = useSiteMetadata()

  const { cookies } = useGdprMetadata()

  const [cookieConsentStatus, setCookieConsentStatus] = useState(
    CookieConsentStatus.NOT_AVAILABLE
  )

  function handleAnalytics() {
    ReactGA.initialize(analyticsId)
    ReactGA.pageview(window.location.pathname + window.location.search)
  }

  useEffect(() => {
    const cookie = Cookies.get(cookies.cookieName)

    if (cookie) {
      if (cookie === 'true') {
        setCookieConsentStatus(CookieConsentStatus.APPROVED)
      } else {
        setCookieConsentStatus(CookieConsentStatus.REJECTED)
      }
    }
  }, [])

  useEffect(() => {
    if (!window || !navigator) return

    if (
      (window.doNotTrack && window.doNotTrack === '1') || // Safari >7.1.3, Edge
      (navigator.doNotTrack && navigator.doNotTrack === '1') || // Chrome, Opera, Safari <7.1.3, Blink-based
      (navigator.doNotTrack && navigator.doNotTrack === 'yes') // Firefox
    ) {
      console.log('donot track')
      setCookieConsentStatus(CookieConsentStatus.REJECTED)
    }
  }, [])

  useEffect(() => {
    switch (cookieConsentStatus) {
      case CookieConsentStatus.APPROVED: {
        handleAnalytics()
        break
      }
      case CookieConsentStatus.NOT_AVAILABLE:
      case CookieConsentStatus.REJECTED: {
        deleteAllExternalCookies()
        break
      }
    }
  }, [cookieConsentStatus])

  function resetConsentStatus() {
    deleteConsentCookies()
    setCookieConsentStatus(CookieConsentStatus.NOT_AVAILABLE)
  }

  function setConsentStatus(status: CookieConsentStatus) {
    setCookieConsentStatus(status)
  }

  return (
    <ConsentContext.Provider
      value={
        {
          cookies,
          cookieConsentStatus,
          setConsentStatus,
          resetConsentStatus
        } as ConsentProviderValue
      }
    >
      {children}
    </ConsentContext.Provider>
  )
}

const useConsent = (): ConsentProviderValue => useContext(ConsentContext)

export { ConsentProvider, useConsent, ConsentProviderValue }
export default ConsentProvider
