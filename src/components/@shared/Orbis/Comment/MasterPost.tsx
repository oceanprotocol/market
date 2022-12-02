import React, { useState, useRef, useEffect } from 'react'
import styles from './MasterPost.module.css'
import Post from './Post'
import Replies from './Replies'
import Caret from '@images/caret.svg'

export default function MasterPost({ post }: { post: IOrbisPost }) {
  const masterPost = useRef<HTMLDivElement | null>(null)
  const innerPostbox = useRef<HTMLDivElement | null>(null)
  const [showReplies, setShowReplies] = useState(false)
  const [replyTo, setReplyTo] = useState<IOrbisPost | null>(null)
  const [scrollToEl, setScrollToEl] = useState<HTMLElement | string | null>(
    null
  )

  useEffect(() => {
    if (scrollToEl !== null) {
      const _scrollable: HTMLElement = masterPost.current.closest(
        '.comment-scrollable'
      )
      if (scrollToEl === 'masterPost') {
        setTimeout(() => {
          const _master = masterPost.current
          _scrollable.scrollTo({
            top: _master.offsetTop,
            behavior: 'smooth'
          })
        }, 500)
      } else if (scrollToEl === 'postbox') {
        setTimeout(() => {
          const _postbox = innerPostbox.current
          const halfScrollable = _scrollable.offsetHeight / 2
          const targetOffset = _postbox.offsetTop - halfScrollable
          _scrollable.scrollTo({
            top: targetOffset,
            behavior: 'smooth'
          })
        }, 500)
      } else {
        setTimeout(() => {
          const _el = scrollToEl as HTMLElement
          const halfScrollable = _scrollable.offsetHeight / 2
          const targetOffset = _el.offsetTop - halfScrollable
          _scrollable.scrollTo({
            top: targetOffset,
            behavior: 'smooth'
          })
        }, 500)
      }
    }

    return () => {
      setTimeout(() => {
        setScrollToEl(null)
      }, 500)
    }
  }, [scrollToEl])

  useEffect(() => {
    if (!showReplies) setReplyTo(null)
  }, [showReplies])

  return (
    <div ref={masterPost} className={styles.masterPost}>
      <Post
        post={post}
        onClickReply={() => {
          setReplyTo(post)
          setShowReplies(true)
          setScrollToEl('postbox')
        }}
      />
      {post?.count_replies !== undefined && post?.count_replies > 0 && (
        <div
          className={`${styles.showReplies} ${
            showReplies ? styles.opened : ''
          }`}
          onClick={() => {
            setScrollToEl(!showReplies ? 'masterPost' : null)
            setShowReplies((prev) => !prev)
          }}
        >
          <Caret role="img" aria-label="Caret" />
          {showReplies ? 'Hide' : 'View'} replies
        </div>
      )}
      {showReplies && (
        <div>
          <Replies
            master={post}
            innerPostbox={innerPostbox}
            replyTo={replyTo}
            setReplyTo={(post) => {
              setReplyTo(post)
              if (post) setScrollToEl('postbox')
            }}
            onNewPost={(el: HTMLElement | null) => setScrollToEl(el)}
          />
        </div>
      )}
    </div>
  )
}
