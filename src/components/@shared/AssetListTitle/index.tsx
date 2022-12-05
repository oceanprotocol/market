import Link from 'next/link'
import React, { ReactElement, useEffect, useState } from 'react'
import { getAssetsNames } from '@utils/aquarius'
import styles from './index.module.css'
import axios from 'axios'
import { Asset } from '@oceanprotocol/lib'
import { useMarketMetadata } from '@context/MarketMetadata'

export default function AssetListTitle({
  asset,
  did,
  title
}: {
  asset?: Asset
  did?: string
  title?: string
}): ReactElement {
  const { appConfig } = useMarketMetadata()
  const [assetTitle, setAssetTitle] = useState<string>(title)

  useEffect(() => {
    if (title || !appConfig.metadataCacheUri) return
    if (asset) {
      setAssetTitle(asset.metadata.name)
      return
    }

    const source = axios.CancelToken.source()

    async function getAssetName() {
      const title = await getAssetsNames([did], source.token)
      setAssetTitle(title[did])
    }

    !asset && did && getAssetName()

    return () => {
      source.cancel()
    }
  }, [assetTitle, appConfig.metadataCacheUri, asset, did, title])

  return (
    <h3 className={styles.title}>
      <Link href={`/asset/${did || asset?.id}`}>{assetTitle}</Link>
    </h3>
  )
}
