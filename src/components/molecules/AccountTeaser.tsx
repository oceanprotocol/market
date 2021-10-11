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
import { getUserSalesNumber } from '../../utils/subgraph'
import { useUserPreferences } from '../../providers/UserPreferences'
import NumberUnit from './NumberUnit'

declare type AccountTeaserProps = {
  account: string
}

const AccountTeaser: React.FC<AccountTeaserProps> = ({ account }) => {
  const { networkId } = useWeb3()
  const [profile, setProfile] = useState<Profile>()
  const [sales, setSales] = useState<number>(0)
  const newCancelToken = useCancelToken()
  const { chainIds } = useUserPreferences()

  useEffect(() => {
    if (!account) return
    async function get3Box() {
      const profile = await get3BoxProfile(account, newCancelToken())
      console.log('PROFILE: ', profile)
      if (!profile) return
      setProfile(profile)
      const userSales = await getUserSalesNumber(account, chainIds)
      setSales(userSales)
    }
    get3Box()
  }, [account, newCancelToken, chainIds])

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
        <div className={styles.stats}>
          <NumberUnit
            label={`Sale${sales === 1 ? '' : 's'}`}
            value={sales}
            small
          />
        </div>
      </Link>
    </article>
  )
}

export default AccountTeaser
