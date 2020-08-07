import React, { ReactElement } from 'react'
import { OceanProvider } from '@oceanprotocol/react'
import { ConfigHelper } from '@oceanprotocol/lib'
import { web3ModalOpts } from '../utils/wallet'
import { network } from '../../app.config'

function getOceanConfig(network: string) {
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
  const oceanInitialConfig = getOceanConfig(network)

  async function handleNetworkChanged(chainId: number) {
    const config = getOceanConfig(chainId)
    connect(config)
  }

  return (
    <OceanProvider
      initialConfig={oceanInitialConfig}
      handleNetworkChanged={handleNetworkChanged}
      web3ModalOpts={web3ModalOpts}
    >
      {element}
    </OceanProvider>
  )
}
