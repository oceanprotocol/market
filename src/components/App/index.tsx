import React, { ReactElement } from 'react'
import Alert from '@shared/atoms/Alert'
import Footer from '../Footer/Footer'
import Header from '../Header'
import { useWeb3 } from '@context/Web3'
import { useAccountPurgatory } from '@hooks/useAccountPurgatory'
import AnnouncementBanner from '@shared/AnnouncementBanner'
import PrivacyPreferenceCenter from '../Privacy/PrivacyPreferenceCenter'
import styles from './index.module.css'
import { ToastContainer } from 'react-toastify'
import contentPurgatory from '../../../content/purgatory.json'
import { useMarketMetadata } from '@context/MarketMetadata'

export default function App({
  children
}: {
  children: ReactElement
}): ReactElement {
  const { siteContent, appConfig } = useMarketMetadata()
  const { accountId } = useWeb3()
  const { isInPurgatory, purgatoryData } = useAccountPurgatory(accountId)
  function openInNewTab() {
    window
      .open(
        'https://blog.oceanprotocol.com/how-to-publish-a-data-nft-f58ad2a622a9',
        '_blank'
      )
      .focus()
  }

  return (
    <div className={styles.app}>
      {siteContent?.announcement !== '' && (
        <AnnouncementBanner
          text={siteContent?.announcement}
          action={{
            name: 'Explore OceanONDA V4.',
            style: 'link',
            handleAction: openInNewTab
          }}
        />
      )}
      <Header />

      {isInPurgatory && (
        <Alert
          title={contentPurgatory.account.title}
          badge={`Reason: ${purgatoryData?.reason}`}
          text={contentPurgatory.account.description}
          state="error"
        />
      )}
      <main className={styles.main}>{children}</main>
      <Footer />

      {appConfig?.privacyPreferenceCenter === 'true' && (
        <PrivacyPreferenceCenter style="small" />
      )}

      <ToastContainer position="bottom-right" newestOnTop />
    </div>
  )
}
