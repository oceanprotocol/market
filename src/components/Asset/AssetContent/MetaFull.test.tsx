import { render, screen } from '@testing-library/react'
import React from 'react'
import MetaFull from './MetaFull'
import { assetAquarius } from '../../../../.jest/__fixtures__/assetAquarius'
import { algorithmAquarius } from '../../../../.jest/__fixtures__/algorithmAquarius'

describe('src/components/Asset/AssetContent/MetaFull.tsx', () => {
  it('renders Metadata for a data Asset', () => {
    render(<MetaFull ddo={assetAquarius} />)
    expect(screen.getByText('DID')).toBeInTheDocument()
  })
  it('renders Metadata for an algorithm', () => {
    render(<MetaFull ddo={algorithmAquarius} />)
    expect(screen.getByText('DID')).toBeInTheDocument()
  })
})
