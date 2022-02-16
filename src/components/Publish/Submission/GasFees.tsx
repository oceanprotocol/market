import React from 'react'
import styles from './GasFees.module.css'
import Conversion from '@shared/Price/Conversion'

export default function GasFees({ gasFees }: { gasFees: string }) {
  return (
    <span className={styles.gasFees}>
      Gas fee estimation: <Conversion price={gasFees} />
    </span>
  )
}
