import { DDO } from '@oceanprotocol/lib'
import { useOcean } from '../../providers/Ocean'
import { Link } from 'gatsby'
import React, { ReactElement, useEffect, useState } from 'react'
import { getAssetsNames } from '../../utils/aquarius'
import styles from './AssetListTitle.module.css'
import axios from 'axios'

export default function AssetListTitle({
  ddo,
  did,
  title
}: {
  ddo?: DDO
  did?: string
  title?: string
}): ReactElement {
  const { metadataCacheUri } = useOcean()
  const [assetTitle, setAssetTitle] = useState<string>(title)

  useEffect(() => {
    if (title || !metadataCacheUri) return
    if (ddo) {
      const { attributes } = ddo.findServiceByType('metadata')
      setAssetTitle(attributes.main.name)
      return
    }

    const source = axios.CancelToken.source()

    async function getAssetName() {
      const title = await getAssetsNames([did], metadataCacheUri, source.token)
      setAssetTitle(title[did])
    }

    !ddo && did && getAssetName()

    return () => {
      source.cancel()
    }
  }, [assetTitle, metadataCacheUri, ddo, did, title])

  return (
    <h3 className={styles.title}>
      <Link to={`/asset/${did || ddo.id}`}>{assetTitle}</Link>
    </h3>
  )
}
