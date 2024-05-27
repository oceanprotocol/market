// import App from "next/app";
import React, { ReactElement, useEffect } from 'react'
import type { AppProps /*, AppContext */ } from 'next/app'
import { GoogleTagManager } from '@next/third-parties/google'
import { UserPreferencesProvider } from '@context/UserPreferences'
import PricesProvider from '@context/Prices'
import UrqlProvider from '@context/UrqlProvider'
import ConsentProvider from '@context/CookieConsent'
import App from '../../src/components/App'
import { OrbisProvider } from '@context/DirectMessages'
import '@oceanprotocol/typographies/css/ocean-typo.css'
import '../stylesGlobal/styles.css'
import Decimal from 'decimal.js'
import MarketMetadataProvider from '@context/MarketMetadata'
import { WagmiConfig } from 'wagmi'
import { ConnectKitProvider } from 'connectkit'
import { connectKitTheme, wagmiClient } from '@utils/wallet'

function MyApp({ Component, pageProps }: AppProps): ReactElement {
  Decimal.set({ rounding: 1 })

  return (
    <>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GA_ID} />
      <WagmiConfig client={wagmiClient}>
        <ConnectKitProvider
          options={{ initialChainId: 0 }}
          customTheme={connectKitTheme}
        >
          <MarketMetadataProvider>
            <UrqlProvider>
              <UserPreferencesProvider>
                <PricesProvider>
                  <ConsentProvider>
                    <OrbisProvider>
                      <App>
                        <Component {...pageProps} />
                      </App>
                    </OrbisProvider>
                  </ConsentProvider>
                </PricesProvider>
              </UserPreferencesProvider>
            </UrqlProvider>
          </MarketMetadataProvider>
        </ConnectKitProvider>
      </WagmiConfig>
    </>
  )
}

export default MyApp
