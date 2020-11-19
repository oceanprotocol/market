import React, { ReactElement } from 'react'
import { OceanProvider } from '@oceanprotocol/react'
import { ConfigHelper, Config } from '@oceanprotocol/lib'
import { web3ModalOpts } from '../utils/wallet'
import { NetworkMonitor } from './NetworkMonitor'
import appConfig from '../../app.config'
import {
  ConfigHelperNetworkName,
  ConfigHelperNetworkId
} from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'
import { UserPreferencesProvider } from '../providers/UserPreferences'
import PricesProvider from '../providers/Prices'

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
  const oceanInitialConfig = getOceanConfig(network)
  console.log('config', oceanInitialConfig)
  return (
    <OceanProvider
      initialConfig={oceanInitialConfig}
      web3ModalOpts={web3ModalOpts}
    >
      <UserPreferencesProvider>
        <NetworkMonitor />
        <PricesProvider>{element}</PricesProvider>
      </UserPreferencesProvider>
    </OceanProvider>
  )
}
