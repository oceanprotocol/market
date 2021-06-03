import { DID } from '@oceanprotocol/lib'
import axios, { CancelTokenSource } from 'axios'
import React, { ReactElement, useEffect, useState } from 'react'
import { useOcean } from '../../providers/Ocean'
import { checkFile } from '../../utils/provider'
import Status from '../atoms/Status'
import Tooltip from '../atoms/Tooltip'
import styles from './AssetStatus.module.css'

export default function AssetStatus({
  did
}: {
  did: DID | boolean
}): ReactElement {
  const { ocean } = useOcean()
  const [isFileValid, setFileValid] = useState<boolean>()

  useEffect(() => {
    async function validateAsset(did: DID, source: CancelTokenSource) {
      const ddo = await ocean.metadataCache.retrieveDDO(did)
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
    if (did instanceof DID) validateAsset(did, source)
    else if (did === false) setFileValid(did)

    return () => {
      source.cancel()
    }
  }, [did])

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
