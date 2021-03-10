import React, { ReactElement } from 'react'
import Web3Provider from '../providers/Web3'
import appConfig from '../../app.config'
import { UserPreferencesProvider } from '../providers/UserPreferences'
import PricesProvider from '../providers/Prices'
import ApolloClientProvider from '../providers/ApolloClientProvider'
import OceanProvider from '../providers/Ocean'
import { getOceanConfig, getDevelopmentConfig } from '../providers/Ocean/utils'

export default function wrapRootElement({
  element
}: {
  element: ReactElement
}): ReactElement {
  const { network } = appConfig
  const oceanInitialConfig = {
    ...getOceanConfig(network),

    // add local dev values
    ...(network === 'development' && {
      ...getDevelopmentConfig()
    })
  }
  console.log(oceanInitialConfig)

  return (
    <Web3Provider>
      <OceanProvider initialConfig={oceanInitialConfig}>
        <ApolloClientProvider>
          <UserPreferencesProvider>
            <PricesProvider>{element}</PricesProvider>
          </UserPreferencesProvider>
        </ApolloClientProvider>
      </OceanProvider>
    </Web3Provider>
  )
}
