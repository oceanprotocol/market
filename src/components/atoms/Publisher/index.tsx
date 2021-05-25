import React, { ReactElement, useEffect, useState } from 'react'
import { Profile } from '../../../models/Profile'
import { Link } from 'gatsby'
import get3BoxProfile from '../../../utils/profile'
import ExplorerLink from '../ExplorerLink'
import { accountTruncate } from '../../../utils/web3'
import axios from 'axios'
import { ReactComponent as Info } from '../../../images/info.svg'
import Tooltip from '../Tooltip'
import ProfileDetails from './ProfileDetails'
import Add from './Add'
import { useWeb3 } from '../../../providers/Web3'
import {
  publisher,
  links,
  detailsTrigger,
  linksExternal
} from './index.module.css'

export default function Publisher({
  account,
  minimal,
  className
}: {
  account: string
  minimal?: boolean
  className?: string
}): ReactElement {
  const { networkId, accountId } = useWeb3()
  const [profile, setProfile] = useState<Profile>()
  const [name, setName] = useState<string>()

  const showAdd = account === accountId && !profile

  useEffect(() => {
    if (!account) return

    setName(accountTruncate(account))
    const source = axios.CancelToken.source()

    async function get3Box() {
      const profile = await get3BoxProfile(account, source.token)
      if (!profile) return

      setProfile(profile)
      const { name, emoji } = profile
      name && setName(`${emoji || ''} ${name}`)
    }
    get3Box()

    return () => {
      source.cancel()
    }
  }, [account])

  return (
    <div className={`${publisher} ${className}`}>
      {minimal ? (
        name
      ) : (
        <>
          <Link
            to={`/search/?owner=${account}&sort=created&sortOrder=desc`}
            title="Show all data sets created by this account."
          >
            {name}
          </Link>
          <div className={links}>
            {' — '}
            {profile && (
              <Tooltip
                placement="bottom"
                content={
                  <ProfileDetails
                    profile={profile}
                    networkId={networkId}
                    account={account}
                  />
                }
              >
                <span className={detailsTrigger}>
                  Profile <Info className={linksExternal} />
                </span>
              </Tooltip>
            )}
            {showAdd && <Add />}
            <ExplorerLink networkId={networkId} path={`address/${account}`}>
              Explorer
            </ExplorerLink>
          </div>
        </>
      )}
    </div>
  )
}
