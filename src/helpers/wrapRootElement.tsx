import React, { ReactElement } from 'react'
import { Web3Provider, OceanProvider, Config } from '@oceanprotocol/react'
import { oceanConfig } from '../../app.config'

const wrapRootElement = ({
  element
}: {
  element: ReactElement
}): ReactElement => (
  <Web3Provider>
    <OceanProvider config={oceanConfig as Config}>{element}</OceanProvider>
  </Web3Provider>
)

export default wrapRootElement
