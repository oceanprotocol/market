import { FormikContextType, useFormikContext } from 'formik'
import React, { ReactElement, useEffect, useState } from 'react'
import { useAsset } from '@context/Asset'
import Token from '../Pool/Token'
import styles from './Output.module.css'

import { isValidNumber } from '@utils/numbers'
import Decimal from 'decimal.js'
import { FormTradeData } from './_types'
import { usePool } from '@context/Pool'

Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })

export default function Output({
  poolAddress
}: {
  poolAddress: string
}): ReactElement {
  const { isAssetNetwork } = useAsset()
  const { poolInfo } = usePool()
  const [outputWithSlippage, setOutputWithSlippage] = useState<string>('0')
  const [swapFee, setSwapFee] = useState<string>()
  const [swapFeeValue, setSwapFeeValue] = useState<string>()
  // Connect with form
  const { values }: FormikContextType<FormTradeData> = useFormikContext()

  // Get swap fee
  useEffect(() => {
    if (!poolInfo?.poolFee || !isAssetNetwork) return
    // // swapFee is tricky: to get 0.1% you need to convert from 0.001
    setSwapFee(
      isValidNumber(poolInfo.poolFee)
        ? new Decimal(poolInfo.poolFee).mul(100).toString()
        : '0'
    )

    const value =
      values.type === 'buy'
        ? isValidNumber(poolInfo.poolFee) && isValidNumber(values.baseToken)
          ? new Decimal(poolInfo.poolFee).mul(new Decimal(values.baseToken))
          : 0
        : isValidNumber(poolInfo.poolFee) && isValidNumber(values.datatoken)
        ? new Decimal(poolInfo.poolFee).mul(new Decimal(values.datatoken))
        : 0
    setSwapFeeValue(value.toString())
  }, [values, isAssetNetwork, poolInfo?.poolFee])

  // Get output values
  useEffect(() => {
    if (!poolAddress || !isAssetNetwork) return

    async function getOutput() {
      if (!values.baseToken || !values.datatoken || !values.output) return

      const output =
        values.output === 'exactIn'
          ? new Decimal(
              values.type === 'sell' ? values.baseToken : values.datatoken
            )
              .mul(
                new Decimal(1)
                  .minus(new Decimal(values.slippage).div(new Decimal(100)))
                  .toString()
              )
              .toString()
          : new Decimal(
              values.type === 'sell' ? values.datatoken : values.baseToken
            )
              .mul(
                new Decimal(1)
                  .plus(new Decimal(values.slippage).div(new Decimal(100)))
                  .toString()
              )
              .toString()

      setOutputWithSlippage(output)
    }
    getOutput()
  }, [poolAddress, values, isAssetNetwork])

  return (
    <div className={styles.output}>
      <div>
        <p>
          {values.output === 'exactIn' ? 'Minimum Received' : 'Maximum Sent'}
        </p>
        <Token
          symbol={
            values.type === 'buy'
              ? values.output === 'exactIn'
                ? poolInfo.datatokenSymbol
                : poolInfo.baseTokenSymbol
              : values.output === 'exactIn'
              ? poolInfo.baseTokenSymbol
              : poolInfo.datatokenSymbol
          }
          balance={outputWithSlippage}
        />
      </div>
      <div>
        <p>Swap fee</p>
        <Token
          symbol={`${
            values.type === 'buy'
              ? poolInfo.baseTokenSymbol
              : poolInfo.datatokenSymbol
          } ${swapFee ? `(${swapFee}%)` : ''}`}
          balance={swapFeeValue}
        />
      </div>
    </div>
  )
}
