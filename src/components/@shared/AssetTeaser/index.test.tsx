import React from 'react'
import { render, screen } from '@testing-library/react'
import testRender from '../../../../.jest/testRender'
import AssetTeaser from './index'
import { asset } from '../../../../.jest/__fixtures__/datasetWithAccessDetails'

describe('@shared/AssetTeaser', () => {
  testRender(<AssetTeaser asset={asset} />)

  it('renders no pricing schema available', () => {
    asset.stats.price = null
    render(<AssetTeaser asset={asset} />)
    expect(screen.getByText('No pricing schema available')).toBeInTheDocument()
    expect(screen.getByText('This is a test.')).toBeInTheDocument()
  })
  it('renders asset teaser with no description', () => {
    asset.metadata.description = null
    render(<AssetTeaser asset={asset} />)
    expect(
      screen.queryByText('This is a test description')
    ).not.toBeInTheDocument()
  })
})
