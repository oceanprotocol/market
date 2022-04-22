import { usePool } from '@context/Pool'
import { useUserPreferences } from '@context/UserPreferences'
import Button from '@shared/atoms/Button'
import React from 'react'
import styles from './Update.module.css'

export default function Update() {
  const { debug } = useUserPreferences()
  const { fetchAllData, refreshInterval } = usePool()

  return (
    <p className={styles.update}>
      Fetching every {refreshInterval / 1000} sec.{' '}
      {debug && (
        <Button
          style="text"
          size="small"
          onClick={() => fetchAllData()}
          className={styles.button}
        >
          Refresh Data
        </Button>
      )}
    </p>
  )
}
