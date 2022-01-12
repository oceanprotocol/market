import React, { ReactElement } from 'react'
import MetaItem from './MetaItem'
import styles from './MetaSecondary.module.css'
import Tags from '@shared/atoms/Tags'
import Button from '@shared/atoms/Button'
import { Asset } from '@oceanprotocol/lib'

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

export default function MetaSecondary({ ddo }: { ddo: Asset }): ReactElement {
  return (
    <aside className={styles.metaSecondary}>
      {ddo?.metadata.links?.length > 0 && (
        <div className={styles.samples}>
          <MetaItem
            title="Sample Data"
            content={<SampleButton url={ddo?.metadata.links[0]} />}
          />
        </div>
      )}
      {ddo?.metadata?.tags?.length > 0 && <Tags items={ddo?.metadata?.tags} />}
    </aside>
  )
}
