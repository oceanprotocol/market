import React, { ReactElement } from 'react'
import styles from './index.module.css'
import { Asset } from '@oceanprotocol/lib'
import { decodeTokenURI } from '@utils/nft'
import MetaAsset from './MetaAsset'
import MetaInfo from './MetaInfo'
import Tooltip from '@shared/atoms/Tooltip'
import NftTooltip from './NftTooltip'
import Logo from '@shared/atoms/Logo'

export default function MetaMain({ asset }: { asset: Asset }): ReactElement {
  const nftMetadata = decodeTokenURI(asset?.nft?.tokenURI)

  const blockscoutNetworks = [1287, 2021000, 2021001, 44787, 246, 1285]
  const isBlockscoutExplorer = blockscoutNetworks.includes(asset?.chainId)

  return (
    <aside className={styles.meta}>
      <header className={styles.asset}>
        <div className={styles.nftImage}>
          {nftMetadata?.image_data ? (
            <img src={nftMetadata?.image_data} alt={asset?.nft?.name} />
          ) : (
            <Logo noWordmark />
          )}

          {(nftMetadata || asset?.nftAddress) && (
            <Tooltip
              className={styles.tooltip}
              content={
                <NftTooltip
                  nft={nftMetadata}
                  address={asset?.nftAddress}
                  chainId={asset?.chainId}
                  isBlockscoutExplorer={isBlockscoutExplorer}
                />
              }
            />
          )}
        </div>
        <MetaAsset asset={asset} isBlockscoutExplorer={isBlockscoutExplorer} />
      </header>

      <MetaInfo asset={asset} />
    </aside>
  )
}
