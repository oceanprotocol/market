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
import { CommentMetaDataItem } from './CommentConstant'
//
declare type AccountProps = {
  account: UserSales
  place?: number
}

export default function Comment({
  commentData
}: CommentMetaDataItem): ReactElement {
  const [profile, setProfile] = useState<Profile>()

  useEffect(() => {
    async function getProfileData() {
      const profile = await getEnsProfile(commentData.by)
      if (!profile) return
      setProfile(profile)
    }
    getProfileData()
  }, [commentData.by])

  return (
    <div className={styles.teaser} style={{ marginBottom: '4px' }}>
      <a href={`/asset/${commentData.claim}`}>Claim </a>
      is executed after
      <a href={`/asset/${commentData.algo}`}> algorithm </a>
      is executed on
      <a href={`/asset/${commentData.dataset}`}> dataset</a>
      <Link href={`/profile/${profile?.name || commentData.by}`}>
        <a>
          <p className={styles.sales}>
            {profile?.name ? profile?.name : commentData.by}
          </p>
        </a>
      </Link>
      <div className={styles.timeComment}>
        <Time date={`${commentData.time}`} relative isUnix />
      </div>
    </div>
  )
}
