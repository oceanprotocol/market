import React, { ReactElement } from 'react'
import styles from './ProfileDetails.module.css'
import { Profile } from '../../../models/Profile'
import EtherscanLink from '../EtherscanLink'
import { accountTruncate } from '../../../utils/wallet'
import { ReactComponent as External } from '../../../images/external.svg'
import Dotdotdot from 'react-dotdotdot'
import PublisherLinks from './PublisherLinks'

export default function ProfileDetails({
  profile,
  networkId,
  account
}: {
  profile: Profile
  networkId: number
  account: string
}): ReactElement {
  return (
    <div className={styles.details}>
      <div className={styles.profile}>
        <header className={styles.header}>
          <h3 className={styles.title}>
            {profile?.emoji} {profile?.name}
          </h3>

          <EtherscanLink networkId={networkId} path={`address/${account}`}>
            <code>{account}</code>
          </EtherscanLink>
        </header>

        {profile?.description && (
          <Dotdotdot tagName="p" clamp={4}>
            {profile?.description}
          </Dotdotdot>
        )}
        <PublisherLinks links={profile?.links} />
        <p className={styles.ids}>
          <a
            href={`https://www.3box.io/${account}`}
            target="_blank"
            rel="noreferrer"
          >
            <code>{accountTruncate(profile.did)}</code>{' '}
            <External className={styles.linksExternal} />
          </a>
        </p>
      </div>
      <div className={styles.meta}>
        Profile data from{' '}
        <a href={`https://www.3box.io/${account}`}>3Box Hub</a>
      </div>
    </div>
  )
}
