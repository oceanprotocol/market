import { render, screen } from '@testing-library/react'
import React from 'react'
import MetaFull from './MetaFull'
import { datasetAquarius } from '../../../../.jest/__fixtures__/datasetAquarius'
import { algorithmAquarius } from '../../../../.jest/__fixtures__/algorithmAquarius'

describe('src/components/Asset/AssetContent/MetaFull.tsx', () => {
  it('renders metadata', () => {
    render(<MetaFull ddo={datasetAquarius} />)
    expect(screen.getByText('Owner')).toBeInTheDocument()
  })

  it('renders metadata for an algorithm', () => {
    render(<MetaFull ddo={algorithmAquarius} />)
    expect(screen.getByText('Docker Image')).toBeInTheDocument()
    expect(screen.getByText('DID')).toBeInTheDocument()
  })
})
