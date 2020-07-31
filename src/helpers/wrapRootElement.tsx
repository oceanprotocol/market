import React, { ReactElement } from 'react'
import { OceanProvider } from '@oceanprotocol/react'
import { appConfig } from '../../app.config'
import { web3ModalOpts } from '../utils/wallet'

const wrapRootElement = ({
  element
}: {
  element: ReactElement
}): ReactElement => (
  <OceanProvider config={appConfig.oceanConfig} web3ModalOpts={web3ModalOpts}>
    {element}
  </OceanProvider>
)

export default wrapRootElement
