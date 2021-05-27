import { DDO, DID } from '@oceanprotocol/lib'
import axios, { CancelTokenSource } from 'axios'
import React, { ReactElement, useEffect, useState } from 'react'
import { useOcean } from '../../providers/Ocean'
import { isFileValid } from '../../utils/provider'
import Status from '../atoms/Status'
import Tooltip from '../atoms/Tooltip'
import styles from './AssetStatus.module.css'

export default function AssetStatus({ ddo }: { ddo: DDO | DID }): ReactElement {
  const { ocean } = useOcean()
  const [fileConnectivity, setFileConnectivity] = useState<boolean>(true)

  useEffect(() => {
    async function validateAsset(ddo: DDO | DID, source: CancelTokenSource) {
      if (!ddo) return
      if (ddo instanceof DID) ddo = await ocean.metadataCache.retrieveDDO(ddo)

      const fileValid = await isFileValid(
        DID.parse(ddo.id),
        ddo.findServiceByType('access')?.serviceEndpoint ||
          ddo.findServiceByType('compute')?.serviceEndpoint,
        source.token
      )
      setFileConnectivity(fileValid)
    }

    const source = axios.CancelToken.source()
    validateAsset(ddo, source)

    return () => {
      source.cancel()
    }
  }, [ddo])

  if (fileConnectivity) return null

  return (
    <div className={styles.wrapper}>
      <Tooltip content="This dataset might be empty/offline, consume at your own risk.">
        <Status className={styles.status} state="error" />
        <span className={styles.text}>Unavailable</span> ⓘ
      </Tooltip>
    </div>
  )
}
