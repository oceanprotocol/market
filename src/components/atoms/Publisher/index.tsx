import React, { ReactElement, useEffect, useState } from 'react'
import styles from './index.module.css'
import classNames from 'classnames/bind'
import Tooltip from '../Tooltip'
import { Profile } from '../../../models/Profile'
import { Logger } from '@oceanprotocol/lib'
import { Link } from 'gatsby'
import get3BoxProfile from '../../../utils/profile'
import EtherscanLink from '../EtherscanLink'
import { accountTruncate } from '../../../utils/wallet'
import axios from 'axios'
import { useOcean } from '@oceanprotocol/react'
import { ReactComponent as Info } from '../../../images/info.svg'
import ProfileDetails from './ProfileDetails'

const cx = classNames.bind(styles)

export default function Publisher({
  account,
  minimal,
  className
}: {
  account: string
  minimal?: boolean
  className?: string
}): ReactElement {
  const { networkId } = useOcean()
  const [profile, setProfile] = useState<Profile>()

  useEffect(() => {
    if (!account) return

    const source = axios.CancelToken.source()

    async function get3Box() {
      const profile = await get3BoxProfile(account, source.token)
      if (!profile) return
      setProfile(profile)
      Logger.log(`Found 3Box profile for ${account}`, profile)
    }
    get3Box()

    return () => {
      source.cancel()
    }
  }, [account])

  const styleClasses = cx({
    publisher: true,
    [className]: className
  })

  return account ? (
    <div className={styleClasses}>
      {minimal ? (
        profile?.name || accountTruncate(account)
      ) : (
        <>
          <Link
            to={`/search/?owner=${account}`}
            title="Show all data sets created by this account."
          >
            {profile?.name || accountTruncate(account)}
          </Link>

          <div className={styles.links}>
            {' — '}
            {profile && (
              <Tooltip
                content={
                  <ProfileDetails
                    profile={profile}
                    networkId={networkId}
                    account={account}
                  />
                }
                // placement="top"
              >
                <span className={styles.detailsTrigger}>
                  Profile <Info className={styles.linksExternal} />
                </span>
              </Tooltip>
            )}
            <EtherscanLink networkId={networkId} path={`address/${account}`}>
              Etherscan
            </EtherscanLink>
          </div>
        </>
      )}
    </div>
  ) : null
}
