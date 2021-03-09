import React, { ReactElement } from 'react'
import Time from '../../atoms/Time'
import MetaItem from './MetaItem'
import styles from './MetaFull.module.css'
import Publisher from '../../atoms/Publisher'
import { useAsset } from '../../../providers/Asset'

export default function MetaFull(): ReactElement {
  const { ddo, metadata, isInPurgatory } = useAsset()

  return (
    <div className={styles.metaFull}>
      {!isInPurgatory && (
        <MetaItem title="Data Author" content={metadata?.main.author} />
      )}
      <MetaItem
        title="Owner"
        content={<Publisher account={ddo?.publicKey[0].owner} />}
      />
      <MetaItem title="DID" content={<code>{ddo?.id}</code>} />
    </div>
  )
}
