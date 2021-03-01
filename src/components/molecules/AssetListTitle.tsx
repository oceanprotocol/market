import { DDO } from '@oceanprotocol/lib'
import { useOcean } from '@oceanprotocol/react'
import { Link } from 'gatsby'
import React, { ReactElement, useEffect, useState } from 'react'
import { retrieveDDO, getAssetsNames } from '../../utils/aquarius'
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
  const { config } = useOcean()
  const [assetTitle, setAssetTitle] = useState<string>(title)

  useEffect(() => {
    if (title || !config?.metadataCacheUri) return
    if (ddo) {
      const { attributes } = ddo.findServiceByType('metadata')
      setAssetTitle(attributes.main.name)
      return
    }

    const source = axios.CancelToken.source()

    async function getAssetName() {
      getAssetsNames([did], config.metadataCacheUri, source.token).then(
        (resp) => {
          setAssetTitle(resp[did])
        }
      )
    }

    !ddo && did && getAssetName()

    return () => {
      console.log('canceled?')
      source.cancel()
    }
  }, [assetTitle, config?.metadataCacheUri, ddo, did, title])

  return (
    <h3 className={styles.title}>
      <Link to={`/asset/${did || ddo.id}`}>{assetTitle}</Link>
    </h3>
  )
}
