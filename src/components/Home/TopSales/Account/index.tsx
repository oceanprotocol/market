import React, { ReactElement, useEffect, useState } from 'react'
import Dotdotdot from 'react-dotdotdot'
import Link from 'next/link'
import styles from './index.module.css'
import { accountTruncate } from '@utils/web3'
import Avatar from '../../../@shared/atoms/Avatar'
import { getEnsProfile } from '@utils/ens'
import { UserSales } from '@utils/aquarius'

declare type AccountProps = {
  account: UserSales
  place?: number
}

export default function Account({
  account,
  place
}: AccountProps): ReactElement {
  const [profile, setProfile] = useState<Profile>()

  useEffect(() => {
    if (!account?.id) return

    async function getProfileData() {
      const profile = await getEnsProfile(account.id)
      if (!profile) return
      setProfile(profile)
    }
    getProfileData()
  }, [account?.id])

  return (
    <Link
      href={`/profile/${profile?.name || account.id}`}
      className={styles.teaser}
    >
      {place && <span className={styles.place}>{place}</span>}
      <Avatar
        accountId={account.id}
        className={styles.avatar}
        src={profile?.avatar}
      />
      <div>
        <Dotdotdot tagName="h4" clamp={2} className={styles.name}>
          {profile?.name ? profile?.name : accountTruncate(account.id)}
        </Dotdotdot>
        <p className={styles.sales}>
          <span>{account.totalSales}</span>
          {`${account.totalSales === 1 ? ' sale' : ' sales'}`}
        </p>
      </div>
    </Link>
  )
}
