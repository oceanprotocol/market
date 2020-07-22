import React, { ReactElement } from 'react'
import { OceanProvider } from '@oceanprotocol/react'
import { appConfig } from '../../app.config'

const wrapRootElement = ({
  element
}: {
  element: ReactElement
}): ReactElement => (
  <OceanProvider config={appConfig.oceanConfig}>{element}</OceanProvider>
)

export default wrapRootElement
