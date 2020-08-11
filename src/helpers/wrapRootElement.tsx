import React, { ReactElement } from 'react'
import { OceanProvider } from '@oceanprotocol/react'
import { web3ModalOpts, getOceanConfig } from '../utils/wallet'
import { network } from '../../app.config'

export default function wrapRootElement({
  element
}: {
  element: ReactElement
}): ReactElement {
  const oceanInitialConfig = getOceanConfig(network)

  return (
    <OceanProvider
      initialConfig={oceanInitialConfig}
      web3ModalOpts={web3ModalOpts}
    >
      {element}
    </OceanProvider>
  )
}
