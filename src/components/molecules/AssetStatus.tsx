import { DID } from '@oceanprotocol/lib'
import axios, { CancelTokenSource } from 'axios'
import React, { ReactElement, useEffect, useState } from 'react'
import { checkFile } from '../../utils/provider'
import Status from '../atoms/Status'
import Tooltip from '../atoms/Tooltip'
import styles from './AssetStatus.module.css'

export default function AssetStatus({
  did,
  serviceEndpoint,
  isValid
}: {
  did?: string | DID
  serviceEndpoint?: string
  isValid?: boolean
}): ReactElement {
  const [isFileValid, setFileValid] = useState<boolean>()

  useEffect(() => {
    if (isValid === false) setFileValid(isValid)
  }, [isValid])

  useEffect(() => {
    if (!did || !serviceEndpoint || isValid !== undefined) return
    async function validateAsset(did: string | DID, source: CancelTokenSource) {
      const fileValid = await checkFile(
        did instanceof DID ? did : DID.parse(did),
        serviceEndpoint,
        source.token
      )
      setFileValid(fileValid)
    }

    const source = axios.CancelToken.source()
    validateAsset(did, source)
    return () => {
      source.cancel()
    }
  }, [did, serviceEndpoint])

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
