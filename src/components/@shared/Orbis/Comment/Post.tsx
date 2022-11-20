import React, { useState, useMemo, useEffect, ReactNode } from 'react'
import Link from 'next/link'
import { accountTruncate } from '@utils/web3'
import { didToAddress, formatMessage } from '@utils/orbis'
import Avatar from '@shared/atoms/Avatar'
import Time from '@shared/atoms/Time'
import { useOrbis } from '@context/Orbis'
import styles from './Post.module.css'
import Tooltip from '@shared/atoms/Tooltip'
import Postbox from './Postbox'

import Reply from '@images/reply.svg'
import ThumbsUp from '@images/thumbsup.svg'
import ThumbsDown from '@images/thumbsdown.svg'
import Laugh from '@images/laugh.svg'
import Ellipsis from '@images/ellipsis.svg'
import Caret from '@images/caret.svg'

type Reactions = Pick<
  IOrbisPost,
  'count_likes' | 'count_downvotes' | 'count_haha'
>

export default function Post({
  post,
  onClickReply
}: {
  post: IOrbisPost
  onClickReply: (value: IOrbisPost | boolean) => void
}) {
  const { orbis, account } = useOrbis()

  const [address, setAddress] = useState('')
  const [postClone, setPostClone] = useState<IOrbisPost>({ ...post })
  const [parsedBody, setParsedBody] = useState<ReactNode>()
  const [reacted, setReacted] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleted, setIsDeleted] = useState<number>(0)
  const [hideOverflow, setHideOverflow] = useState<boolean>(
    postClone.content.body.length >= 285
  )

  const reactions = useMemo(() => {
    const items = [
      {
        type: 'like',
        count: postClone.count_likes,
        title: 'Like',
        icon: <ThumbsUp role="img" aria-label="Like" />
      },
      {
        type: 'downvote',
        count: postClone.count_downvotes,
        title: 'Downvote',
        icon: <ThumbsDown role="img" aria-label="Downvote" />
      },
      {
        type: 'haha',
        count: postClone.count_haha,
        title: 'HA HA!',
        icon: <Laugh role="img" aria-label="Downvote" />
      }
    ]

    return items
  }, [postClone])

  const handleReaction = async (type: string) => {
    // Quick return if already reacted
    if (type === reacted) return

    // Optimistically increase reaction count
    setReacted(type)
    const _post: IOrbisPost = { ...postClone }
    const keys = {
      like: 'count_likes' as keyof Reactions,
      haha: 'count_haha' as keyof Reactions,
      downvote: 'count_downvotes' as keyof Reactions
    }
    // Decrease old reaction
    if (reacted) {
      _post[keys[reacted as keyof typeof keys]] -= 1
    }
    // Increase new reaction
    _post[keys[type as keyof typeof keys]] += 1
    setPostClone({ ..._post })
    const res = await orbis.react(postClone.stream_id, type)
    // Revert back if failed
    if (res.status !== 200) {
      setPostClone({ ...postClone })
    }
  }

  const callbackEdit = async (content: IOrbisPostContent) => {
    setPostClone({
      ...postClone,
      content,
      count_commits: postClone.count_commits + 1
    })
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (
      confirm(
        'Are you sure you want to delete this post?\r\nIf you ask for deletion your post might be removed from the Ceramic nodes hosting it.'
      )
    ) {
      setIsDeleted(1)
      await orbis.deletePost(postClone.stream_id)
      setIsDeleted(2)
    }
  }

  useEffect(() => {
    const getUserReaction = async () => {
      if (!account) return
      const { data } = await orbis.getReaction(postClone.stream_id, account.did)
      if (data) setReacted(data.type)
    }

    if (postClone) {
      const address =
        postClone?.creator_details?.metadata?.address ||
        didToAddress(postClone?.creator_details?.did)

      setAddress(address)
      setParsedBody(formatMessage(postClone.content, hideOverflow))

      if (account) getUserReaction()
    }
  }, [postClone, account, orbis, hideOverflow])

  return (
    <div
      className={`${styles.post} ${postClone.stream_id} ${
        postClone.stream_id.startsWith('new_post-') || isDeleted === 1
          ? styles.pulse
          : ''
      } ${isDeleted === 2 ? styles.deleted : ''}`}
    >
      <Avatar accountId={address} className={styles.blockies} />
      <div className={styles.content}>
        <div className={styles.profile}>
          <Link href={`/profile/${address}`}>
            <a className={styles.name}>{accountTruncate(address)}</a>
          </Link>
          <span>&bull;</span>
          <div className={styles.metadata}>
            {postClone?.creator_details?.metadata?.ensName ||
              accountTruncate(address)}
          </div>
          <span>&bull;</span>
          <div className={styles.metadata}>
            <Time
              date={post.timestamp.toString()}
              isUnix={true}
              displayFormat="Pp"
            />
          </div>
        </div>
        {isDeleted === 2 ? (
          <div className={styles.body}>-- This post is deleted -- </div>
        ) : !isEditing ? (
          <div className={styles.body}>{parsedBody}</div>
        ) : (
          <Postbox
            context={postClone?.context}
            editPost={postClone}
            callback={callbackEdit}
          />
        )}
        {hideOverflow && (
          <div
            className={styles.readMore}
            onClick={() => {
              setHideOverflow(false)
            }}
          >
            <Caret role="img" aria-label="Caret" />
            Read more
          </div>
        )}
        {isDeleted !== 2 && (
          <div className={styles.footer}>
            <div className={styles.reactions}>
              <button title="Reply" onClick={() => onClickReply(post)}>
                <Reply role="img" aria-label="Reply" />
                <span>Reply</span>
              </button>
              {reactions.map(({ type, count, icon, title }) => (
                <button
                  key={type}
                  onClick={() => handleReaction(type)}
                  title={title}
                  className={type === reacted ? styles.reacted : ''}
                >
                  {icon}
                  <span>{count}</span>
                </button>
              ))}
            </div>
            {postClone.creator_details.did === account?.did && (
              <div className={styles.menu}>
                <Tooltip
                  content={
                    <div className={styles.options}>
                      <button
                        className={styles.postEdit}
                        onClick={() => setIsEditing(true)}
                      >
                        Edit post
                      </button>
                      <button
                        className={styles.postDelete}
                        onClick={handleDelete}
                      >
                        Delete post
                      </button>
                    </div>
                  }
                  zIndex={21}
                  placement={'top'}
                >
                  <button
                    title="Options"
                    onClick={() => console.log('clicked')}
                  >
                    <Ellipsis role="img" aria-label="Options" />
                  </button>
                </Tooltip>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
