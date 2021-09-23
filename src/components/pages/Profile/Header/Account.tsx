import React, { ReactElement } from 'react'
import { useUserPreferences } from '../../../../providers/UserPreferences'
import ExplorerLink from '../../../atoms/ExplorerLink'
import NetworkName from '../../../atoms/NetworkName'
import jellyfish from '@oceanprotocol/art/creatures/jellyfish/jellyfish-grid.svg'
import Copy from '../../../atoms/Copy'
import Blockies from '../../../atoms/Blockies'
import styles from './Account.module.css'
import { useProfile } from '../../../../providers/Profile'

export default function Account({
  accountId
}: {
  accountId: string
}): ReactElement {
  const { chainIds } = useUserPreferences()
  const { profile } = useProfile()

  return (
    <div className={styles.account}>
      <figure className={styles.imageWrap}>
        {profile?.image ? (
          <img
            src={profile?.image}
            className={styles.image}
            width="96"
            height="96"
          />
        ) : accountId ? (
          <Blockies accountId={accountId} className={styles.image} />
        ) : (
          <img
            src={jellyfish}
            className={styles.image}
            width="96"
            height="96"
          />
        )}
      </figure>

      <div>
        <h3 className={styles.name}>{profile?.name}</h3>
        {accountId && (
          <code
            className={styles.accountId}
            title={profile?.accountEns ? accountId : null}
          >
            {profile?.accountEns || accountId} <Copy text={accountId} />
          </code>
        )}
        <p>
          {accountId &&
            chainIds.map((value) => (
              <ExplorerLink
                className={styles.explorer}
                networkId={value}
                path={`address/${accountId}`}
                key={value}
              >
                <NetworkName networkId={value} />
              </ExplorerLink>
            ))}
        </p>
      </div>
    </div>
  )
}
