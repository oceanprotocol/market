import { FormikContextType, useFormikContext } from 'formik'
import React, { ReactElement, useEffect, useState } from 'react'
import { useAsset } from '@context/Asset'
import Token from '../Pool/Token'
import styles from './Output.module.css'

import { isValidNumber } from '@utils/numbers'
import Decimal from 'decimal.js'
import { FormTradeData } from './_types'
import { useWeb3 } from '@context/Web3'
import { Pool } from '@oceanprotocol/lib'

Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })

export default function Output({
  dtSymbol,
  baseTokenSymbol,
  poolAddress
}: {
  dtSymbol: string
  baseTokenSymbol: string
  poolAddress: string
}): ReactElement {
  const { isAssetNetwork } = useAsset()
  const { web3 } = useWeb3()
  const [maxOutput, setMaxOutput] = useState<string>()
  const [swapFee, setSwapFee] = useState<string>()
  const [swapFeeValue, setSwapFeeValue] = useState<string>()
  // Connect with form
  const { values }: FormikContextType<FormTradeData> = useFormikContext()

  // Get swap fee
  useEffect(() => {
    if (!poolAddress || !isAssetNetwork) return

    async function getSwapFee() {
      if (!web3) return
      const poolInstance = new Pool(web3)
      const swapFee = await poolInstance.getSwapFee(poolAddress)

      // // swapFee is tricky: to get 0.1% you need to convert from 0.001
      setSwapFee(
        isValidNumber(swapFee) ? new Decimal(swapFee).mul(100).toString() : '0'
      )

      const value =
        values.type === 'buy'
          ? isValidNumber(swapFee) && isValidNumber(values.baseToken)
            ? new Decimal(swapFee).mul(new Decimal(values.baseToken))
            : 0
          : isValidNumber(swapFee) && isValidNumber(values.datatoken)
          ? new Decimal(swapFee).mul(new Decimal(values.datatoken))
          : 0
      setSwapFeeValue(value.toString())
    }
    getSwapFee()
  }, [poolAddress, values, isAssetNetwork, swapFee, web3])

  // Get output values
  useEffect(() => {
    if (!poolAddress || !isAssetNetwork) return

    async function getOutput() {
      // Minimum received
      // TODO: check if this here is redundant cause we call some of that already in Swap.tsx
      const maxImpact = 1 - Number(values.slippage) / 100
      const maxPrice =
        values.type === 'buy'
          ? isValidNumber(values.datatoken) && isValidNumber(maxImpact)
            ? new Decimal(values.datatoken)
                .mul(new Decimal(maxImpact))
                .toString()
            : '0'
          : isValidNumber(values.baseToken) && isValidNumber(maxImpact)
          ? new Decimal(values.baseToken).mul(new Decimal(maxImpact)).toString()
          : '0'

      setMaxOutput(maxPrice)
    }
    getOutput()
  }, [poolAddress, values, isAssetNetwork])

  return (
    <div className={styles.output}>
      <div>
        <p>Minimum Received</p>
        <Token
          symbol={values.type === 'buy' ? dtSymbol : baseTokenSymbol}
          balance={maxOutput}
        />
      </div>
      <div>
        <p>Swap fee</p>
        <Token
          symbol={`${values.type === 'buy' ? baseTokenSymbol : dtSymbol} ${
            swapFee ? `(${swapFee}%)` : ''
          }`}
          balance={swapFeeValue}
        />
      </div>
    </div>
  )
}
