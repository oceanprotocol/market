import { useOcean } from '@oceanprotocol/react'
import { FormikContextType, useFormikContext } from 'formik'
import React, { ReactElement, useEffect, useState } from 'react'
import { FormTradeData } from '../../../../models/FormTrade'
import Token from '../Pool/Token'
import styles from './Output.module.css'

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

  // Connect with form
  const { values }: FormikContextType<FormTradeData> = useFormikContext()

  // Get swap fee
  useEffect(() => {
    if (!ocean || !poolAddress) return

    async function getSwapFee() {
      const swapFee = await ocean.pool.getSwapFee(poolAddress)
      // swapFee is tricky: to get 0.1% you need to convert from 0.001
      setSwapFee(`${Number(swapFee) * 100}`)
    }
    getSwapFee()
  }, [ocean, poolAddress])

  // Get output values
  useEffect(() => {
    if (!ocean || !poolAddress) return

    async function getOutput() {
      // Minimum received
      // TODO: check if this here is redundant cause we call some of that already in Swap.tsx
      const maxPrice =
        values.type === 'buy'
          ? await ocean.pool.getOceanNeeded(poolAddress, `${values.ocean}`)
          : await ocean.pool.getDTNeeded(poolAddress, `${values.datatoken}`)

      setMaxOutput(maxPrice)
    }
    getOutput()
  }, [ocean, poolAddress, values])

  return (
    <div className={styles.output}>
      <div>
        <p>Maximum Paid</p>
        <Token
          symbol={values.type === 'buy' ? dtSymbol : 'OCEAN'}
          balance={maxOutput}
        />
      </div>
      <div>
        <p>&nbsp;</p>
        <Token symbol="% swap fee" balance={swapFee} />
      </div>
    </div>
  )
}
