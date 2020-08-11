import React, { ReactElement } from 'react'
import { OceanProvider } from '@oceanprotocol/react'
import { ConfigHelper } from '@oceanprotocol/lib'
import { web3ModalOpts } from '../utils/wallet'
import { useSiteMetadata } from '../hooks/useSiteMetadata'

function getOceanConfig(network: string): ConfigHelper {
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
  const { appConfig } = useSiteMetadata()
  const oceanInitialConfig = getOceanConfig(appConfig.network)

  return (
    <OceanProvider
      initialConfig={oceanInitialConfig}
      web3ModalOpts={web3ModalOpts}
    >
      {element}
    </OceanProvider>
  )
}
