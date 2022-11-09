import React from 'react'
import Loader from '@shared/atoms/Loader'
import Button from '@shared/atoms/Button'
import Post from './Post'
import styles from './Posts.module.css'

export default function Posts({
  posts,
  loadPosts,
  hasMore,
  loading
}: {
  posts: OrbisPostInterface[]
  loadPosts: () => void
  hasMore: boolean
  loading: boolean
}) {
  return (
    <div className={styles.posts}>
      <div>
        {posts.length > 0 &&
          posts.map((post, index) => <Post key={index} post={post} />)}
      </div>

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
          <Button style="text" size="small" onClick={loadPosts}>
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}
