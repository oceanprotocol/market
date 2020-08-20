import React, { ReactElement } from 'react'
import Time from '../../atoms/Time'
import MetaItem from './MetaItem'
import styles from './MetaFull.module.css'
import { MetadataMarket } from '../../../@types/Metadata'
import { DDO } from '@oceanprotocol/lib'
import { ReactComponent as External } from '../../../images/external.svg'

export default function MetaFull({
  ddo,
  metadata
}: {
  ddo: DDO
  metadata: MetadataMarket
}): ReactElement {
  const { id, dataToken } = ddo
  const { dateCreated, datePublished, author, license } = metadata.main
  const { categories } = metadata.additionalInformation

  return (
    <div className={styles.metaFull}>
      <MetaItem title="Author" content={author} />
      <MetaItem title="License" content={license} />
      {categories && <MetaItem title="Category" content={categories[0]} />}
      <MetaItem title="Data Created" content={<Time date={dateCreated} />} />

      <MetaItem
        title="Data Published"
        content={<Time date={datePublished} />}
      />

      <MetaItem title="DID" content={<code>{id}</code>} />

      <MetaItem
        title="Data Token"
        content={
          <a
            href={`https://rinkeby.etherscan.io/token/${dataToken}`}
            title="View on Etherscan"
            target="_blank"
            rel="noreferrer"
          >
            <code>
              {dataToken} <External />
            </code>
          </a>
        }
      />
    </div>
  )
}
