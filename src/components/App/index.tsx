import React, { ReactElement } from 'react'
import Alert from '@shared/atoms/Alert'
import { useWeb3 } from '@context/Web3'
import { useAccountPurgatory } from '@hooks/useAccountPurgatory'
import PrivacyPreferenceCenter from '../Privacy/PrivacyPreferenceCenter'
import { ToastContainer } from 'react-toastify'
import contentPurgatory from '../../../content/purgatory.json'
import { useMarketMetadata } from '@context/MarketMetadata'
import Navbar from '../Navbar'
import Sidebar from '../Sidebar'

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

      <div className="h-screen flex flex-row overflow-hidden">
        <Sidebar />
        <div className="w-full h-full flex flex-col overflow-hidden ">
          <Navbar />
          <main className="h-screen w-full overflow-y-auto">{children}</main>
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
