import React, { ReactElement, useEffect, useState } from 'react'
import Tooltip from '@shared/atoms/Tooltip'
import styles from './Fees.module.css'
import { useField } from 'formik'
import Input from '@shared/FormInput'
import Error from '@shared/FormInput/Error'
import { getOpcFees } from '../../../@utils/subgraph'
import { OpcFeesQuery_opc as OpcFeesData } from '../../../@types/subgraph/OpcFeesQuery'
import { useWeb3 } from '@context/Web3'
import { useMarketMetadata } from '@context/MarketMetadata'
import Decimal from 'decimal.js'

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
  const [oceanCommunitySwapFee, setOceanCommunitySwapFee] = useState<string>('')
  const { chainId } = useWeb3()
  const { appConfig } = useMarketMetadata()

  useEffect(() => {
    getOpcFees(chainId || 1).then((response: OpcFeesData) => {
      setOceanCommunitySwapFee(
        response?.swapOceanFee
          ? new Decimal(response.swapOceanFee).mul(100).toString()
          : '0'
      )
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
          title="Community Swap Fee"
          name="communityFee"
          tooltip={tooltips.communityFee}
          value={oceanCommunitySwapFee}
        />

        <Default
          title="Marketplace Fee"
          name="marketplaceFee"
          tooltip={tooltips.marketplaceFee}
          value={
            pricingType === 'dynamic'
              ? appConfig?.publisherMarketPoolSwapFee
              : appConfig?.publisherMarketFixedSwapFee
          }
        />
      </div>
    </>
  )
}
