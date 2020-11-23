import { DDO } from '@oceanprotocol/lib'
import { useOcean } from '@oceanprotocol/react'
import { Link } from 'gatsby'
import React, { ReactElement, useEffect, useState } from 'react'
import { useDataPartner } from '../../hooks/useDataPartner'
import { retrieveDDO } from '../../utils/aquarius'
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
    if (assetTitle || !config?.metadataCacheUri) return

    if (ddo) {
      const { attributes } = ddo.findServiceByType('metadata')
      setAssetTitle(attributes.main.name)
      return
    }

    const source = axios.CancelToken.source()

    async function getDDO() {
      const ddo = await retrieveDDO(did, config.metadataCacheUri, source.token)
      const { attributes } = ddo.findServiceByType('metadata')
      setAssetTitle(attributes.main.name)
    }

    !ddo && did && getDDO()

    return () => {
      source.cancel()
    }
  }, [assetTitle, config?.metadataCacheUri, ddo, did])

  return (
    <h3 className={styles.title}>
      <Link to={`/asset/${did || ddo.id}`}>{assetTitle}</Link>
    </h3>
  )
}
