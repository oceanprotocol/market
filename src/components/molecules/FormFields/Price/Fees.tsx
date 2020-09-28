import React, { ReactElement } from 'react'
import Tooltip from '../../../atoms/Tooltip'
import styles from './Fees.module.css'
import { useSiteMetadata } from '../../../../hooks/useSiteMetadata'
import { useField } from 'formik'
import Input from '../../../atoms/Input'
import Error from './Error'

export default function Fees({
  tooltips
}: {
  tooltips: { [key: string]: string }
}): ReactElement {
  const { appConfig } = useSiteMetadata()
  const [field, meta] = useField('price.swapFee')

  return (
    <>
      <div className={styles.fees}>
        <Input
          label={
            <>
              Liquidity Provider Fee
              <Tooltip content={tooltips.swapFee} />
            </>
          }
          type="number"
          postfix="%"
          min="0.1"
          max="0.9"
          step="0.1"
          small
          {...field}
          additionalComponent={<Error meta={meta} />}
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
    </>
  )
}
