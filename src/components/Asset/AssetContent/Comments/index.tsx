import React, { ReactElement } from 'react'
// import styles from './index.module.css'
import { useUserPreferences } from '@context/UserPreferences'
import Comment from './Comment'
import styles from './Comments.module.css'
import { Asset } from '@oceanprotocol/lib'

export class CommentData {
  commentedBy: Profile
  commentedById: string
  comment: string
  time: Date
}

function getComments(metaAssets: Asset[], mydid: string): CommentData[] {
  const comments: CommentData[] = []

  for (let i = 0; i < metaAssets?.length; i++) {
    console.log('comments start')
    if (metaAssets[i].metadata.description.includes(mydid)) {
      const lines = metaAssets[i].metadata.description.split(',')

      for (let j = 0; j < lines?.length; j++) {
        console.log('My ' + mydid)
        const words = lines[j].split('|')
        console.log('Received' + mydid)
        if (words[0].trim() === mydid.trim()) {
          console.log('Got did' + words[0])
          const data: CommentData = new CommentData()
          data.commentedById = metaAssets[i].nft.owner
          data.comment = words[1]
          comments.push(data)
        }
      }
    }
  }
  console.log('Umesh printing comments')
  console.log(comments)
  return comments
}

declare type CommentsProps = {
  assets: Asset[]
  title: string
  mydid: string
}

export default function Comments({
  assets,
  title,
  mydid
}: CommentsProps): ReactElement {
  const { chainIds } = useUserPreferences()
  const emptyText =
    chainIds.length === 0 ? 'No network selected.' : 'No results found.'

  console.log(assets)
  const comments = getComments(assets, mydid)
  return (
    <div className={styles.metaItem}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.list}>
        {comments?.length > 0 ? (
          comments.map((commentData) => (
            <Comment
              comment={commentData.comment}
              commentedById={commentData.commentedById}
              commentedBy={commentData.commentedBy}
              time={commentData.time}
            />
          ))
        ) : (
          <div className={styles.empty}>{emptyText}</div>
        )}
      </div>
    </div>
  )
}
