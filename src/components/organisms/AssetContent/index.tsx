import { MetadataMarket } from '../../../@types/Metadata'
import React, { ReactElement } from 'react'
import Time from '../../atoms/Time'
import { Link } from 'gatsby'
import Markdown from '../../atoms/Markdown'
import MetaFull from './MetaFull'
import MetaSecondary from './MetaSecondary'
import styles from './index.module.css'
import AssetActions from '../AssetActions'
import { DDO } from '@oceanprotocol/lib'

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
          {categories && categories.length && (
            <p>
              <Link to={`/search?categories=["${categories[0]}"]`}>
                {categories[0]}
              </Link>
            </p>
          )}
        </aside>

        <Markdown text={description || ''} />

        <MetaSecondary metadata={metadata} />

        <MetaFull ddo={ddo} metadata={metadata} />

        <div className={styles.buttonGroup}>
          {/* <EditAction
              ddo={ddo}
              ocean={ocean}
              account={account}
              refetchMetadata={refetchMetadata}
            /> */}
          {/* <DeleteAction ddo={ddo} /> */}
        </div>

        <pre>
          <code>{JSON.stringify(ddo, null, 2)}</code>
        </pre>
      </div>
      <div>
        <div className={styles.sticky}>
          <AssetActions ddo={ddo} />
        </div>
      </div>
    </article>
  )
}
