import { MetadataMarket } from '../../../@types/Metadata'
import React, { ReactElement } from 'react'
import Time from '../../atoms/Time'
import { Link } from 'gatsby'
import Markdown from '../../atoms/Markdown'
import MetaFull from './MetaFull'
import MetaSecondary from './MetaSecondary'
import styles from './index.module.css'
import AssetActions from '../AssetActions'
import { MetadataStore, Logger, DDO } from '@oceanprotocol/lib'

export interface AssetContentProps {
  metadata: MetadataMarket
  ddo: DDO
  path?: string
}

export default function AssetContent({
  metadata,
  ddo
}: AssetContentProps): ReactElement {
  const { datePublished } = metadata.main
  const { description, categories } = metadata.additionalInformation

  return (
    <article className={styles.grid}>
      <div className={styles.content}>
        <aside className={styles.meta}>
          <p>{datePublished && <Time date={datePublished} />}</p>
          {categories && (
            <p>
              <Link to={`/search?categories=["${categories[0]}"]`}>
                {categories[0]}
              </Link>
            </p>
          )}
        </aside>

        <Markdown text={description || ''} />

        <MetaSecondary metadata={metadata} />

        <MetaFull did={ddo.id} metadata={metadata} />

        <div className={styles.buttonGroup}>
          {/* <EditAction
              ddo={ddo}
              ocean={ocean}
              account={account}
              refetchMetadata={refetchMetadata}
            /> */}
          {/* <DeleteAction ddo={ddo} /> */}
        </div>
      </div>
      <div>
        <div className={styles.sticky}>
          <AssetActions metadata={metadata} ddo={ddo} />
        </div>
      </div>
    </article>
  )
}
