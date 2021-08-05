import React, { ReactElement } from 'react'
import { CookieConsentStatus, useConsent } from '../../providers/CookieConsent'
import Markdown from '../atoms/Markdown'
import styles from './CookieModule.module.css'
import Switch from '../atoms/Switch'

export interface CookieModuleProps {
  title: string
  desc: string
  cookieName: string
}

export default function CookieModule(props: CookieModuleProps): ReactElement {
  const { cookieConsentStatus, setConsentStatus } = useConsent()
  const { title, desc, cookieName } = props

  function handleAccept() {
    setConsentStatus(cookieName, CookieConsentStatus.APPROVED)
  }
  function handleReject() {
    setConsentStatus(cookieName, CookieConsentStatus.REJECTED)
  }

  const handleChange = (checked: boolean) => {
    switch (checked) {
      case true:
        handleAccept()
        break
      default:
        handleReject()
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Markdown text={title} />
        <Switch
          name={cookieName}
          onChange={handleChange}
          isChecked={
            cookieConsentStatus[cookieName] === CookieConsentStatus.APPROVED
          }
          size="small"
        />
      </div>
      <Markdown text={desc} className={styles.description} />
    </div>
  )
}
