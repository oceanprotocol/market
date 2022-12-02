import React, { useState, useEffect } from 'react'
import styles from './index.module.css'
import Posts from './Posts'
import Postbox from './Postbox'
import CommentIcon from '@images/comment.svg'
import { useOrbis } from '@context/Orbis'

export default function Comment({ context }: { context: string }) {
  const { orbis } = useOrbis()
  const [posts, setPosts] = useState<IOrbisPost[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await orbis.getPosts(
      { context, algorithm: 'all-context-master-posts' },
      page
    )
    if (error) {
      console.log(error)
    }
    if (data && data.length) {
      const newPosts = posts.concat(data)
      setPosts(newPosts)

      const _hasMore = data.length >= 50
      setHasMore(_hasMore)

      if (_hasMore) setPage((prev) => prev + 1)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (context && !posts.length && orbis) {
      fetchPosts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, posts, orbis])

  const callback = (nPost: IOrbisPost) => {
    const _posts = [nPost, ...posts]
    setPosts(_posts)
  }

  return (
    <div className={styles.comment}>
      <div className={styles.header}>
        <CommentIcon role="img" aria-label="Comment" className={styles.icon} />
        <span>Public Comment</span>
      </div>
      <div className={styles.postBox}>
        <Postbox
          callback={callback}
          context={context}
          placeholder="Share your comment here..."
        />
      </div>
      <div className={`${styles.content} comment-scrollable`}>
        <Posts
          posts={posts}
          loading={loading}
          fetchPosts={fetchPosts}
          hasMore={hasMore}
        />
      </div>
    </div>
  )
}
