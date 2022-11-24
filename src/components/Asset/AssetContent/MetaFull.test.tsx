import { render, screen } from '@testing-library/react'
import React from 'react'
import MetaFull from './MetaFull'
import { assetAquarius } from '../../../../.jest/__fixtures__/assetAquarius'

describe('src/components/Asset/AssetContent/MetaFull.tsx', () => {
  it('renders Metadata', () => {
    render(<MetaFull ddo={assetAquarius} />)
    expect(screen.getByText('DID')).toBeInTheDocument()
  })
})
