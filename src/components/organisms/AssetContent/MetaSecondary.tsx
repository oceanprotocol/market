import React, { ReactElement } from 'react'
import Tags from '../../atoms/Tags'
import Button from '../../atoms/Button'
import { useAsset } from '../../../providers/Asset'
import MetaItem from './MetaItem'
import * as styles from './MetaSecondary.module.css'

const SampleButton = ({ url }: { url: string }) => (
  <Button
    href={url}
    target="_blank"
    rel="noreferrer"
    download
    style="text"
    size="small"
  >
    Download Sample
  </Button>
)

export default function MetaSecondary(): ReactElement {
  const { metadata } = useAsset()

  return (
    <aside className={styles.metaSecondary}>
      {metadata?.additionalInformation?.links?.length > 0 && (
        <div className={styles.samples}>
          <MetaItem
            title="Sample Data"
            content={
              <SampleButton
                url={metadata?.additionalInformation?.links[0].url}
              />
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
