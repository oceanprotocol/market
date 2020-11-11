import { FormikContextType, useFormikContext } from 'formik'
import React, { ChangeEvent, ReactElement } from 'react'
import { TradeLiquidity } from '.'
import InputElement from '../../../atoms/Input/InputElement'
import { slippagePresets } from './FormTrade'
import styles from './Slippage.module.css'

export default function Slippage(): ReactElement {
  // Connect with form
  const {
    setFieldValue,
    values
  }: FormikContextType<TradeLiquidity> = useFormikContext()

  function handleButtonClick(e: ChangeEvent<HTMLSelectElement>) {
    setFieldValue('slippage', e.target.value)
  }

  return (
    <>
      <h3 className={styles.title}>Expected Price Impact</h3>
      <div className={styles.slippage}>
        <strong>xx.xx%</strong> with{' '}
        <InputElement
          name="slippage"
          type="select"
          size="mini"
          options={slippagePresets}
          value={values.slippage}
          onChange={handleButtonClick}
        />{' '}
        additional limit.
      </div>
    </>
  )
}
