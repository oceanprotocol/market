import React, { ReactElement } from 'react'
import Tooltip from '../atoms/Tooltip'
import Status from '../atoms/Status'
import { useGraphSyncStatus } from '../../hooks/useGraphSyncStatus'
import { sync, status, text } from './SyncStatus.module.css'

export default function SyncStatus(): ReactElement {
  const { isGraphSynced, blockGraph, blockHead } = useGraphSyncStatus()

  return (
    <div className={sync}>
      <Tooltip
        content={`Synced to Ethereum block ${blockGraph} (out of ${blockHead})`}
      >
        <Status
          className={status}
          state={isGraphSynced ? 'success' : 'error'}
        />
        <span className={text}>{blockGraph}</span>
      </Tooltip>
    </div>
  )
}
