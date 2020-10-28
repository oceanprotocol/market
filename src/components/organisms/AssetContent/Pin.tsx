import { useUserPreferences } from '../../../providers/UserPreferences'
import React, { ReactElement } from 'react'
import styles from './Pin.module.css'

export default function Pin({ did }: { did: string }): ReactElement {
  const { pins, addPin, removePin } = useUserPreferences()
  const isPinned = pins?.includes(did)

  function handlePin() {
    isPinned ? removePin(did) : addPin(did)
  }

  return (
    <button onClick={handlePin} className={styles.pin}>
      {isPinned ? 'Remove' : 'Pin'}
    </button>
  )
}
