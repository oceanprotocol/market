import React from 'react'
import CookieConsent from 'react-cookie-consent'
import { deleteAllExternalCookies } from '../../utils/cookies'
import { useConsent, CookieConsentStatus } from '../../hooks/useConsent'
import styles from './CookieBanner.module.css'
// import { markdownify } from '../../utils'
import { useGdprMetadata } from '../../hooks/useGdprMetadata'

export default function CookieBanner() {
  const { cookieConsentStatus, setConsentStatus } = useConsent()
  const { cookies } = useGdprMetadata()
  const handleAccept = () => {
    setConsentStatus(CookieConsentStatus.APPROVED)
  }
  const handleReject = () => {
    deleteAllExternalCookies()
    setConsentStatus(CookieConsentStatus.REJECTED)
  }

  return (
    cookieConsentStatus === CookieConsentStatus.NOT_AVAILABLE && (
      <CookieConsent
        cookieName={cookies.cookieName}
        declineButtonText={cookies.reject}
        buttonText={cookies.accept}
        onAccept={handleAccept}
        onDecline={handleReject}
        enableDeclineButton
        disableStyles
        declineButtonClasses={styles.rejectButton}
        buttonClasses={styles.approveButton}
        containerClasses={styles.banner}
        // Hack! We use the overlay for positioning the banner,
        // not for showing an actual overlay.
        overlayClasses={styles.wrapper}
        overlay
      >
        {/* {markdownify(cookies.text)} */}
        {cookies.text}
      </CookieConsent>
    )
  )
}
