import React, { ReactElement } from 'react'
import Tooltip from '../../../../atoms/Tooltip'
import styles from './Fees.module.css'
import { useField, useFormikContext } from 'formik'
import Input from '../../../../atoms/Input'
import Error from './Error'

const Default = ({
  title,
  name,
  tooltip
}: {
  title: string
  name: string
  tooltip: string
}) => (
  <Input
    label={
      <>
        {title}
        <Tooltip content={tooltip} />
      </>
    }
    value="0.1"
    name={name}
    postfix="%"
    readOnly
    size="small"
  />
)

export default function Fees({
  tooltips,
  pricingType
}: {
  tooltips: { [key: string]: string }
  pricingType: 'dynamic' | 'fixed'
}): ReactElement {
  const [field, meta] = useField('swapFee')

  return (
    <>
      <div className={styles.fees}>
        {pricingType === 'dynamic' && (
          <Input
            label={
              <>
                Swap Fee
                <Tooltip content={tooltips.swapFee} />
              </>
            }
            type="number"
            postfix="%"
            min="0.1"
            max="10"
            step="0.1"
            size="small"
            {...field}
            additionalComponent={<Error meta={meta} />}
          />
        )}

        <Default
          title="Community Fee"
          name="communityFee"
          tooltip={tooltips.communityFee}
        />

        <Default
          title="Marketplace Fee"
          name="marketplaceFee"
          tooltip={tooltips.marketplaceFee}
        />
      </div>
    </>
  )
}
