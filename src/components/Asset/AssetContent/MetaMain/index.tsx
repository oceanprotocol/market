import React, { ReactElement } from 'react'
import styles from './index.module.css'
import { Asset } from '@oceanprotocol/lib'
import { decodeTokenURI } from '@utils/nft'
import MetaAsset from './MetaAsset'
import MetaInfo from './MetaInfo'
import Tooltip from '@shared/atoms/Tooltip'
import NftTooltip from './NftTooltip'

export default function MetaMain({ ddo }: { ddo: Asset }): ReactElement {
  const nftMetadata = decodeTokenURI(ddo?.nft?.tokenURI)

  const blockscoutNetworks = [1287, 2021000, 2021001, 44787, 246, 1285]
  const isBlockscoutExplorer = blockscoutNetworks.includes(ddo?.chainId)

  return (
    <aside className={styles.meta}>
      <header className={styles.asset}>
        <div className={styles.nftImage}>
          <img src={nftMetadata?.image_data} alt={ddo?.nft?.name} />

          <Tooltip
            className={styles.tooltip}
            content={
              <NftTooltip
                nft={nftMetadata}
                address={ddo?.nftAddress}
                chainId={ddo?.chainId}
                isBlockscoutExplorer={isBlockscoutExplorer}
              />
            }
          />
        </div>
        <MetaAsset ddo={ddo} isBlockscoutExplorer={isBlockscoutExplorer} />
      </header>

      <MetaInfo ddo={ddo} />
    </aside>
  )
}
