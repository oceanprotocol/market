import React, { ReactElement, useEffect, useState } from 'react'
import Tooltip from '@shared/atoms/Tooltip'
import styles from './Fees.module.css'
import Input from '@shared/FormInput'
import { getOpcFees } from '@utils/subgraph'
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
  tooltips
}: {
  tooltips: { [key: string]: string }
}): ReactElement {
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
          value={appConfig?.publisherMarketFixedSwapFee}
        />
      </div>
    </>
  )
}
