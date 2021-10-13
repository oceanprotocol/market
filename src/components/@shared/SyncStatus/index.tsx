import React, { ReactElement } from 'react'
import Tooltip from '@shared/atoms/Tooltip'
import Status from '@shared/atoms/Status'
import { useGraphSyncStatus } from '@hooks/useGraphSyncStatus'
<<<<<<< HEAD:src/components/@shared/SyncStatus/index.tsx
import styles from './index.module.css'
=======
import styles from './SyncStatus.module.css'
>>>>>>> 14d71ad2 (reorganize all the things):src/components/@shared/SyncStatus.tsx

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
