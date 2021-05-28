import React, { ReactElement } from 'react'
import Web3Provider from '../providers/Web3'
import { UserPreferencesProvider } from '../providers/UserPreferences'
import PricesProvider from '../providers/Prices'
import ApolloClientProvider from '../providers/ApolloClientProvider'
import OceanProvider from '../providers/Ocean'

export default function wrapRootElement({
  element
}: {
  element: ReactElement
}): ReactElement {
  return (
    <Web3Provider>
      <OceanProvider>
        <ApolloClientProvider>
          <UserPreferencesProvider>
            <PricesProvider>{element}</PricesProvider>
          </UserPreferencesProvider>
        </ApolloClientProvider>
      </OceanProvider>
    </Web3Provider>
  )
}
