import React, { ReactElement } from 'react'
import { Assets } from './Assets'
import styles from './index.module.css'
export default function AssetSignalsTab(): ReactElement {
  return (
    <div className={styles.submission}>
      <Assets />
    </div>
  )
}
