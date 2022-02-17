import Copy from '@shared/atoms/Copy'
import External from '@images/external.svg'
import ExplorerLink from '@shared/ExplorerLink'
import { NftMetadata } from '@utils/nft'
import React, { ReactElement } from 'react'
import styles from './NftTooltip.module.css'
import explorerLinkStyles from '@shared/ExplorerLink/index.module.css'

export default function NftTooltip({
  nft,
  address,
  chainId,
  isBlockscoutExplorer
}: {
  nft: NftMetadata
  address: string
  chainId: number
  isBlockscoutExplorer: boolean
}): ReactElement {
  return (
    <div className={styles.wrapper}>
      <img src={nft?.image_data} alt={nft?.name} />
      <div className={styles.info}>
        <h5>{nft?.name}</h5>
        {address && (
          <span title={address} className={styles.address}>
            {address} <Copy text={address} />
          </span>
        )}
        <div className={styles.links}>
          <ExplorerLink
            className={styles.datatoken}
            networkId={chainId}
            path={
              isBlockscoutExplorer ? `tokens/${address}` : `token/${address}`
            }
          >
            View on explorer
          </ExplorerLink>
          <br />
          <a
            href="https://delta-dao.com"
            target="_blank"
            rel="noreferrer"
            className={explorerLinkStyles.link}
          >
            View on OpeanSea <External />
          </a>
        </div>
      </div>
    </div>
  )
}
