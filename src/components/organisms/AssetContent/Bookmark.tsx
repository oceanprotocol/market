import { useUserPreferences } from '../../../providers/UserPreferences'
import React, { ReactElement } from 'react'
import styles from './Bookmark.module.css'
import { ReactComponent as PinIcon } from '../../../images/bookmark.svg'

export default function Bookmark({ did }: { did: string }): ReactElement {
  const { bookmarks, addBookmark, removeBookmark } = useUserPreferences()
  const isBookmarked = bookmarks?.includes(did)

  function handleBookmark() {
    isBookmarked ? removeBookmark(did) : addBookmark(did)
  }

  return (
    <button
      onClick={handleBookmark}
      className={`${styles.bookmark} ${isBookmarked ? styles.active : ''} `}
      title={isBookmarked ? 'Remove' : 'Pin'}
    >
      <PinIcon />
    </button>
  )
}
