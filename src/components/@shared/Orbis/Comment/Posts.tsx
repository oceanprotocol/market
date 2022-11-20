import React from 'react'
import Loader from '@shared/atoms/Loader'
import Button from '@shared/atoms/Button'
import MasterPost from './MasterPost'
import styles from './Posts.module.css'

export default function Posts({
  context,
  posts,
  fetchPosts,
  hasMore,
  loading
}: {
  context: string
  posts: IOrbisPost[]
  fetchPosts: () => Promise<void>
  hasMore: boolean
  loading: boolean
}) {
  return (
    <div className={styles.posts}>
      {posts.length > 0 &&
        posts.map((post, index) => <MasterPost key={index} post={post} />)}

      {loading ? (
        <div className={styles.loader}>
          <Loader />
        </div>
      ) : (
        !posts.length && (
          <div className={styles.noComment}>No comment yet...</div>
        )
      )}

      {!loading && hasMore && (
        <div className={styles.loadMore}>
          <Button style="text" size="small" onClick={fetchPosts}>
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}
