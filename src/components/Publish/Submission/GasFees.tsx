import React, { useEffect } from 'react'
import styles from './GasFees.module.css'
import Conversion from '@shared/Price/Conversion'
import { useFormikContext } from 'formik'
import { FormPublishData } from '../_types'

export default function GasFees({ gasFees }: { gasFees: string }) {
  const { setErrors } = useFormikContext<FormPublishData>()
  useEffect(() => {
    if (gasFees === 'insufficient-funds') {
      setErrors({
        feedback: {
          '1': {
            status: 'error'
          }
        }
      })
    }
  }, [gasFees])

  return gasFees === 'insufficient-funds' ? (
    <span className={`${styles.gasFees} ${styles.noFunds}`}>
      Insufficient ETH balance
    </span>
  ) : (
    <span className={styles.gasFees}>
      Gas fee estimation: <Conversion price={gasFees} />
    </span>
  )
}
