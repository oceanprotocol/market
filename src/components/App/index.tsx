import React, { ReactElement } from 'react'
import Alert from '@shared/atoms/Alert'
import Footer from '../Footer/Footer'
import Header from '../Header'
import { useWeb3 } from '@context/Web3'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import { useAccountPurgatory } from '@hooks/useAccountPurgatory'
import AnnouncementBanner from '@shared/AnnouncementBanner'
import PrivacyPreferenceCenter from '../Privacy/PrivacyPreferenceCenter'
import styles from './index.module.css'
import { ToastContainer } from 'react-toastify'
import { useRouter } from 'next/router'
// import waves from '@oceanprotocol/art/waves/waves.png'
import content from '../../../content/purgatory.json'

export default function App({
  children
}: {
  children: ReactElement
}): ReactElement {
  const router = useRouter()

  const { warning, appConfig } = useSiteMetadata()
  const { accountId } = useWeb3()
  const { isInPurgatory, purgatoryData } = useAccountPurgatory(accountId)

  return (
    <div className={styles.app}>
      {router.pathname === '/' && <AnnouncementBanner text={warning.main} />}
      <Header />

      {isInPurgatory && (
        <Alert
          title={content.account.title}
          badge={`Reason: ${purgatoryData?.reason}`}
          text={content.account.description}
          state="error"
        />
      )}
      <main className={styles.main}>{children}</main>
      <Footer />

      {appConfig.privacyPreferenceCenter === 'true' && (
        <PrivacyPreferenceCenter style="small" />
      )}

      <ToastContainer position="bottom-right" newestOnTop />
    </div>
  )
}
