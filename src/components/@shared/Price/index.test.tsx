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
        accessDetails={{ ...asset.accessDetails, type: 'fixed', price: '10' }}
      />
    )
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('renders free price', () => {
    render(<Price accessDetails={{ ...asset.accessDetails, type: 'free' }} />)
    expect(screen.getByText('Free')).toBeInTheDocument()
  })

  it('renders null price', () => {
    render(<Price accessDetails={{ ...asset.accessDetails, price: null }} />)
    expect(screen.getByText('-')).toBeInTheDocument()
  })

  it('renders conversion', async () => {
    render(
      <Price
        accessDetails={{ ...asset.accessDetails, price: '10' }}
        conversion
      />
    )
    expect(await screen.findByText('≈')).toBeInTheDocument()
  })

  it('renders no conversion when no price defined', async () => {
    render(
      <Price
        accessDetails={{ ...asset.accessDetails, price: null }}
        conversion
      />
    )
    expect(screen.queryByText('≈')).not.toBeInTheDocument()
  })
})
