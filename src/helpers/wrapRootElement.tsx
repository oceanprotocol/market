import React, { ReactElement } from 'react'
import { Web3Provider, OceanProvider, Config } from '@oceanprotocol/react'
import { config } from '../config/ocean'

const wrapRootElement = ({
  element
}: {
  element: ReactElement
}): ReactElement => (
  <Web3Provider>
    <OceanProvider config={config as Config}>{element}</OceanProvider>
  </Web3Provider>
)

export default wrapRootElement
