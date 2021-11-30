import { FormikContextType, useFormikContext } from 'formik'
import React, { ChangeEvent, ReactElement } from 'react'
import InputElement from '@shared/FormInput/InputElement'
import Tooltip from '@shared/atoms/Tooltip'
import styles from './Slippage.module.css'
import { FormTradeData } from './_types'
import { slippagePresets } from './_constants'

export default function Slippage({
  disabled
}: {
  disabled: boolean
}): ReactElement {
  // Connect with form
  const { setFieldValue, values }: FormikContextType<FormTradeData> =
    useFormikContext()

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    setFieldValue('slippage', e.target.value)
  }

  return (
    <div className={styles.slippage}>
      <strong>Slippage Tolerance</strong>
      <div>
        <InputElement
          name="slippage"
          type="select"
          size="mini"
          postfix="%"
          sortOptions={false}
          options={slippagePresets}
          value={values.slippage}
          disabled={disabled}
          onChange={handleChange}
        />
        <Tooltip content="Your transaction will revert if the price changes unfavorably by more than this percentage." />
      </div>
    </div>
  )
}
