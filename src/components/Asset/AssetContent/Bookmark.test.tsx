import { render, screen } from '@testing-library/react'
import React from 'react'
import Bookmark from './Bookmark'
import { datasetAquarius } from '../../../../.jest/__fixtures__/datasetAquarius'

describe('src/components/Asset/AssetContent/Bookmark.tsx', () => {
  it('renders Metadata for a data Asset', () => {
    render(<Bookmark did={datasetAquarius.id} />)
    expect(screen.getByTitle('Add Bookmark')).toBeInTheDocument()
  })
})
