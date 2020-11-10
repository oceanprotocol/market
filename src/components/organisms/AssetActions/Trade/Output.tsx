import { useOcean } from '@oceanprotocol/react'
import { FormikContextType, useFormikContext } from 'formik'
import React, { ReactElement, useEffect, useState } from 'react'
import { TradeLiquidity } from '.'
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
  const [minOutput, setMinOutput] = useState<string>()
  const [swapFee, setSwapFee] = useState<string>()

  // Connect with form
  const { values }: FormikContextType<TradeLiquidity> = useFormikContext()

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
      // TODO: check ity is actually the minimum received after transaction.
      const maxPrice =
        values.type === 'buy'
          ? await ocean.pool.getOceanNeeded(poolAddress, `${values.ocean}`)
          : await ocean.pool.getDTNeeded(`${values.datatoken}`, `1`)

      setMinOutput(maxPrice)
    }
    getOutput()
  }, [ocean, poolAddress, values])

  return (
    <div className={styles.output}>
      <div>
        <p>Maxiumum Paid</p>
        <Token
          symbol={values.type === 'buy' ? dtSymbol : 'OCEAN'}
          balance={minOutput}
        />
        <Token symbol="% slippage" balance="10" />
      </div>
      <div>
        <p>&nbsp;</p>
        <Token symbol="% swap fee" balance={swapFee} />
      </div>
    </div>
  )
}
