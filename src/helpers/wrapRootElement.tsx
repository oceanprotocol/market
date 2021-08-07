import React, { ReactElement } from 'react'
import Web3Provider from '../providers/Web3'
import { UserPreferencesProvider } from '../providers/UserPreferences'
import PricesProvider from '../providers/Prices'
import UrqlProvider from '../providers/UrqlProvider'
import ConsentProvider from '../providers/CookieConsent'

export default function wrapRootElement({
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
