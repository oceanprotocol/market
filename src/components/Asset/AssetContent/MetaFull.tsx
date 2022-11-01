import React, { ReactElement, ReactElement, useEffect, useState } from 'react'
import MetaItem from './MetaItem'
import styles from './MetaFull.module.css'
import Publisher from '@shared/Publisher'
import { useAsset } from '@context/Asset'
import { Asset } from '@oceanprotocol/lib'
import Comments from 'src/components/Asset/AssetContent/Comments'
import {
  getPublishedMeta,
  getPublishedAssets,
  getUserSales
} from '@utils/aquarius'
import { useUserPreferences } from '@context/UserPreferences'

export default function MetaFull({ ddo }: { ddo: Asset }): ReactElement {
  const { isInPurgatory } = useAsset()
  const { chainIds } = useUserPreferences()
  const [result, setResult] = useState<UserSales[]>([])
  const [loading, setLoading] = useState<boolean>()
  const [assets, setAssets] = useState<Asset[]>()

  function DockerImage() {
    const containerInfo = ddo?.metadata?.algorithm?.container
    const { image, tag } = containerInfo
    return <span>{`${image}:${tag}`}</span>
  }

  useEffect(() => {
    async function init() {
      setLoading(true)

      try {
        const assets: Asset[] = []
        const result = await getPublishedMeta(chainIds, null, 1, null, ddo?.id)
        setAssets(result.results)
        console.log(assets)
        setLoading(false)
      } catch (error) {
        LoggerInstance.error(error.message)
        setLoading(false)
      }
    }
    init()
  }, [])

  return ddo ? (
    <div className={styles.metaFull}>
      {!isInPurgatory && (
        <MetaItem title="Data Author" content={ddo?.metadata?.author} />
      )}
      <MetaItem
        title="Owner"
        content={<Publisher account={ddo?.nft?.owner} />}
      />

      {ddo?.metadata?.type === 'algorithm' && ddo?.metadata?.algorithm && (
        <MetaItem title="Docker Image" content={result} />
      )}

      {/* <AccountList accounts={result} isLoading={loading} /> */}

      <MetaItem title="DID" content={<code>{ddo?.id}</code>} />
      {ddo?.metadata?.type === 'algorithm' && ddo?.metadata?.algorithm && (
        <Comments title="Comments" assets={assets} mydid={ddo?.id} />
      )}
    </div>
  ) : null
}
