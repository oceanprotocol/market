import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import { CookieConsentStatus, useConsent } from '@context/CookieConsent'
import InputElement from '@shared/FormInput/InputElement'
import Markdown from '@shared/Markdown'
import styles from './CookieModule.module.css'

export interface CookieModuleProps {
  title: string
  desc: string
  cookieName: string
}

export default function CookieModule(props: CookieModuleProps): ReactElement {
  const { cookieConsentStatus, setConsentStatus } = useConsent()
  const { title, desc, cookieName } = props
  const [checked, setChecked] = useState<boolean>()

  useEffect(() => {
    setConsentStatus(
      cookieName,
      checked ? CookieConsentStatus.APPROVED : CookieConsentStatus.REJECTED
    )
  }, [checked])

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <InputElement
          type="checkbox"
          name={cookieName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setChecked(e.target.checked)
          }}
          checked={
            cookieConsentStatus[cookieName] === CookieConsentStatus.APPROVED
          }
          options={[title]}
          size="large"
        />
      </div>
      <Markdown text={desc} className={styles.description} />
    </div>
  )
}
