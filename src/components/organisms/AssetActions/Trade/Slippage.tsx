import { FormikContextType, useFormikContext } from 'formik'
import React, { ChangeEvent, ReactElement } from 'react'
import { FormTradeData, slippagePresets } from '../../../../models/FormTrade'
import InputElement from '../../../atoms/Input/InputElement'
import styles from './Slippage.module.css'

export default function Slippage(): ReactElement {
  // Connect with form
  const { setFieldValue, values }: FormikContextType<FormTradeData> =
    useFormikContext()

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    setFieldValue('slippage', e.target.value)
  }

  return (
    <div className={styles.slippage}>
      <strong>Slippage Tolerance</strong>
      <InputElement
        name="slippage"
        type="select"
        size="mini"
        postfix="%"
        sortOptions={false}
        options={slippagePresets}
        value={values.slippage}
        onChange={handleChange}
      />
    </div>
  )
}
