import React, { ReactElement } from 'react'
import MetaItem from './MetaItem'
import styles from './MetaFull.module.css'
import Publisher from '@shared/Publisher'
import { useAsset } from '@context/Asset'

export default function MetaFull(): ReactElement {
  const { ddo, metadata, isInPurgatory, type } = useAsset()
  const { algorithm } = ddo.findServiceByType('metadata').attributes.main

  function DockerImage() {
    const { image, tag } = algorithm.container
    return <span>{`${image}:${tag}`}</span>
  }

  return (
    <div className={styles.metaFull}>
      {!isInPurgatory && (
        <MetaItem title="Data Author" content={metadata?.main.author} />
      )}
      <MetaItem
        title="Owner"
        content={<Publisher account={ddo?.publicKey[0].owner} />}
      />

      {type === 'algorithm' && algorithm && (
        <MetaItem title="Docker Image" content={<DockerImage />} />
      )}
      <MetaItem title="DID" content={<code>{ddo?.id}</code>} />
    </div>
  )
}
