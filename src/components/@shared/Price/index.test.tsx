import { render, screen } from '@testing-library/react'
import React from 'react'
import Price from './index'
import { asset } from '../../../../.jest/__fixtures__/assetWithAccessDetails'
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
    render(<Price price={asset.stats.price} />)
    console.log('asset.stats.price', asset.stats.price)
    expect(screen.getByText('-')).toBeInTheDocument()
  })

  it('renders conversion', async () => {
    render(<Price price={asset.stats.price} conversion />)
    console.log('asset.stats.price', asset.stats.price)
    expect(await screen.findByText('≈')).toBeInTheDocument()
  })

  it('renders no conversion when no price defined', async () => {
    render(<Price price={asset.stats.price} conversion />)
    console.log('asset.stats.price', asset.stats.price)
    expect(screen.queryByText('≈')).not.toBeInTheDocument()
  })
})
