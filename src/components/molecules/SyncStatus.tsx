import React, { ReactElement } from 'react'
import Tooltip from '../atoms/Tooltip'
import Status from '../atoms/Status'
import { useGraphSyncStatus } from '../../hooks/useGraphSyncStatus'
import styles from './SyncStatus.module.css'

export default function SyncStatus(): ReactElement {
  const { blockNumber, graphBlockNumber, state } = useGraphSyncStatus()

  return (
    <div className={styles.sync}>
      <Tooltip
        content={`Synced to Ethereum block ${graphBlockNumber} (out of ${blockNumber})`}
      >
        <Status className={styles.status} state={state} />
        <span className={styles.text}>{blockNumber}</span>
      </Tooltip>
    </div>
  )
}
