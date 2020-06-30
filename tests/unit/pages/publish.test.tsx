import React from 'react'
import { render } from '@testing-library/react'
import Publish from '../../../src/pages/publish'
import web3ProviderMock from '../__mocks__/web3provider'
import oceanMock from '../__mocks__/ocean-mock'

// eslint-disable-next-line
jest.mock('@oceanprotocol/react', () => ({
  useOcean: () => {
    return {
      ocean: oceanMock
    }
  },
  useWeb3: () => {
    return {
      web3: web3ProviderMock,
      account: '0x0000000011111111aaaaaaaabbbbbbbb22222222',
      ethProviderStatus: 1
    }
  },
  useConsume: () => {
    return {
      consume: () => null as any,
      consumeStepText: '',
      isLoading: false
    }
  },
  useMetadata: () => {
    return {
      getCuration: () => {
        return Promise.resolve({ rating: 0, numVotes: 0 })
      }
    }
  }
}))

describe('Home', () => {
  it('renders without crashing', () => {
    const { container } = render(<Publish />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
