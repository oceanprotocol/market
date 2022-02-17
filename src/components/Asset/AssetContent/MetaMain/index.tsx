import React, { ReactElement } from 'react'
import styles from './index.module.css'
import { Asset } from '@oceanprotocol/lib'
import { decodeTokenURI } from '@utils/nft'
import MetaAsset from './MetaAsset'
import MetaInfo from './MetaInfo'

export default function MetaMain({ ddo }: { ddo: Asset }): ReactElement {
  return (
    <aside className={styles.meta}>
      <header className={styles.asset}>
        <img
          src={decodeTokenURI(ddo?.nft?.tokenURI)?.image_data}
          alt={ddo?.nft?.name}
          className={styles.nftImage}
        />
        <MetaAsset ddo={ddo} />
      </header>

      <MetaInfo ddo={ddo} />
    </aside>
  )
}
