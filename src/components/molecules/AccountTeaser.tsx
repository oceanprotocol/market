import { Link } from 'gatsby'
import React, { useEffect, useState } from 'react'
import Dotdotdot from 'react-dotdotdot'
import { Profile } from '../../models/Profile'
import { useWeb3 } from '../../providers/Web3'
import { accountTruncate } from '../../utils/web3'
import get3BoxProfile from '../../utils/profile'
import ExplorerLink from '../atoms/ExplorerLink'
import styles from './AccountTeaser.module.css'
import Blockies from '../atoms/Blockies'
import { useCancelToken } from '../../hooks/useCancelToken'

declare type AccountTeaserProps = {
  account: string
}

const AccountTeaser: React.FC<AccountTeaserProps> = ({ account }) => {
  const { networkId } = useWeb3()
  const [profile, setProfile] = useState<Profile>()
  const newCancelToken = useCancelToken()

  useEffect(() => {
    if (!account) return
    async function getProfileData() {
      const profile = await get3BoxProfile(account, newCancelToken())
      if (!profile) return
      setProfile(profile)
    }
    getProfileData()
  }, [account, newCancelToken])

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
            <div className={styles.account}>
              <ExplorerLink networkId={networkId} path={`address/${account}`}>
                <span>{account}</span>
              </ExplorerLink>
            </div>
          </div>
        </header>
      </Link>
    </article>
  )
}

export default AccountTeaser
