import React, { ReactElement } from 'react'
import { OceanProvider } from '@oceanprotocol/react'
import { oceanConfig } from '../../app.config'

const wrapRootElement = ({
  element
}: {
  element: ReactElement
}): ReactElement => (
  <OceanProvider config={oceanConfig}>{element}</OceanProvider>
)

export default wrapRootElement
