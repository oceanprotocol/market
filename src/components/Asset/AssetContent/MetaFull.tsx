import React, { ReactElement, useEffect, useState } from 'react'
import MetaItem from './MetaItem'
import styles from './MetaFull.module.css'
import Publisher from '@shared/Publisher'
import { useAsset } from '@context/Asset'

export default function MetaFull({
  ddo
}: {
  ddo: AssetExtended
}): ReactElement {
  const { isInPurgatory, assetState } = useAsset()
  console.log('ddo', ddo)
  function DockerImage() {
    const containerInfo = ddo?.metadata?.algorithm?.container
    const { image, tag } = containerInfo
    return <span>{`${image}:${tag}`}</span>
  }

  return ddo ? (
    <div className={styles.metaFull}>
      {!isInPurgatory && (
        <MetaItem title="Data Author" content={ddo?.metadata?.author} />
      )}
      <MetaItem
        title="Owner"
        content={<Publisher account={ddo?.nft?.owner} />}
      />
      {assetState !== 'Active' && (
        <MetaItem title="Asset State" content={assetState} />
      )}
      {ddo?.paymentCollector && ddo?.paymentCollector !== ddo?.nft?.owner && (
        <MetaItem
          title="Revenue Sent To"
          content={<Publisher account={ddo?.paymentCollector} />}
        />
      )}

      {ddo?.metadata?.type === 'algorithm' && ddo?.metadata?.algorithm && (
        <MetaItem title="Docker Image" content={<DockerImage />} />
      )}
      <MetaItem title="DID" content={<code>{ddo?.id}</code>} />
    </div>
  ) : null
}
