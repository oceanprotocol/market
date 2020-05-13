import React from 'react'
import { render } from '@testing-library/react'
import AssetDetails, { getMetadata } from '../../../src/pages/asset/[did]'
import ddo from '../__fixtures__/ddo'
import { findServiceByType } from '../../../src/utils'
import web3ProviderMock, { context } from '../__mocks__/web3provider'
import { MetaDataDexFreight } from '../../../src/@types/MetaData'

const { attributes } = findServiceByType(ddo, 'metadata')

jest.mock('web3')

describe('AssetDetails', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <context.Provider value={web3ProviderMock}>
        <AssetDetails
          ddo={JSON.stringify(ddo) as any}
          attributes={attributes as MetaDataDexFreight}
          title="Hello"
        />
      </context.Provider>
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
      'did:op:ee8532e6e338484cb439043125270bd1caf45a7a25a64e71a55b3a18f647d7da'
    )
    expect(response.title).toBe('Invoices test')
  })
})
