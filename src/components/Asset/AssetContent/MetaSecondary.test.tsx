import { render, screen } from '@testing-library/react'
import React from 'react'
import MetaSecondary from './MetaSecondary'
import { assetAquarius } from '../../../../.jest/__fixtures__/assetAquarius'
import { algorithmAquarius } from '../../../../.jest/__fixtures__/algorithmAquarius'

describe('src/components/Asset/AssetContent/MetaFull.tsx', () => {
  it('renders tags', () => {
    render(<MetaSecondary ddo={assetAquarius} />)
    expect(screen.getByText(assetAquarius.metadata.tags[0])).toBeInTheDocument()
  })
  it('renders download sample button', () => {
    render(<MetaSecondary ddo={algorithmAquarius} />)
    expect(screen.getByText('Sample Data')).toBeInTheDocument()
  })
})
