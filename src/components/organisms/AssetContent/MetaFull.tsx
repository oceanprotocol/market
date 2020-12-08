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
      {/* <MetaItem
        title="Data Created"
        content={<Time date={metadata?.main.dateCreated} />}
      /> */}

      {/* TODO: remove those 2 date items here when EditHistory component is ready */}
      <MetaItem title="Published" content={<Time date={ddo?.created} />} />
      {ddo?.created !== ddo?.updated && (
        <MetaItem title="Updated" content={<Time date={ddo?.updated} />} />
      )}
      <MetaItem title="DID" content={<code>{ddo?.id}</code>} />
    </div>
  )
}
