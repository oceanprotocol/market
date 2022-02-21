import React, { ReactElement, useEffect, useState } from 'react'
import Tooltip from '@shared/atoms/Tooltip'
import styles from './Fees.module.css'
import { useField } from 'formik'
import Input from '@shared/FormInput'
import Error from './Error'
import {
  publisherMarketPoolSwapFee,
  publisherMarketFixedSwapFee
} from '../../../../app.config'
import { getOpcFeees } from '../../../@utils/subgraph'
import { OpcFeesQuery_opc as OpcFeesData } from '../../../@types/subgraph/OpcFeesQuery'
import { useWeb3 } from '@context/Web3'

const Default = ({
  title,
  name,
  tooltip,
  value
}: {
  title: string
  name: string
  tooltip: string
  value: string
}) => (
  <Input
    label={
      <>
        {title}
        <Tooltip content={tooltip} />
      </>
    }
    value={value}
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
  const [field, meta] = useField('pricing.swapFee')
  const [opcFees, setOpcFees] = useState<OpcFeesData>(undefined)
  const { chainId } = useWeb3()

  useEffect(() => {
    getOpcFeees(chainId || 1).then((response: OpcFeesData) => {
      setOpcFees(response)
    })
  }, [chainId])

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
          value={opcFees?.consumeFee || '0'}
        />

        <Default
          title="Marketplace Fee"
          name="marketplaceFee"
          tooltip={tooltips.marketplaceFee}
          value={
            pricingType === 'dynamic'
              ? publisherMarketPoolSwapFee
              : publisherMarketFixedSwapFee
          }
        />
      </div>
    </>
  )
}
