import React from 'react'
import { render } from '@testing-library/react'
import Explore, { getServerSideProps } from '../../../src/pages/explore'
import ddo from '../__fixtures__/ddo'
import { DDO } from '@oceanprotocol/squid'

const asset = new DDO(ddo)
const queryResult = {
  results: [asset, asset, asset, asset, asset, asset].map(
    (asset) => new DDO(asset)
  ),
  page: 1,
  totalPages: 100,
  totalResults: 1000
}

describe('Explore', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Explore queryResult={JSON.stringify(queryResult)} />
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('getServerSideProps', () => {
    getServerSideProps({ query: { page: '1' } } as any)
  })
})
