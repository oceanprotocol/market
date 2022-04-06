import { usePool } from '@context/Pool'
import Button from '@shared/atoms/Button'
import React from 'react'
import styles from './Update.module.css'

export default function Update() {
  const { fetchAllData } = usePool()

  return (
    <div className={styles.update}>
      <Button style="text" size="small" onClick={() => fetchAllData()}>
        Refresh Data
      </Button>
      {/* Fetching every {refreshInterval / 1000} sec. */}
    </div>
  )
}
