import React, { ReactElement } from 'react'
import Alert from '@shared/atoms/Alert'
import { useWeb3 } from '@context/Web3'
import { useAccountPurgatory } from '@hooks/useAccountPurgatory'
import AnnouncementBanner from '@shared/AnnouncementBanner'
import PrivacyPreferenceCenter from '../Privacy/PrivacyPreferenceCenter'
import styles from './index.module.css'
import { ToastContainer } from 'react-toastify'
import contentPurgatory from '../../../content/purgatory.json'
import { useMarketMetadata } from '@context/MarketMetadata'
import Navbar from '../Navbar'
import Sidebar from '../Sidebar/sidebar'

export default function App({
  children
}: {
  children: ReactElement
}): ReactElement {
  const { siteContent, appConfig } = useMarketMetadata()
  const { accountId } = useWeb3()
  const { isInPurgatory, purgatoryData } = useAccountPurgatory(accountId)

  return (
    <div className="min-h-screen">
      {/* {siteContent?.announcement !== '' && (
                <AnnouncementBanner text={siteContent?.announcement} />
            )} */}
      {/* <Header /> */}

      {isInPurgatory && (
        <Alert
          title={contentPurgatory.account.title}
          badge={`Reason: ${purgatoryData?.reason}`}
          text={contentPurgatory.account.description}
          state="error"
        />
      )}

      <div className="h-screen flex overflow-hidden">
        <Sidebar />
        <div className="w-full overflow-hidden ">
          <Navbar />
          <main className="overflow-y-auto w-full">{children}</main>
        </div>
      </div>

      {/* <Footer /> */}

      {appConfig?.privacyPreferenceCenter === 'true' && (
        <PrivacyPreferenceCenter style="small" />
      )}

      <ToastContainer position="bottom-right" newestOnTop />
    </div>
  )
}
