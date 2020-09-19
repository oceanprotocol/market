import React, { ChangeEvent } from 'react'
import InputElement from '../../../atoms/Input/InputElement'
import Label from '../../../atoms/Input/Label'
import Tooltip from '../../../atoms/Tooltip'
import styles from './Fees.module.css'
import { useSiteMetadata } from '../../../../hooks/useSiteMetadata'

export default function Fees({
  liquidityProviderFee,
  onLiquidityProviderFeeChange,
  tooltips
}: {
  liquidityProviderFee: string
  onLiquidityProviderFeeChange: (event: ChangeEvent<HTMLInputElement>) => void
  tooltips: { [key: string]: string }
}) {
  const { appConfig } = useSiteMetadata()

  return (
    <div className={styles.fees}>
      <div>
        <Label htmlFor="liquidityProviderFee">
          Liquidity Provider Fee{' '}
          <Tooltip content={tooltips.liquidityProviderFee} />
        </Label>
        <InputElement
          type="number"
          value={liquidityProviderFee}
          name="liquidityProviderFee"
          postfix="%"
          onChange={onLiquidityProviderFeeChange}
          min="0.1"
          max="0.9"
          step="0.1"
          small
        />
      </div>
      <div>
        <Label htmlFor="communityFee">
          Community Fee <Tooltip content={tooltips.communityFee} />
        </Label>
        <InputElement
          value="0.1"
          name="communityFee"
          postfix="%"
          readOnly
          small
        />
      </div>
      <div>
        <Label htmlFor="marketplaceFee">
          Marketplace Fee <Tooltip content={tooltips.marketplaceFee} />
        </Label>
        <InputElement
          value={appConfig.marketFeeAmount}
          name="marketplaceFee"
          postfix="%"
          readOnly
          small
        />
      </div>
    </div>
  )
}
