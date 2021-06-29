import { FormikContextType, useFormikContext } from 'formik'
import React, { ReactElement, useEffect, useState } from 'react'
import { FormTradeData } from '../../../../models/FormTrade'
import { useOcean } from '../../../../providers/Ocean'
import Token from '../Pool/Token'
import styles from './Output.module.css'

import { isValidNumber } from './../../../../utils/numberValidations'
import Decimal from 'decimal.js'

Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })

export default function Output({
  dtSymbol,
  poolAddress
}: {
  dtSymbol: string
  poolAddress: string
}): ReactElement {
  const { ocean } = useOcean()
  const [maxOutput, setMaxOutput] = useState<string>()
  const [swapFee, setSwapFee] = useState<string>()
  const [swapFeeValue, setSwapFeeValue] = useState<string>()
  // Connect with form
  const { values }: FormikContextType<FormTradeData> = useFormikContext()

  // Get swap fee
  useEffect(() => {
    if (!ocean || !poolAddress) return

    async function getSwapFee() {
      const swapFee = await ocean.pool.getSwapFee(poolAddress)
      // swapFee is tricky: to get 0.1% you need to convert from 0.001
      setSwapFee(`${Number(swapFee) * 100}`)
      const value =
        values.type === 'buy'
          ? isValidNumber(swapFee) && isValidNumber(values.ocean)
            ? new Decimal(swapFee).mul(new Decimal(values.ocean))
            : 0
          : isValidNumber(swapFee) && isValidNumber(values.datatoken)
          ? new Decimal(swapFee).mul(new Decimal(values.datatoken))
          : 0
      setSwapFeeValue(value.toString())
    }
    getSwapFee()
  }, [ocean, poolAddress, values])

  // Get output values
  useEffect(() => {
    if (!ocean || !poolAddress) return

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
          : isValidNumber(values.ocean) && isValidNumber(maxImpact)
          ? new Decimal(values.ocean).mul(new Decimal(maxImpact)).toString()
          : '0'

      setMaxOutput(maxPrice)
    }
    getOutput()
  }, [ocean, poolAddress, values])

  return (
    <div className={styles.output}>
      <div>
        <p>Minimum Received</p>
        <Token
          symbol={values.type === 'buy' ? dtSymbol : 'OCEAN'}
          balance={maxOutput}
        />
      </div>
      <div>
        <p>Swap fee</p>
        <Token
          symbol={`${values.type === 'buy' ? `OCEAN` : dtSymbol} ${
            swapFee ? `(${swapFee}%)` : ''
          }`}
          balance={swapFeeValue}
        />
      </div>
    </div>
  )
}
