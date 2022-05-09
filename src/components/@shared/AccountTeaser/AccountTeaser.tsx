import React, { ReactElement, useEffect, useState } from 'react'
import Dotdotdot from 'react-dotdotdot'
import Link from 'next/link'
import styles from './AccountTeaser.module.css'
import { useCancelToken } from '@hooks/useCancelToken'
import { accountTruncate } from '@utils/web3'
import Avatar from '../atoms/Avatar'

declare type AccountTeaserProps = {
  accountTeaserVM: AccountTeaserVM
  place?: number
}

export default function AccountTeaser({
  accountTeaserVM,
  place
}: AccountTeaserProps): ReactElement {
  const [profile, setProfile] = useState<Profile>()
  const newCancelToken = useCancelToken()

  // useEffect(() => {
  //   if (!accountTeaserVM) return
  //   async function getProfileData() {
  //     const profile = await get3BoxProfile(
  //       accountTeaserVM.address,
  //       newCancelToken()
  //     )
  //     if (!profile) return
  //     setProfile(profile)
  //   }
  //   getProfileData()
  // }, [accountTeaserVM, newCancelToken])

  return (
    <Link href={`/profile/${accountTeaserVM.address}`}>
      <a className={styles.teaser}>
        {place && <span className={styles.place}>{place}</span>}
        <Avatar
          accountId={accountTeaserVM.address}
          className={styles.blockies}
          image={profile?.image}
        />
        <div>
          <Dotdotdot tagName="h4" clamp={2} className={styles.name}>
            {profile?.name
              ? profile?.name
              : accountTruncate(accountTeaserVM.address)}
          </Dotdotdot>
          <p className={styles.sales}>
            <span>{accountTeaserVM.nrSales}</span>
            {`${accountTeaserVM.nrSales === 1 ? ' sale' : ' sales'}`}
          </p>
        </div>
      </a>
    </Link>
  )
}
