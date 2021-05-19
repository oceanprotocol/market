import React, { ReactElement } from 'react'
import * as styles from './ProfileDetails.module.css'
import { Profile } from '../../../models/Profile'
import ExplorerLink from '../ExplorerLink'
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
    <>
      <div className={styles.profile}>
        <header className={styles.header}>
          {profile?.image && (
            <div className={styles.image}>
              <img src={profile.image} width="48" height="48" />
            </div>
          )}
          <h3 className={styles.title}>
            {profile?.emoji} {profile?.name}
          </h3>

          <ExplorerLink networkId={networkId} path={`address/${account}`}>
            <code>{account}</code>
          </ExplorerLink>
        </header>

        {profile?.description && (
          <p className={styles.description}>{profile?.description}</p>
        )}
        <PublisherLinks links={profile?.links} />
      </div>
      <div className={styles.meta}>
        Profile data from{' '}
        <a
          href={`https://www.3box.io/${account}`}
          target="_blank"
          rel="noreferrer"
        >
          3Box Hub
        </a>
      </div>
    </>
  )
}
