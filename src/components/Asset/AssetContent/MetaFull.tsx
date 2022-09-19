import React, { ReactElement } from 'react'
import MetaItem from './MetaItem'
import styles from './MetaFull.module.css'
import Publisher from '@shared/Publisher'
import { useAsset } from '@context/Asset'
import { Asset } from '@oceanprotocol/lib'
import Button from '@shared/atoms/Button'
import External from '@images/external.svg'
import Link from 'next/link'

export default function MetaFull({ ddo }: { ddo: Asset }): ReactElement {
  const { isInPurgatory } = useAsset()

  console.log({ ddo })
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
        title="Owners"
        content={<Publisher account={ddo?.nft?.owner} />}
      />

      {ddo?.metadata?.type === 'algorithm' && ddo?.metadata?.algorithm && (
        <MetaItem title="Docker Image" content={<DockerImage />} />
      )}
      <MetaItem title="DID" content={<code>{ddo?.id}</code>} />
      {ddo?.metadata.type === 'datastream' ? (
        <>
          <MetaItem
            title="Stream API Documentation URL"
            content={
              <Link href={ddo?.services[0].docs}>
                <a title="visit API page.">{ddo?.services[0].docs}</a>
              </Link>
            }
          />
        </>
      ) : (
        ''
      )}
    </div>
  ) : null
}
