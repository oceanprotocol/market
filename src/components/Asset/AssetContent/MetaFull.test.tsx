import { render, screen } from '@testing-library/react'
import React from 'react'
import MetaFull from './MetaFull'
import { datasetAquarius } from '../../../../.jest/__fixtures__/datasetAquarius'
import { algorithmAquarius } from '../../../../.jest/__fixtures__/algorithmAquarius'

describe('src/components/Asset/AssetContent/MetaFull.tsx', () => {
  it('renders Metadata for a data Asset', () => {
    render(<MetaFull ddo={datasetAquarius} />)
    expect(screen.getByText('DID')).toBeInTheDocument()
    expect(screen.getByText('Owner')).toBeInTheDocument()
  })
  it('renders Metadata for an algorithm', () => {
    render(<MetaFull ddo={algorithmAquarius} />)
    expect(screen.getByText('DID')).toBeInTheDocument()
    expect(screen.getByText('Docker Image')).toBeInTheDocument()
  })
})
