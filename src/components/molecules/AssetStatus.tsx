import React, { ReactElement, useEffect, useState } from 'react'
import Status from '../atoms/Status'
import Tooltip from '../atoms/Tooltip'
import styles from './AssetStatus.module.css'

export default function AssetStatus({
  isDisable
}: {
  isDisable?: boolean
}): ReactElement {
  const [status, setStatus] = useState('')

  useEffect(() => {
    isDisable === true && setStatus('Disabled')
  }, [isDisable])

  return isDisable ? (
    <div className={styles.wrapper}>
      <Status className={styles.status} state="error" />
      <span className={styles.text}>{status}</span>
      <Tooltip
        className={styles.info}
        content="This dataset might be empty/offline, consume at your own risk."
      />
    </div>
  ) : null
}
