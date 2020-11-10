import { FormikContextType, useFormikContext } from 'formik'
import React, { ChangeEvent, ReactElement } from 'react'
import { TradeLiquidity } from '.'
import Button from '../../../atoms/Button'
import { slippagePresets } from './FormTrade'
import styles from './Slippage.module.css'

export default function Slippage(): ReactElement {
  // Connect with form
  const {
    setFieldValue,
    values
  }: FormikContextType<TradeLiquidity> = useFormikContext()

  function handleButtonClick(e: ChangeEvent<HTMLButtonElement>) {
    setFieldValue('slippage', e.target.textContent)
  }

  return (
    <>
      <h3 className={styles.title}>Slippage Tolerance</h3>
      <div className={styles.values}>
        {slippagePresets.map((value) => (
          <Button
            key={value}
            style="text"
            size="small"
            onClick={handleButtonClick}
            className={`${styles.preset} ${
              values.slippage === value ? styles.active : ''
            }`}
          >
            {value}
          </Button>
        ))}
      </div>
    </>
  )
}
