import { useUserPreferences } from '../../../providers/UserPreferences'
import React, { ReactElement } from 'react'
import { ReactComponent as BookmarkIcon } from '../../../images/bookmark.svg'
import { ConfigHelperConfig } from '@oceanprotocol/lib'
import { useOcean } from '../../../providers/Ocean'
import { bookmark, active } from './Bookmark.module.css'

export default function Bookmark({ did }: { did: string }): ReactElement {
  const { config } = useOcean()
  const { bookmarks, addBookmark, removeBookmark } = useUserPreferences()
  const isBookmarked =
    bookmarks &&
    bookmarks[(config as ConfigHelperConfig).network]?.includes(did)

  function handleBookmark() {
    isBookmarked ? removeBookmark(did) : addBookmark(did)
  }

  return (
    <button
      onClick={handleBookmark}
      className={`${bookmark} ${isBookmarked ? active : ''} `}
      title={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
    >
      <BookmarkIcon />
    </button>
  )
}
