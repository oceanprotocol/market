import React, { ReactElement } from 'react'
import styles from './index.module.css'
import MetaAsset from './MetaAsset'
import MetaInfo from './MetaInfo'
import Nft from '../Nft'
import { useAsset } from '@context/Asset'

const blockscoutNetworks = [1287, 2021000, 2021001, 44787, 246, 1285]

export default function MetaMain({
  nftPublisher
}: {
  nftPublisher: string
}): ReactElement {
  const { asset } = useAsset()
  const isBlockscoutExplorer = blockscoutNetworks.includes(asset?.chainId)

  return (
    <aside className={styles.meta}>
      <header className={styles.asset}>
        <Nft isBlockscoutExplorer={isBlockscoutExplorer} />
        <MetaAsset isBlockscoutExplorer={isBlockscoutExplorer} />
      </header>

      <MetaInfo nftPublisher={nftPublisher} />
    </aside>
  )
}
