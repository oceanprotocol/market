import React, { ReactElement } from 'react'
import MetaItem from './MetaItem'
import styles from './MetaSecondary.module.css'
import { MetadataMarket } from '../../../@types/MetaData'
import Tags from '../../atoms/Tags'
import Button from '../../atoms/Button'

export default function MetaSecondary({
  metadata
}: {
  metadata: MetadataMarket
}): ReactElement {
  return (
    <aside className={styles.metaSecondary}>
      {metadata?.additionalInformation?.links?.length > 0 && (
        <div className={styles.samples}>
          <MetaItem
            title="Sample Data"
            content={
              <Button
                href={metadata?.additionalInformation?.links[0].url}
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

      {metadata?.additionalInformation?.tags?.length > 0 && (
        <Tags items={metadata?.additionalInformation?.tags} />
      )}
    </aside>
  )
}
