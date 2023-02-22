import AssetSelection, { AssetSelectionAsset } from './'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

describe('@shared/FormInput/InputElement/AssetSelection', () => {
  const assets: AssetSelectionAsset[] = [
    {
      did: 'did:op:xxx',
      name: 'Asset',
      price: 10,
      checked: false,
      symbol: 'OCEAN'
    },
    {
      did: 'did:op:yyy',
      name: 'Asset',
      price: 10,
      checked: true,
      symbol: 'OCEAN'
    },
    {
      did: 'did:op:zzz',
      name: 'Asset',
      price: 0,
      checked: false,
      symbol: 'OCEAN'
    }
  ]

  it('renders without crashing', () => {
    render(<AssetSelection assets={assets} />)
    const searchInput = screen.getByPlaceholderText(
      'Search by title, datatoken, or DID...'
    )
    fireEvent.change(searchInput, { target: { value: 'Assets' } })
    fireEvent.change(searchInput, { target: { value: '' } })
  })

  it('renders empty assetSelection', () => {
    render(<AssetSelection assets={[]} />)
    expect(screen.getByText('No assets found.')).toBeInTheDocument()
  })

  it('renders disabled assetSelection', () => {
    render(<AssetSelection assets={[]} disabled />)
    expect(screen.getByText('No assets found.')).toBeInTheDocument()
  })

  it('renders assetSelectionMultiple', () => {
    render(<AssetSelection assets={assets} multiple />)
  })
})
