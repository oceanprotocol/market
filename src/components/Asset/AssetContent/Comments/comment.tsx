import React, { ReactElement, useEffect, useState } from 'react'
import Dotdotdot from 'react-dotdotdot'
import Link from 'next/link'
import styles from './commentitem.module.css'
import { accountTruncate } from '@utils/web3'
import Avatar from '../../../@shared/atoms/Avatar'
import { getEnsProfile } from '@utils/ens'
import { UserSales } from '@utils/aquarius'
import { type } from 'os'
import Time from '@shared/atoms/Time'
//
declare type AccountProps = {
  account: UserSales
  place?: number
}

declare type CommentData = {
  commentedBy: Profile
  commentedById: string
  comment: string
  time: number
}

// Pass CommentMetaDataItem directly here
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
    <div>
      <Link href={`/profile/${profile?.name || commentedById}`}>
        <a className={styles.teaser}>
          {comment}
          <p className={styles.sales}>
            {profile?.name ? profile?.name : accountTruncate(commentedById)}
          </p>
        </a>
      </Link>

      <Time date={`${time}`} relative isUnix />
    </div>
  )
}
