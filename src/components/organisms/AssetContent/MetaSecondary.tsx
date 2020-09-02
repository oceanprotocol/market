import React, { ReactElement } from 'react'
import MetaItem from './MetaItem'
import styles from './MetaSecondary.module.css'
import { MetadataMarket } from '../../../@types/Metadata'
import Tags from '../../atoms/Tags'
import Button from '../../atoms/Button'

export default function MetaSecondary({
  metadata
}: {
  metadata: MetadataMarket
}): ReactElement {
  const { links, tags } = metadata.additionalInformation

  return (
    <aside className={styles.metaSecondary}>
      {links && links.length && (
        <div className={styles.samples}>
          <MetaItem
            title="Sample Data"
            content={
              <Button
                href={links[0].url}
                target="_blank"
                rel="noreferrer"
                download
                style="text"
                size="small"
              >
                Download Sample
              </Button>
            }
          />
        </div>
      )}

      {tags && tags.length > 0 && <Tags items={tags} />}
    </aside>
  )
}
