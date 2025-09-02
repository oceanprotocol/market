import React, { ReactElement, useEffect, useState } from 'react'
import Tooltip from '@shared/atoms/Tooltip'
import styles from './Fees.module.css'
import Input from '@shared/FormInput'
import { useMarketMetadata } from '@context/MarketMetadata'
import Decimal from 'decimal.js'
import useFactoryRouter from '@hooks/useRouter'
import { useAppKitNetworkCore } from '@reown/appkit/react'

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
  const { appConfig } = useMarketMetadata()
  const { fees } = useFactoryRouter()
  const { chainId } = useAppKitNetworkCore()
  useEffect(() => {
    setOceanCommunitySwapFee(
      fees.swapOceanFee
        ? new Decimal(fees.swapOceanFee).mul(100).toString()
        : '0'
    )
  }, [chainId, fees])

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
