import { Link } from 'gatsby'
import React, { useEffect, useState } from 'react'
import Dotdotdot from 'react-dotdotdot'
import { Profile } from '../../models/Profile'
import { accountTruncate } from '../../utils/web3'
import get3BoxProfile from '../../utils/profile'
import styles from './AccountTeaser.module.css'
import Blockies from '../atoms/Blockies'
import { useCancelToken } from '../../hooks/useCancelToken'
import { getUserSales } from '../../utils/subgraph'
import { useUserPreferences } from '../../providers/UserPreferences'

declare type AccountTeaserProps = {
  account: string
}

const AccountTeaser: React.FC<AccountTeaserProps> = ({ account }) => {
  const [profile, setProfile] = useState<Profile>()
  const [sales, setSales] = useState(0)
  const newCancelToken = useCancelToken()
  const { chainIds } = useUserPreferences()

  useEffect(() => {
    if (!account) return
    async function getProfileData() {
      const profile = await get3BoxProfile(account, newCancelToken())
      if (!profile) return
      setProfile(profile)
    }
    getProfileData()
  }, [account, newCancelToken])

  useEffect(() => {
    if (!account) return
    async function getProfileSales() {
      const userSales = await getUserSales(account, chainIds)
      setSales(userSales)
    }
    getProfileSales()
  }, [account, chainIds])

  return (
    <article className={styles.teaser}>
      <Link to={`/profile/${account}`} className={styles.link}>
        <header className={styles.header}>
          {profile?.image ? (
            <img src={profile.image} className={styles.blockies} />
          ) : (
            <Blockies accountId={account} className={styles.blockies} />
          )}
          <div>
            <Dotdotdot className={styles.name} clamp={3}>
              {profile?.name ? (
                <h3> {profile.name}</h3>
              ) : (
                <h3>{accountTruncate(account)}</h3>
              )}
            </Dotdotdot>
            <p className={styles.sales}>
              {`${sales} ${sales === 1 ? 'sale' : 'sales'}`}
            </p>
          </div>
        </header>
      </Link>
    </article>
  )
}

export default AccountTeaser
