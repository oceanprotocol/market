import { useUserPreferences } from '@context/UserPreferences'
import React, { ReactElement } from 'react'
import styles from './Bookmark.module.css'
import BookmarkIcon from '@images/bookmark.svg'

export default function Bookmark({ did }: { did: string }): ReactElement {
  const { bookmarks, addBookmark, removeBookmark } = useUserPreferences()
  const isBookmarked = bookmarks && bookmarks?.includes(did)

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
