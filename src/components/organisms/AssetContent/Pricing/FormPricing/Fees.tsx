import React, { ReactElement } from 'react'
import Tooltip from '../../../../atoms/Tooltip'
import styles from './Fees.module.css'
import { useField } from 'formik'
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
    small
  />
)

export default function Fees({
  tooltips
}: {
  tooltips: { [key: string]: string }
}): ReactElement {
  const [field, meta] = useField('swapFee')

  return (
    <>
      <div className={styles.fees}>
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
          max="0.9"
          step="0.1"
          small
          {...field}
          additionalComponent={<Error meta={meta} />}
        />

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
