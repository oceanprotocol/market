// import App from "next/app";
import { ReactElement } from 'react'
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
import { AppKit } from '@context/Appkit'

function MyApp({ Component, pageProps }: AppProps): ReactElement {
  Decimal.set({ rounding: 1 })

  return (
    <>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GA_ID} />
      <AppKit>
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
      </AppKit>
    </>
  )
}

export default MyApp
