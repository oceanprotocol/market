import React, { ReactElement } from 'react'
import Web3Provider from '../providers/Web3'
import { UserPreferencesProvider } from '../providers/UserPreferences'
import PricesProvider from '../providers/Prices'

export default function wrapRootElement({
  element
}: {
  element: ReactElement
}): ReactElement {
  return (
    <Web3Provider>
      <UserPreferencesProvider>
        <PricesProvider>{element}</PricesProvider>
      </UserPreferencesProvider>
    </Web3Provider>
  )
}
