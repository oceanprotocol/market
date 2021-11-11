import React, { ReactElement } from 'react'
import MetaItem from './MetaItem'
import styles from './MetaFull.module.css'
import Publisher from '@shared/Publisher'
import { useAsset } from '@context/Asset'

export default function MetaFull(): ReactElement {
  const { ddo, isInPurgatory } = useAsset()
  const { type, author, algorithm } = ddo?.metadata

  function DockerImage() {
    const { image, tag } = algorithm?.container
    return <span>{`${image}:${tag}`}</span>
  }

  return (
    <div className={styles.metaFull}>
      {!isInPurgatory && <MetaItem title="Data Author" content={author} />}
      <MetaItem
        title="Owner"
        content={<Publisher account={ddo?.nft?.owner} />}
      />

      {type === 'algorithm' && algorithm && (
        <MetaItem title="Docker Image" content={<DockerImage />} />
      )}
      <MetaItem title="DID" content={<code>{ddo?.id}</code>} />
    </div>
  )
}
