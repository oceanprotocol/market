import React, { ReactElement } from 'react'
import Web3Provider from '@context/Web3'
import { UserPreferencesProvider } from '@context/UserPreferences'
import PricesProvider from '@context/Prices'
import UrqlProvider from '@context/UrqlProvider'
import ConsentProvider from '@context/CookieConsent'

// Referenced in gatsby-browser.js & gatsby-ssr.js
export default function ContextProviders({
  element
}: {
  element: ReactElement
}): ReactElement {
  return (
    <Web3Provider>
      <UrqlProvider>
        <UserPreferencesProvider>
          <PricesProvider>
            <ConsentProvider>{element}</ConsentProvider>
          </PricesProvider>
        </UserPreferencesProvider>
      </UrqlProvider>
    </Web3Provider>
  )
}
