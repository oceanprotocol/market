// import App from "next/app";
import React, { ReactElement } from 'react'
import type { AppProps /*, AppContext */ } from 'next/app'
import { UserPreferencesProvider } from '@context/UserPreferences'
import PricesProvider from '@context/Prices'
import UrqlProvider from '@context/UrqlProvider'
import ConsentProvider from '@context/CookieConsent'
import App from '../../src/components/App'
import '@oceanprotocol/typographies/css/ocean-typo.css'
import '../stylesGlobal/styles.css'
import Decimal from 'decimal.js'
import MarketMetadataProvider from '@context/MarketMetadata'
import { WagmiConfig } from 'wagmi'
import { ConnectKitProvider } from 'connectkit'
import { connectKitTheme, wagmiClient } from '@utils/wallet'
import Web3LegacyProvider from '@context/Web3Legacy'

function MyApp({ Component, pageProps }: AppProps): ReactElement {
  Decimal.set({ rounding: 1 })

  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <ConnectKitProvider
          options={{ initialChainId: 0 }}
          customTheme={connectKitTheme}
        >
          <Web3LegacyProvider>
            <MarketMetadataProvider>
              <UrqlProvider>
                <UserPreferencesProvider>
                  <PricesProvider>
                    <ConsentProvider>
                      <App>
                        <Component {...pageProps} />
                      </App>
                    </ConsentProvider>
                  </PricesProvider>
                </UserPreferencesProvider>
              </UrqlProvider>
            </MarketMetadataProvider>
          </Web3LegacyProvider>
        </ConnectKitProvider>
      </WagmiConfig>
    </>
  )
}

export default MyApp
