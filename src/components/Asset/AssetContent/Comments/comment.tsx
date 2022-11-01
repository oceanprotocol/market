import React, { ReactElement, useEffect, useState } from 'react'
import Dotdotdot from 'react-dotdotdot'
import Link from 'next/link'
import styles from './commentitem.module.css'
import { accountTruncate } from '@utils/web3'
import Avatar from '../../../@shared/atoms/Avatar'
import { getEnsProfile } from '@utils/ens'
import { UserSales } from '@utils/aquarius'
import { type } from 'os'

declare type AccountProps = {
  account: UserSales
  place?: number
}

declare type CommentData = {
  commentedBy: Profile
  commentedById: string
  comment: string
  time: Date
}

export default function Comment({
  commentedBy,
  commentedById,
  comment,
  time
}: CommentData): ReactElement {
  const [profile, setProfile] = useState<Profile>()

  useEffect(() => {
    if (!commentedById) return

    async function getProfileData() {
      const profile = await getEnsProfile(commentedById)
      if (!profile) return
      setProfile(profile)
    }
    getProfileData()
  }, [commentedById])

  return (
    <Link href={`/profile/${profile?.name || commentedById}`}>
      <a className={styles.teaser}>
        <Avatar
          accountId={commentedById}
          className={styles.avatar}
          src={profile?.avatar}
        />
        <div>
          <Dotdotdot tagName="h4" clamp={2} className={styles.name}>
            {comment}
          </Dotdotdot>
          <p className={styles.sales}>
            {profile?.name ? profile?.name : accountTruncate(commentedById)}
          </p>
        </div>
      </a>
    </Link>
  )
}
