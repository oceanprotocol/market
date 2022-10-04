import React, { useState, useEffect } from 'react'
import { useOrbis } from '@context/Orbis'
import Loader from '@shared/atoms/Loader'
import Button from '@shared/atoms/Button'
import Post from '../Post'
import styles from './Posts.module.css'

export default function Posts({ id }: { id: string }) {
  const { orbis } = useOrbis()
  const [posts, setPosts] = useState<OrbisPostInterface[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)

  const loadPosts = async () => {
    setLoading(true)
    const context = process.env.NODE_ENV
      ? 'kjzl6cwe1jw149vvm1f8p9qlohhtkjuc302f22mipq95q7mevdljgx3tv9swujy'
      : id
    const { data, error } = await orbis.getPosts({ context: id }, page)
    if (error) {
      console.log(error)
    }
    if (data) {
      const newPosts = posts.concat(data)
      setPosts(newPosts)

      const _hasMore = data.length >= 50
      setHasMore(_hasMore)

      if (_hasMore) setPage((prev) => prev + 1)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (id) {
      loadPosts()
    }
  }, [id])

  return (
    <div className={styles.posts}>
      <div>
        {posts.length > 0 &&
          posts.map((post, index) => <Post key={index} post={post} />)}
      </div>

      {loading && (
        <div className={styles.loader}>
          <Loader />
        </div>
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