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

      {metadata?.additionalInformation?.categories && (
        <MetaItem
          title="Category"
          content={metadata?.additionalInformation?.categories[0]}
        />
      )}

      <MetaItem
        title="Data Created"
        content={<Time date={metadata?.main.dateCreated} />}
      />
      <MetaItem title="Published" content={<Time date={ddo?.created} />} />
      {ddo?.created !== ddo?.updated && (
        <MetaItem title="Updated" content={<Time date={ddo?.updated} />} />
      )}
      <MetaItem title="DID" content={<code>{ddo?.id}</code>} />
    </div>
  )
}
