import { toDataUrl } from 'ethereum-blockies'
import React, { ReactElement, useState } from 'react'
import { useUserPreferences } from '../../../providers/UserPreferences'
import { useWeb3 } from '../../../providers/Web3'
import { accountTruncate } from '../../../utils/web3'
import ExplorerLink from '../../atoms/ExplorerLink'
import NetworkName from '../../atoms/NetworkName'
import styles from './Account.module.css'

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
  image
}: {
  name: string
  image: string
}): ReactElement {
  const { chainIds } = useUserPreferences()
  const { accountId } = useWeb3()

  return (
    <div className={styles.account}>
      <figure className={styles.imageWrap}>
        {image ? (
          <img src={image} className={styles.image} width="96" height="96" />
        ) : (
          <Blockies account={accountId} />
        )}
      </figure>

      <div>
        <h3 className={styles.name}>{name || accountTruncate(accountId)}</h3>

        {chainIds.map((value) => (
          <ExplorerLink
            className={styles.explorer}
            networkId={value}
            path={`address/${accountId}`}
            key={value}
          >
            <NetworkName networkId={value} />
          </ExplorerLink>
        ))}
      </div>
    </div>
  )
}
