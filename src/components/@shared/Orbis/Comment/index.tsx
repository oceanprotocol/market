import React from 'react'
import styles from './index.module.css'
import Posts from './Posts'
import Postbox from '../Postbox'
import CommentIcon from '@images/comment.svg'

export default function Comment({ asset }: { asset: AssetExtended }) {
  return (
    <div className={styles.comment}>
      <div className={styles.header}>
        <CommentIcon role="img" aria-label="Comment" className={styles.icon} />
        <span>Public Comment</span>
      </div>
      <div className={styles.postBox}>
        <Postbox placeholder="Share your comment here..." />
      </div>
      <div className={styles.content}>
        <Posts id={asset?.id} />
      </div>
    </div>
  )
}
