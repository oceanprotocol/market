import React, { useState, useEffect, useMemo, useRef, LegacyRef } from 'react'
import styles from './Replies.module.css'
import { useOrbis } from '@context/Orbis'
import Post from './Post'
import Postbox from './Postbox'

const RepliesGroup = ({
  items,
  replies,
  setReplyTo
}: {
  items: IOrbisPost[]
  replies: Record<string, IOrbisPost[]>
  setReplyTo: (value: IOrbisPost | boolean) => void
}) => {
  return (
    <>
      {items.map((item) => (
        <div key={item.stream_id} className={styles.replies}>
          <div className={styles.repliesItem}>
            <Post post={item} onClickReply={() => setReplyTo(item)} />
          </div>
          {replies[item.stream_id] !== undefined && (
            <RepliesGroup
              items={replies[item.stream_id]}
              replies={replies}
              setReplyTo={setReplyTo}
            />
          )}
        </div>
      ))}
    </>
  )
}

const Replies = ({
  master,
  replyTo,
  innerPostbox,
  setReplyTo,
  onNewPost
}: {
  master: IOrbisPost
  replyTo: IOrbisPost
  innerPostbox: LegacyRef<HTMLDivElement> | null
  setReplyTo: (value: IOrbisPost) => void
  onNewPost: (el: HTMLElement | null) => void
}) => {
  const { orbis } = useOrbis()
  const mainGroup = useRef<HTMLDivElement | null>(null)

  const [posts, setPosts] = useState<IOrbisPost[]>([])
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  // const [hasMore, setHasMore] = useState<boolean>(false)

  const repliesGroups = useMemo(() => {
    const grouped = posts.reduce((result, a) => {
      result[a.reply_to] = [...(result[a.reply_to] || []), a]
      return result
    }, {} as Record<string, IOrbisPost[]>)
    return grouped
  }, [posts])

  const getPosts = async () => {
    if (!master || isLoading) return

    setIsLoading(true)

    const { data, error } = await orbis.getPosts(
      {
        context: master.context,
        master: master.stream_id
      },
      currentPage
    )

    if (data) {
      data.reverse()
      setPosts([...posts, ...data])
      setCurrentPage((prev) => prev + 1)
      // setHasMore(data.length >= 50)
    }

    if (error) {
      console.error(error)
    }

    setIsLoading(false)
  }

  const callback = (newPost: IOrbisPost) => {
    const _posts = [...posts, newPost]
    setPosts(_posts)
    setReplyTo(null)

    // Try scroll to newly created post
    if (newPost.stream_id.startsWith('new_post-')) {
      setTimeout(() => {
        const el: HTMLElement = mainGroup.current?.querySelector(
          `.${newPost.stream_id}`
        )
        onNewPost(el)
      }, 100)
    }
  }

  useEffect(() => {
    if (master) getPosts()
  }, [master])

  return (
    <div ref={mainGroup}>
      {repliesGroups[master.stream_id] !== undefined && (
        <RepliesGroup
          items={repliesGroups[master.stream_id]}
          replies={repliesGroups}
          setReplyTo={setReplyTo}
        />
      )}
      {replyTo && (
        <div ref={innerPostbox} className={styles.repliesPostbox}>
          <Postbox
            context={master.context}
            replyTo={replyTo}
            placeholder="Reply this comment..."
            cancelReplyTo={() => setReplyTo(null)}
            callback={callback}
          />
        </div>
      )}
    </div>
  )
}

export default Replies
