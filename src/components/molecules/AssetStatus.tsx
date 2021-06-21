import React, { ReactElement } from 'react'
import Status from '../atoms/Status'
import Tooltip from '../atoms/Tooltip'
import styles from './AssetStatus.module.css'

export default function AssetStatus({
  isOrderDisabled
}: {
  isOrderDisabled: boolean
}): ReactElement {
  return isOrderDisabled === true ? (
    <div className={styles.wrapper}>
      <Status className={styles.status} state="error" />
      <span className={styles.text}>Disabled</span>
      <Tooltip
        className={styles.info}
        content="This dataset is disabled by the publisher, consume at your own risk"
      />
    </div>
  ) : null
}
