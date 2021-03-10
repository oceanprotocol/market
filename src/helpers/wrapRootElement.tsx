import React, { ReactElement } from 'react'
import { ConfigHelper, Config } from '@oceanprotocol/lib'
import Web3Provider from '../providers/Web3'
import { getDevelopmentConfig } from './NetworkMonitor'
import appConfig from '../../app.config'
import {
  ConfigHelperNetworkName,
  ConfigHelperNetworkId
} from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'
import { UserPreferencesProvider } from '../providers/UserPreferences'
import PricesProvider from '../providers/Prices'
import ApolloClientProvider from '../providers/ApolloClientProvider'
import OceanProvider from '../providers/Ocean'

export function getOceanConfig(
  network: ConfigHelperNetworkName | ConfigHelperNetworkId
): Config {
  return new ConfigHelper().getConfig(
    network,
    process.env.GATSBY_INFURA_PROJECT_ID
  )
}

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
