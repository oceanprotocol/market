import { useUserPreferences } from '../../../providers/UserPreferences'
import React, { ReactElement } from 'react'
import styles from './Bookmark.module.css'
import { ReactComponent as BookmarkIcon } from '../../../images/bookmark.svg'
import { useOcean } from '@oceanprotocol/react'
import { ConfigHelperConfig } from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'

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
      className={`${styles.bookmark} ${isBookmarked ? styles.active : ''} `}
      title={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
    >
      <BookmarkIcon />
    </button>
  )
}
