import React, { ReactElement, useEffect, useState } from 'react'
import styles from './Publisher.module.css'
import classNames from 'classnames/bind'
import Tooltip from './Tooltip'
import { Profile, ProfileLink } from '../../models/Profile'
import { Logger } from '@oceanprotocol/lib'
import { Link } from 'gatsby'
import get3BoxProfile from '../../utils/profile'
import EtherscanLink from './EtherscanLink'
import { accountTruncate } from '../../utils/wallet'
import axios from 'axios'
import { useOcean } from '@oceanprotocol/react'
import { ReactComponent as External } from '../../images/external.svg'

const cx = classNames.bind(styles)

function PublisherLinks({
  account,
  links
}: {
  account: string
  links: ProfileLink[]
}) {
  const { networkId } = useOcean()
  return (
    <div className={styles.links}>
      {' — '}
      {links?.map((link: ProfileLink) => {
        const href =
          link.name === 'Twitter'
            ? `https://twitter.com/${link.value}`
            : link.name === 'GitHub'
            ? `https://github.com/${link.value}`
            : link.value

        return (
          <a href={href} key={link.name} target="_blank" rel="noreferrer">
            {link.name} <External className={styles.linksExternal} />
          </a>
        )
      })}
      <EtherscanLink networkId={networkId} path={`address/${account}`}>
        Etherscan
      </EtherscanLink>
    </div>
  )
}

function Output({ profile, account }: { profile: Profile; account: string }) {
  return (
    <Tooltip
      content={
        profile ? (
          <>
            Data from <a href="https://3box.io">3box</a>
          </>
        ) : (
          <>
            Add profile on <a href="https://3box.io">3box</a>
          </>
        )
      }
      placement="top"
    >
      {profile?.name || accountTruncate(account)}
    </Tooltip>
  )
}

export default function Publisher({
  account,
  minimal,
  className
}: {
  account: string
  minimal?: boolean
  className?: string
}): ReactElement {
  const [profile, setProfile] = useState<Profile>()

  useEffect(() => {
    if (!account) return

    const source = axios.CancelToken.source()

    async function get3Box() {
      const profile = await get3BoxProfile(account, source.token)
      if (!profile) return
      setProfile(profile)
      Logger.log(`Found 3box profile for ${account}`, profile)
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
            <Output profile={profile} account={account} />
          </Link>
          <PublisherLinks account={account} links={profile?.links} />
        </>
      )}
    </div>
  ) : null
}
