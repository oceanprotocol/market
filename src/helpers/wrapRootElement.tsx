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
import HDWalletProvider from '@truffle/hdwallet-provider'

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
  const { metadataStoreUri, network } = appConfig
  const oceanInitialConfig = getOceanConfig(network)

  let burnerWeb3provider

  if (!window?.ethereum) {
    const mnemonic =
      'chapter method soul still duty bunker swallow tell flower obvious until claim' // 12 word
    burnerWeb3provider = new HDWalletProvider(
      mnemonic,
      oceanInitialConfig.nodeUri
    )
    console.log(burnerWeb3provider)
  }

  const initialConfig = {
    ...oceanInitialConfig,
    ...(burnerWeb3provider && { web3provider: burnerWeb3provider }),
    // add metadataStoreUri only when defined
    ...(metadataStoreUri && { metadataStoreUri })
  }

  return (
    <OceanProvider initialConfig={initialConfig} web3ModalOpts={web3ModalOpts}>
      <UserPreferencesProvider>
        <NetworkMonitor />
        {element}
      </UserPreferencesProvider>
    </OceanProvider>
  )
}
