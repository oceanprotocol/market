import React, { ReactElement } from 'react'
import { Profile } from '../../../models/Profile'
import ExplorerLink from '../ExplorerLink'
import PublisherLinks from './PublisherLinks'
import {
  profile as profileStyle,
  header,
  image,
  title,
  description,
  meta
} from './ProfileDetails.module.css'

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
      <div className={profileStyle}>
        <header className={header}>
          {profile?.image && (
            <div className={image}>
              <img src={profile.image} width="48" height="48" />
            </div>
          )}
          <h3 className={title}>
            {profile?.emoji} {profile?.name}
          </h3>

          <ExplorerLink networkId={networkId} path={`address/${account}`}>
            <code>{account}</code>
          </ExplorerLink>
        </header>

        {profile?.description && (
          <p className={description}>{profile?.description}</p>
        )}
        <PublisherLinks links={profile?.links} />
      </div>
      <div className={meta}>
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
