import { render, screen } from '@testing-library/react'
import React from 'react'
import Price from './index'
import { asset } from '../../../../.jest/__fixtures__/datasetWithAccessDetails'
import prices from '../../../../.jest/__fixtures__/prices'

jest.mock('../../../@context/Prices', () => ({
  usePrices: () => prices,
  getCoingeckoTokenId: () => 'ocean-protocol'
}))

describe('@shared/Price', () => {
  it('renders fixed price', () => {
    render(
      <Price
        price={{ value: 10, tokenSymbol: 'OCEAN', tokenAddress: '0x123' }}
      />
    )
    expect(screen.getByText('10')).toBeInTheDocument()
  })
  it('renders free price', () => {
    render(<Price price={{ value: 0 }} />)
    expect(screen.getByText('Free')).toBeInTheDocument()
  })
  it('renders null price', () => {
    render(<Price price={{ value: null }} />)
    expect(screen.getByText('-')).toBeInTheDocument()
  })
  it('renders conversion', async () => {
    render(<Price price={asset.stats.price} conversion />)
    expect(await screen.findByText('≈')).toBeInTheDocument()
  })
  it('renders no conversion when no price defined', async () => {
    render(<Price price={{ value: null, tokenSymbol: 'TEST' }} conversion />)
    expect(screen.queryByText('≈')).not.toBeInTheDocument()
  })
})
