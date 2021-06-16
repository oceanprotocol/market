import { Consumable } from '@oceanprotocol/lib/dist/node/ddo/interfaces/Consumable'
import React, { ReactElement } from 'react'
import Status from '../atoms/Status'
import Tooltip from '../atoms/Tooltip'
import styles from './AssetStatus.module.css'

export default function AssetStatus({
  consumable
}: {
  consumable: Consumable
}): ReactElement {
  return consumable?.status > 0 ? (
    <div className={styles.wrapper}>
      <Status className={styles.status} state="error" />
      <span className={styles.text}>Disabled</span>
      <Tooltip className={styles.info} content={consumable.message} />
    </div>
  ) : null
}
