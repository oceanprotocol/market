import React, { ReactElement } from 'react'
// import styles from './index.module.css'
import { useUserPreferences } from '@context/UserPreferences'
import Comment from './comment'
import styles from './Comments.module.css'
import { Asset } from '@oceanprotocol/lib'
import {
  CommentMetaData,
  CommentMetaDataItem
} from '../../AssetContent/Comments/CommentConstant'
import { listeners } from 'process'

function getComments(
  metaAssets: Asset[],
  mydid: string
): CommentMetaDataItem[] {
  const comments: CommentMetaDataItem[] = []
  for (let i = 0; i < metaAssets?.length; i++) {
    // Ignore unformatted comments from previous version
    if (!metaAssets[i].metadata.description.startsWith('{')) continue

    const meta = CommentMetaData.fromJSON(metaAssets[i].metadata.description)
    if (meta !== null) {
      console.log('---------------Comment-------------')
      console.log(meta.metadata)
      meta.metadata.forEach((x) => {
        console.log('hi ' + x.algorithm)
        if (x.algorithm === mydid) {
          debugger

          comments.push(x)
          console.log(x.comment)
          comments.push(x)
        }
      })
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
 
    <div className={styles.metaItem}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.list}>
        {comments?.length > 0 ? (
          comments.map((commentData) => (
            
            <Comment
              comment={commentData.comment}
              commentedById={commentData.by}
              commentedBy={commentData.by}
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
