// import App from "next/app";
import React, { ReactElement } from 'react'
import type { AppProps /*, AppContext */ } from 'next/app'
import Web3Provider from '@context/Web3'
import Web3AuthProvider from '@context/Web3Auth'
import { UserPreferencesProvider } from '@context/UserPreferences'
import PricesProvider from '@context/Prices'
import UrqlProvider from '@context/UrqlProvider'
import ConsentProvider from '@context/CookieConsent'
import App from '../../src/components/App'

import '@oceanprotocol/typographies/css/ocean-typo.css'
import '../stylesGlobal/styles.css'
import Decimal from 'decimal.js'
import MarketMetadataProvider from '@context/MarketMetadata'

function MyApp({ Component, pageProps }: AppProps): ReactElement {
  Decimal.set({ rounding: 1 })
  return (
    <MarketMetadataProvider>
      <Web3AuthProvider>
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
      </Web3AuthProvider>
    </MarketMetadataProvider>
  )
}

export default MyApp
