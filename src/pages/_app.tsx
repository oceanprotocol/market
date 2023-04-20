// import App from "next/app";
import React, { ReactElement, useEffect } from 'react'
import type { AppProps /*, AppContext */ } from 'next/app'
import Web3Provider from '@context/Web3'
import { UserPreferencesProvider } from '@context/UserPreferences'
import PricesProvider from '@context/Prices'
import UrqlProvider from '@context/UrqlProvider'
import ConsentProvider from '@context/CookieConsent'
import { OrbisProvider } from '@context/DirectMessages'
import App from 'src/components/App'

import '@oceanprotocol/typographies/css/ocean-typo.css'
import '../stylesGlobal/styles.css'
import Decimal from 'decimal.js'
import MarketMetadataProvider from '@context/MarketMetadata'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useRouter } from 'next/router'

// Check that PostHog is client-side (used to handle Next.js SSR)
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.posthog.com',
    persistence: 'memory'
  })
}

function MyApp({ Component, pageProps }: AppProps): ReactElement {
  Decimal.set({ rounding: 1 })
  const router = useRouter()

  useEffect(() => {
    // Track page views
    const handleRouteChange = () => posthog?.capture('$pageview')
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <MarketMetadataProvider>
      <Web3Provider>
        <UrqlProvider>
          <UserPreferencesProvider>
            <PricesProvider>
              <ConsentProvider>
                <OrbisProvider>
                  <PostHogProvider client={posthog}>
                    <App>
                      <Component {...pageProps} />
                    </App>
                  </PostHogProvider>
                </OrbisProvider>
              </ConsentProvider>
            </PricesProvider>
          </UserPreferencesProvider>
        </UrqlProvider>
      </Web3Provider>
    </MarketMetadataProvider>
  )
}

export default MyApp
