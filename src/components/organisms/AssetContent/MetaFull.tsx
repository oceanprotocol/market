import React, { ReactElement } from 'react'
import Time from '../../atoms/Time'
import MetaItem from './MetaItem'
import styles from './MetaFull.module.css'
import { MetadataMarket } from '../../../@types/Metadata'

export default function MetaFull({
  did,
  metadata
}: {
  did: string
  metadata: MetadataMarket
}): ReactElement {
  const { dateCreated, datePublished, author, license } = metadata.main
  const { categories } = metadata.additionalInformation

  return (
    <div className={styles.metaFull}>
      <MetaItem title="Author" content={author} />
      <MetaItem title="License" content={license} />
      <MetaItem title="Category" content={categories[0]} />
      <MetaItem title="Data Created" content={<Time date={dateCreated} />} />

      <MetaItem
        title="Data Published"
        content={<Time date={datePublished} />}
      />

      <MetaItem title="DID" content={<code>{did}</code>} />
    </div>
  )
}
