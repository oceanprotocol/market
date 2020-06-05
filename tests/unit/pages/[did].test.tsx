import React from 'react'
import { render } from '@testing-library/react'
import AssetDetails, { getMetadata } from '../../../src/pages/asset/[did]'
import ddo from '../__fixtures__/ddo'
import { findServiceByType } from '../../../src/utils'
import { MetaDataMarket } from '../../../src/@types/MetaData'
import oceanMock from '../__mocks__/ocean-mock'
import web3ProviderMock from '../__mocks__/web3'
const { attributes } = findServiceByType(ddo, 'metadata')
// import { useOcean } from '@oceanprotocol/react'

jest.mock('web3')
jest.mock('@oceanprotocol/react')

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

describe('AssetDetails', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <AssetDetails
        ddo={JSON.stringify(ddo) as any}
        attributes={attributes as MetaDataMarket}
        title="Hello"
      />
    )
    expect(container.firstChild).toBeInTheDocument()
  })
})

describe('getMetadata()', () => {
  it('not a valid DID', async () => {
    const response = await getMetadata('hello')
    expect(response.title).toBe('Not a DID')
  })

  it('Not Found', async () => {
    const response = await getMetadata(
      'did:op:c678e7e5963d4fdc99afea49ac221d4d4177790f30204417823319d4d35f851f'
    )
    expect(response.title).toBe('Could not retrieve asset')
  })

  it('Found', async () => {
    const response = await getMetadata(
      'did:op:8898adb69e334755a568738ce3f6c03760f9eb5a4f344c688e483a04cb0855d6'
    )
    expect(response.title).toBe('compute1')
  })
})
