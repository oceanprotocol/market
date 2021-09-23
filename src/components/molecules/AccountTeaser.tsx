import axios from 'axios'
import { toDataUrl } from 'ethereum-blockies'
import { Link } from 'gatsby'
import React, { useEffect, useState } from 'react'
import Dotdotdot from 'react-dotdotdot'
import { Profile } from '../../models/Profile'
import { useWeb3 } from '../../providers/Web3'
import { accountTruncate } from '../../utils/web3'
import get3BoxProfile from '../../utils/profile'
import ExplorerLink from '../atoms/ExplorerLink'
import Stats from '../pages/Profile/Header/Stats'
import styles from './AccountTeaser.module.css'
import ProfileProvider from '../../providers/Profile'
import Blockies from '../atoms/Blockies'

declare type AccountTeaserProps = {
  account: string
  showStatistics: boolean
}

const AccountTeaser: React.FC<AccountTeaserProps> = ({
  account,
  showStatistics
}) => {
  const { networkId } = useWeb3()
  const [profile, setProfile] = useState<Profile>()

  useEffect(() => {
    if (!account) return
    const source = axios.CancelToken.source()
    async function get3Box() {
      const profile = await get3BoxProfile(account, source.token)
      if (!profile) return

      setProfile(profile)
    }
    get3Box()
  }, [account])

  return (
    <article className={styles.teaser}>
      <Link to={`/profile/${account}`} className={styles.link}>
        <header className={styles.header}>
          {profile?.image ? (
            <img src={profile.image} className={styles.blockies} />
          ) : (
            <Blockies accountId={account} />
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
              <ExplorerLink
                networkId={networkId}
                path={`address/${account}`}
                className={styles.explore}
              >
                <span>{account}</span>
              </ExplorerLink>
            </div>
          </div>
        </header>
        {showStatistics && (
          <div className={styles.stats}>
            <ProfileProvider accountId={account}>
              <Stats accountId={account} showInAccountTeaser />
            </ProfileProvider>
          </div>
        )}
      </Link>
    </article>
  )
}

export default AccountTeaser
