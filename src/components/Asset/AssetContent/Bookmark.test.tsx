import { render, screen } from '@testing-library/react'
import React from 'react'
import Bookmark from './Bookmark'
import { assetAquarius } from '../../../../.jest/__fixtures__/assetAquarius'
import { useUserPreferences } from '@context/UserPreferences'

jest.mock('@context/UserPreferences')

const bookmarks = [
  'did:op:6654b0793765b269696cec8d2f0d077d9bbcdd3c4f033d941ab9684e8ad06630'
]

describe('src/components/Asset/AssetContent/Bookmark.tsx', () => {
  it('renders Add Bookmark button', () => {
    render(<Bookmark did={assetAquarius.id} />)
    expect(screen.getByTitle('Add Bookmark')).toBeInTheDocument()
  })
  // it('Does not render Add Bookmark button when asset is already in bookmarks', () => {
  //   ;(useUserPreferences as jest.Mock).mockReturnValue([bookmarks])
  //   render(<Bookmark did={assetAquarius.id} />)
  //   expect(screen.getByTitle('Add Bookmark')).toBeInTheDocument()
  // })
})
