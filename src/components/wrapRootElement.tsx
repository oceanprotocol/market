import React, { ReactElement } from 'react'
import Web3Provider from '../context/Web3'
import { UserPreferencesProvider } from '../context/UserPreferences'
import PricesProvider from '../context/Prices'
import UrqlProvider from '../context/UrqlProvider'
import ConsentProvider from '../context/CookieConsent'

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
