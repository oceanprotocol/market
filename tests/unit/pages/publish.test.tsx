import React from 'react'
import { render } from '@testing-library/react'
import Publish from '../../../src/pages/publish'
import web3ProviderMock, { context } from '../__mocks__/web3provider'
import { OceanProvider, Config } from '@oceanprotocol/react'
import { config } from '../../../src/config/ocean'

describe('Home', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <context.Provider value={web3ProviderMock}>
        <OceanProvider config={config as Config}>
          <Publish />
        </OceanProvider>
      </context.Provider>
    )
    expect(container.firstChild).toBeInTheDocument()
  })
})
