import { toDataUrl } from 'ethereum-blockies'
import React, { ReactElement } from 'react'
import { useUserPreferences } from '../../../providers/UserPreferences'
import { accountTruncate } from '../../../utils/web3'
import ExplorerLink from '../../atoms/ExplorerLink'
import NetworkName from '../../atoms/NetworkName'
import jellyfish from '@oceanprotocol/art/creatures/jellyfish/jellyfish-grid.svg'
import styles from './Account.module.css'
import Copy from '../../atoms/Copy'

const Blockies = ({ account }: { account: string | undefined }) => {
  if (!account) return null

  const blockies = toDataUrl(account)

  return (
    <img
      className={styles.image}
      src={blockies}
      alt="Blockies"
      aria-hidden="true"
    />
  )
}

export default function Account({
  name,
  image,
  accountId
}: {
  name: string
  image: string
  accountId: string
}): ReactElement {
  const { chainIds } = useUserPreferences()

  return (
    <div className={styles.account}>
      <figure className={styles.imageWrap}>
        {image ? (
          <img src={image} className={styles.image} width="96" height="96" />
        ) : accountId ? (
          <Blockies account={accountId} />
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
        <h3 className={styles.name}>{name || accountTruncate(accountId)}</h3>
        <p>
          <code className={styles.accountId}>{accountId}</code>{' '}
          <Copy text={accountId} />
        </p>

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
