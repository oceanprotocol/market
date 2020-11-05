import React, { ReactElement } from 'react'
import Time from '../../atoms/Time'
import MetaItem from './MetaItem'
import styles from './MetaFull.module.css'
import { MetadataMarket } from '../../../@types/MetaData'
import { DDO } from '@oceanprotocol/lib'
import Byline from './Byline'

export default function MetaFull({
  ddo,
  metadata
}: {
  ddo: DDO
  metadata: MetadataMarket
}): ReactElement {
  const { id, publicKey } = ddo
  const { dateCreated, datePublished } = metadata.main

  return (
    <div className={styles.metaFull}>
      <MetaItem title="Author" content={metadata?.main.author} />
      <MetaItem title="Owner" content={<Byline owner={publicKey[0].owner} />} />

      {metadata?.additionalInformation?.categories && (
        <MetaItem
          title="Category"
          content={metadata?.additionalInformation?.categories[0]}
        />
      )}

      <MetaItem title="Data Created" content={<Time date={dateCreated} />} />
      <MetaItem title="Published" content={<Time date={datePublished} />} />
      <MetaItem title="DID" content={<code>{id}</code>} />
    </div>
  )
}
