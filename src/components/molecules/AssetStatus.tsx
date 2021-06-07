import { DDO, DID } from '@oceanprotocol/lib'
import axios, { CancelTokenSource } from 'axios'
import React, { ReactElement, useEffect, useState } from 'react'
import { useOcean } from '../../providers/Ocean'
import { retrieveDDO } from '../../utils/aquarius'
import { checkFile } from '../../utils/provider'
import Status from '../atoms/Status'
import Tooltip from '../atoms/Tooltip'
import styles from './AssetStatus.module.css'

export default function AssetStatus({
  asset,
  isValid
}: {
  asset?: DDO | DID
  isValid?: boolean
}): ReactElement {
  const { config } = useOcean()
  const [isFileValid, setFileValid] = useState<boolean>()

  useEffect(() => {
    if (isValid === false) setFileValid(isValid)
  }, [isValid])

  useEffect(() => {
    if (!asset || isValid !== undefined) return
    async function validateAsset(asset: DDO | DID, source: CancelTokenSource) {
      const ddo =
        asset instanceof DID
          ? await retrieveDDO(
              asset.getDid(),
              config?.metadataCacheUri,
              source.token
            )
          : asset
      if (!ddo) return

      const fileValid = await checkFile(
        DID.parse(ddo.id),
        ddo.findServiceByType('access')?.serviceEndpoint ||
          ddo.findServiceByType('compute')?.serviceEndpoint,
        source.token
      )
      setFileValid(fileValid)
    }

    const source = axios.CancelToken.source()
    validateAsset(asset, source)
    return () => {
      source.cancel()
    }
  }, [asset])

  return isFileValid === false ? (
    <div className={styles.wrapper}>
      <Status className={styles.status} state="error" />
      <span className={styles.text}>Unavailable</span>
      <Tooltip
        className={styles.info}
        content="This dataset might be empty/offline, consume at your own risk."
      />
    </div>
  ) : null
}
