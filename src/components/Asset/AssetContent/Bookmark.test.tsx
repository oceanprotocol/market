import { render, screen } from '@testing-library/react'
import React from 'react'
import Bookmark from './Bookmark'
import { assetAquarius } from '../../../../.jest/__fixtures__/assetAquarius'

describe('src/components/Asset/AssetContent/Bookmark.tsx', () => {
  it('renders Add Bookmark button', () => {
    render(<Bookmark did={assetAquarius.id} />)
    expect(screen.getByTitle('Add Bookmark')).toBeInTheDocument()
  })
})
