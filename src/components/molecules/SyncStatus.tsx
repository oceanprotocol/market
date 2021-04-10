import React, { ReactElement } from 'react'
import Tooltip from '../atoms/Tooltip'
import Status from '../atoms/Status'
import { useGraphSyncStatus } from '../../hooks/useGraphSyncStatus'
import styles from './SyncStatus.module.css'

export default function SyncStatus(): ReactElement {
  const { isGraphSynced, blockGraph, blockHead } = useGraphSyncStatus()

  return (
    <div className={styles.sync}>
      <Tooltip
        content={`Synced to Ethereum block ${blockGraph} (out of ${blockHead})`}
      >
        <Status
          className={styles.status}
          state={isGraphSynced ? 'success' : 'error'}
        />
        <span className={styles.text}>{blockGraph}</span>
      </Tooltip>
    </div>
  )
}
