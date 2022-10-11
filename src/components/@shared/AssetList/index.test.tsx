import { render, screen } from '@testing-library/react'
import React from 'react'
import AssetList from './index'
import { assetAquarius } from '../../../../.jest/__fixtures__/assetAquarius'

export const assets = [
  assetAquarius,
  assetAquarius,
  assetAquarius,
  assetAquarius,
  assetAquarius,
  assetAquarius,
  assetAquarius,
  assetAquarius,
  assetAquarius
]

describe('AssetList', () => {
  it('renders without crashing', async () => {
    render(
      <AssetList assets={assets} showPagination page={1} totalPages={10} />
    )
    await screen.findAllByText('OCEAN')
  })
})
