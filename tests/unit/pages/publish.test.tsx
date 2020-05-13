import React from 'react'
import { render } from '@testing-library/react'
import Publish from '../../../src/pages/publish'

import { OceanProvider, Config } from '@oceanprotocol/react'
import { config } from '../../../src/config/ocean'
import { Web3ProviderMock } from '../__mocks__/web3provider'

describe('Home', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Web3ProviderMock>
        <OceanProvider config={config as Config}>
          <Publish />
        </OceanProvider>
      </Web3ProviderMock>
    )
    expect(container.firstChild).toBeInTheDocument()
  })
})
