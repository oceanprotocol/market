import React from 'react'
import { render } from '@testing-library/react'
import Publish from '../../../src/pages/publish'
import web3ProviderMock, { context } from '../__mocks__/web3provider'

describe('Home', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <context.Provider value={web3ProviderMock}>
        <Publish />
      </context.Provider>
    )
    expect(container.firstChild).toBeInTheDocument()
  })
})
