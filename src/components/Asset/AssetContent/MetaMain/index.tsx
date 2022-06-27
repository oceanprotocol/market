import React, { ReactElement } from 'react'
import styles from './index.module.css'
import MetaAsset from './MetaAsset'
import MetaInfo from './MetaInfo'
import Nft from '../Nft'
import { AssetExtended } from 'src/@types/AssetExtended'

const blockscoutNetworks = [1287, 2021000, 2021001, 44787, 246, 1285]

export default function MetaMain({
  asset,
  nftPublisher
}: {
  asset: AssetExtended
  nftPublisher: string
}): ReactElement {
  const isBlockscoutExplorer = blockscoutNetworks.includes(asset?.chainId)

  return (
    <aside className={styles.meta}>
      <header className={styles.asset}>
        <Nft isBlockscoutExplorer={isBlockscoutExplorer} />
        <MetaAsset asset={asset} isBlockscoutExplorer={isBlockscoutExplorer} />
      </header>

      <MetaInfo asset={asset} nftPublisher={nftPublisher} />
    </aside>
  )
}
