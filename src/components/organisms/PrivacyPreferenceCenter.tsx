import React, { ReactElement } from 'react'
import { useConsent, CookieConsentStatus } from '../../providers/CookieConsent'
import styles from './PrivacyPreferenceCenter.module.css'
import { useGdprMetadata } from '../../hooks/useGdprMetadata'
import Markdown from '../atoms/Markdown'
import CookieModule from '../molecules/CookieModule'
import Button from '../atoms/Button'
import { useUserPreferences } from '../../providers/UserPreferences'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export default function CookieBanner(): ReactElement {
  const { resetConsentStatus } = useConsent()
  const cookies = useGdprMetadata()
  const { showPPC, setShowPPC } = useUserPreferences()

  function handleAllCookies(accepted: boolean) {
    resetConsentStatus(
      accepted ? CookieConsentStatus.APPROVED : CookieConsentStatus.REJECTED
    )
    setShowPPC(false)
  }

  return (
    <div className={cx(styles.wrapper, { hidden: !showPPC })}>
      <div className={styles.banner}>
        <div>
          <Markdown text={cookies.title} className={styles.header} />
          <Markdown text={cookies.text} />

          {cookies.optionalCookies && (
            <>
              <div className={styles.buttons}>
                <Button
                  size="small"
                  onClick={() => {
                    handleAllCookies(true)
                  }}
                >
                  {cookies.accept || 'Accept all'}
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    handleAllCookies(false)
                  }}
                >
                  {cookies.reject || 'Reject all'}
                </Button>
              </div>
              <div className={styles.optionals}>
                {cookies.optionalCookies.map((cookie) => {
                  return <CookieModule {...cookie} key={cookie.cookieName} />
                })}
              </div>
            </>
          )}
        </div>
        <Button
          size="small"
          style="primary"
          onClick={() => {
            setShowPPC(false)
          }}
          className={styles.closeButton}
        >
          {cookies.close || 'Save and close'}
        </Button>
      </div>
    </div>
  )
}
