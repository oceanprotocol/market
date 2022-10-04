import React, { useState, useEffect, ReactNode } from 'react'
import Link from 'next/link'
import { accountTruncate } from '@utils/web3'
import { didToAddress, formatMessage } from '@utils/orbis'
import get3BoxProfile from '@utils/profile'
import Blockies from '@shared/atoms/Blockies'
import Time from '@shared/atoms/Time'
import { useCancelToken } from '@hooks/useCancelToken'
import { useOrbis } from '@context/Orbis'
import styles from './Post.module.css'

import ThumbsUp from '@images/thumbsup.svg'
import ThumbsDown from '@images/thumbsdown.svg'
import Laugh from '@images/laugh.svg'

export default function Post({
  post,
  showProfile = true
}: {
  post: OrbisPostInterface
  showProfile?: boolean
}) {
  const { orbis, account } = useOrbis()

  const [address, setAddress] = useState('')
  const [name, setName] = useState('')
  const [profile, setProfile] = useState<Profile>()
  const [parsedBody, setParsedBody] = useState<ReactNode>()
  const [reacted, setReacted] = useState('')

  const newCancelToken = useCancelToken()

  const reactions = [
    // {
    //   ctx: 'reply',
    //   countKey: 'count_replies',
    //   count: post.count_replies,
    //   title: 'Reply',
    //   icon:
    // },
    {
      ctx: 'like',
      countKey: 'count_likes',
      count: post.count_likes,
      title: 'Like',
      icon: <ThumbsUp role="img" aria-label="Like" />
    },
    {
      ctx: 'downvote',
      countKey: 'count_downvotes',
      count: post.count_downvotes,
      title: 'Downvote',
      icon: <ThumbsDown role="img" aria-label="Downvote" />
    },
    {
      ctx: 'haha',
      countKey: 'count_haha',
      count: post.count_haha,
      title: 'HA HA',
      icon: <Laugh role="img" aria-label="Downvote" />
    }
  ]

  const getUserReaction = async () => {
    if (!account?.did || !post?.stream_id) return

    const { data, error } = await orbis.api
      .from('orbis_reactions')
      .select('type')
      .eq('post_id', post.stream_id)
      .eq('creator', account.did)

    if (error) {
      console.log(error)
    }

    if (data) {
      if (data.length > 0) {
        console.log(data[0].type, post.content.body)
        setReacted(data[0].type)
      }
    }
  }

  const handleReaction = (type: string) => {
    console.log(type)
  }

  useEffect(() => {
    if (!post) return

    const address =
      post?.creator_details?.metadata?.address ||
      didToAddress(post?.creator_details?.did)

    setAddress(address)

    if (post?.creator_details?.metadata?.ensName) {
      setName(post?.creator_details?.metadata?.ensName)
    } else if (post?.creator_details?.profile?.username) {
      setName(post?.creator_details?.profile?.username)
    } else {
      setName(accountTruncate(address))
    }

    async function getProfileData() {
      const profile = await get3BoxProfile(address, newCancelToken())
      if (!profile) return
      setProfile(profile)
    }
    getProfileData()

    setParsedBody(formatMessage(post.content))

    getUserReaction()
  }, [post])

  useEffect(() => {
    if (orbis && account) getUserReaction()
  }, [orbis, account])

  return (
    <div className={styles.post}>
      <Blockies
        accountId={address}
        className={styles.blockies}
        image={profile?.image || post?.creator_details?.profile?.pfp}
      />
      <div className={styles.content}>
        {showProfile && (
          <div className={styles.profile}>
            <Link href={`/profile/${address}`}>
              <a className={styles.name}>{name}</a>
            </Link>
            <span>&bull;</span>
            <div className={styles.metadata}>{accountTruncate(address)}</div>
            <span>&bull;</span>
            <div className={styles.metadata}>
              <Time date={post.timestamp.toString()} isUnix={true} relative />
            </div>
          </div>
        )}
        <div className={styles.message}>{parsedBody}</div>
        <div className={styles.reactions}>
          {reactions.map(({ ctx, count, icon, title }) => (
            <button
              key={ctx}
              onClick={() => handleReaction(ctx)}
              title={title}
              className={ctx === reacted && styles.reacted}
            >
              {icon}
              <span>{count}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
