import InputElement from '@shared/FormInput/InputElement'
import { useFormikContext } from 'formik'
import React, { ChangeEvent, ReactElement } from 'react'
import { FormPublishData } from '../_types'
import styles from './CoinSelect.module.css'

export default function CoinSelect({
  approvedBaseTokens
}: {
  approvedBaseTokens: TokenInfo[]
}): ReactElement {
  const { values, setFieldValue } = useFormikContext<FormPublishData>()

  const handleBaseTokenSelection = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedBaseToken = approvedBaseTokens.find(
      (token) => token.symbol === e.target.value
    )
    setFieldValue('pricing.baseToken', selectedBaseToken)
  }

  return (
    approvedBaseTokens?.length > 0 && (
      <InputElement
        name="coinselect"
        className={styles.coinSelect}
        type="select"
        options={approvedBaseTokens?.map((token) => token.symbol)}
        value={values.pricing?.baseToken?.symbol}
        onChange={handleBaseTokenSelection}
      />
    )
  )
}
