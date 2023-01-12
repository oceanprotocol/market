import { render, screen } from '@testing-library/react'
import React from 'react'
import MetaSecondary from './MetaSecondary'
import { datasetAquarius } from '../../../../.jest/__fixtures__/datasetAquarius'
import { algorithmAquarius } from '../../../../.jest/__fixtures__/algorithmAquarius'

describe('src/components/Asset/AssetContent/MetaSecondary.tsx', () => {
  it('renders tags', () => {
    render(<MetaSecondary ddo={datasetAquarius} />)
    expect(
      screen.getByText(datasetAquarius.metadata.tags[0])
    ).toBeInTheDocument()
  })
  it('renders download sample button', () => {
    render(<MetaSecondary ddo={algorithmAquarius} />)
    expect(screen.getByText('Sample Data')).toBeInTheDocument()
  })
})
