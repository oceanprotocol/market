import { FormikContextType, useFormikContext } from 'formik'
import React, { ReactElement, useEffect, useState } from 'react'
import { useAsset } from '@context/Asset'
import Token from '../Pool/Token'
import styles from './Output.module.css'

import Decimal from 'decimal.js'
import { FormTradeData } from './_types'
import { usePool } from '@context/Pool'

Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })

export default function Output({
  poolAddress,
  lpSwapFee
}: {
  poolAddress: string
  lpSwapFee: string
}): ReactElement {
  const { isAssetNetwork } = useAsset()
  const { poolInfo } = usePool()
  const [outputWithSlippage, setOutputWithSlippage] = useState<string>('0')
  // Connect with form
  const { values }: FormikContextType<FormTradeData> = useFormikContext()

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
          } ${poolInfo.poolFee ? `(${poolInfo.poolFee}%)` : ''}`}
          balance={lpSwapFee}
        />
      </div>
    </div>
  )
}
