import React, { ReactElement } from 'react'
import { Web3Provider, OceanProvider, Config } from '@oceanprotocol/react'
import { config } from '../config/ocean'
import Styles from '../global/Styles'

const wrapPageElement = ({ element }: { element: ReactElement }) => (
  <Web3Provider>
    <OceanProvider config={config as Config}>
      <Styles>{element}</Styles>
    </OceanProvider>
  </Web3Provider>
)

export default wrapPageElement
