import Link from 'next/link'
import React, { ReactElement, useEffect, useState } from 'react'
import { getAssetsNames } from '@utils/aquarius'
import styles from './AssetListTitle.module.css'
import axios from 'axios'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import { Asset } from '@oceanprotocol/lib'

export default function AssetListTitle({
  asset,
  did,
  title
}: {
  asset?: Asset
  did?: string
  title?: string
}): ReactElement {
  const { appConfig } = useSiteMetadata()
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
      <Link href={`/asset/${did || asset?.id}`}>
        <a>{assetTitle}</a>
      </Link>
    </h3>
  )
}
