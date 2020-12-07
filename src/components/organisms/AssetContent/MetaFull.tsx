import React, { ReactElement } from 'react'
import Time from '../../atoms/Time'
import MetaItem from './MetaItem'
import styles from './MetaFull.module.css'
import { MetadataMarket } from '../../../@types/MetaData'
import { DDO } from '@oceanprotocol/lib'
import Publisher from '../../atoms/Publisher'

export default function MetaFull({
  ddo,
  metadata,
  isInPurgatory
}: {
  ddo: DDO
  metadata: MetadataMarket
  isInPurgatory: boolean
}): ReactElement {
  const { id, publicKey, created, updated } = ddo
  const { dateCreated } = metadata.main

  return (
    <div className={styles.metaFull}>
      {!isInPurgatory && (
        <MetaItem title="Data Author" content={metadata?.main.author} />
      )}
      <MetaItem
        title="Owner"
        content={<Publisher account={publicKey[0].owner} />}
      />

      {metadata?.additionalInformation?.categories && (
        <MetaItem
          title="Category"
          content={metadata?.additionalInformation?.categories[0]}
        />
      )}

      <MetaItem title="Data Created" content={<Time date={dateCreated} />} />
      <MetaItem title="Published" content={<Time date={created} />} />
      {created !== updated && (
        <MetaItem title="Updated" content={<Time date={updated} />} />
      )}
      <MetaItem title="DID" content={<code>{id}</code>} />
    </div>
  )
}
