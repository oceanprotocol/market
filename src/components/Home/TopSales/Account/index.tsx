import React, { ReactElement, useEffect, useState } from 'react'
import Dotdotdot from 'react-dotdotdot'
import Link from 'next/link'
import styles from './index.module.css'
import { accountTruncate } from '@utils/web3'
import Avatar from '../../../@shared/atoms/Avatar'
import { getEnsProfile } from '@utils/ens'
import { UserSalesQuery_users as UserSales } from 'src/@types/subgraph/UserSalesQuery'

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
    if (!account) return

    async function getProfileData() {
      const profile = await getEnsProfile(account.id)
      if (!profile) return
      setProfile(profile)
    }
    getProfileData()
  }, [account])

  return (
    <article className={styles.teaser}>
      <Link href={`/profile/${profile?.name || account.id}`}>
        <header className={styles.header}>
          {place && <span>{place}</span>}
          <Avatar accountId={account.id} className={styles.blockies} />
          <div>
            <Dotdotdot clamp={3}>
              <h3 className={styles.name}>
                {profile?.name ? profile?.name : accountTruncate(account.id)}
              </h3>
            </Dotdotdot>
            <p className={styles.sales}>
              {`${account.totalSales} ${
                account.totalSales === 1 ? 'sale' : 'sales'
              }`}
            </p>
          </div>
        </header>
      </Link>
    </article>
  )
}
