import React, { useState, useEffect } from 'react'
import styles from './index.module.css'
import Posts from './Posts'
import Postbox from './Postbox'
import CommentIcon from '@images/comment.svg'
import { useOrbis } from '@context/Orbis'

export default function Comment({ asset }: { asset: AssetExtended }) {
  const { orbis } = useOrbis()
  const [posts, setPosts] = useState<OrbisPostInterface[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)

  const loadPosts = async () => {
    setLoading(true)
    // const context =
    //   process.env.NODE_ENV === 'development'
    //     ? 'kjzl6cwe1jw149vvm1f8p9qlohhtkjuc302f22mipq95q7mevdljgx3tv9swujy'
    //     : asset?.id
    const { data, error } = await orbis.getPosts({ context: asset?.id }, page)
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
    if (asset?.id && !posts.length && orbis) {
      loadPosts()
    }
  }, [asset, posts, orbis])

  const callbackPost = (nPost: OrbisPostInterface) => {
    // console.log(nPost)
    if (nPost.stream_id) {
      // Search and replace
      const _nPost = posts.findIndex((o) => {
        return !o.stream_id
      })
      console.log(_nPost)
      if (_nPost > -1) {
        const _posts = [...posts]
        _posts[_nPost] = nPost
        setPosts(_posts)
      }
    } else {
      const _posts = [nPost, ...posts]
      setPosts(_posts)
    }
  }

  useEffect(() => {
    console.log(posts)
  }, [posts])

  return (
    <div className={styles.comment}>
      <div className={styles.header}>
        <CommentIcon role="img" aria-label="Comment" className={styles.icon} />
        <span>Public Comment</span>
      </div>
      <div className={styles.postBox}>
        <Postbox
          callbackPost={callbackPost}
          assetId={asset?.id}
          placeholder="Share your comment here..."
        />
      </div>
      <div className={styles.content}>
        <Posts
          posts={posts}
          loading={loading}
          loadPosts={loadPosts}
          hasMore={hasMore}
        />
      </div>
    </div>
  )
}
