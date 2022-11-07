import { render, screen } from '@testing-library/react'
import React from 'react'
import RelatedAssets from '.'
import { assets } from '../../../../.jest/__fixtures__/assetsWithAccessDetails'

jest.mock('../../../@utils/aquarius', () => ({
  queryMetadata: () => ({ results: assets }),
  generateBaseQuery: () => jest.fn()
}))

describe('Asset/RelatedAssets', () => {
  it('renders with more than 4 queryMetadata() results', async () => {
    render(<RelatedAssets />)
    await screen.findByText('Branin dataset')
  })

  // it('renders with 4 queryMetadata() results', async () => {
  //   render(<RelatedAssets />)
  //   await screen.findByText('Branin dataset')
  // })

  //   it('renders empty', async () => {
  //     render(<RelatedAssets />)
  //     await screen.findByText('No results found')
  //   })

  //   it('renders loading', async () => {
  //     render(<RelatedAssets />)
  //   })
})
