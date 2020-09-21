import React, { ChangeEvent, ReactElement } from 'react'
import Tooltip from '../../../atoms/Tooltip'
import styles from './Fees.module.css'
import { useSiteMetadata } from '../../../../hooks/useSiteMetadata'
import { useField } from 'formik'
import Input from '../../../atoms/Input'

export default function Fees({
  tooltips
}: {
  tooltips: { [key: string]: string }
}): ReactElement {
  const { appConfig } = useSiteMetadata()
  const [field, meta, helpers] = useField('price.liquidityProviderFee')

  // TODO: trigger Yup inline validation
  function handleLiquidityProviderFeeChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    helpers.setValue(event.target.value)
  }

  return (
    <>
      <div className={styles.fees}>
        <Input
          label={
            <>
              Liquidity Provider Fee
              <Tooltip content={tooltips.liquidityProviderFee} />
            </>
          }
          type="number"
          value={field.value}
          name="price.liquidityProviderFee"
          postfix="%"
          onChange={handleLiquidityProviderFeeChange}
          min="0.1"
          max="0.9"
          step="0.1"
          small
          {...field}
        />

        <Input
          label={
            <>
              Community Fee
              <Tooltip content={tooltips.communityFee} />
            </>
          }
          value="0.1"
          name="communityFee"
          postfix="%"
          readOnly
          small
        />

        <Input
          label={
            <>
              Marketplace Fee
              <Tooltip content={tooltips.marketplaceFee} />
            </>
          }
          value={appConfig.marketFeeAmount}
          name="marketplaceFee"
          postfix="%"
          readOnly
          small
        />
      </div>
      {meta.error && meta.touched && <div>{meta.error}</div>}
    </>
  )
}
