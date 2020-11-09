import { useOcean } from '@oceanprotocol/react'
import React, { ReactElement, useEffect, useState } from 'react'
import Token from '../Pool/Token'
import styles from './Output.module.css'

export default function Output({
  poolAddress
}: {
  poolAddress: string
}): ReactElement {
  const { ocean } = useOcean()
  const [swapFee, setSwapFee] = useState<string>()

  useEffect(() => {
    if (!ocean || !poolAddress) return

    // Get swap fee
    // swapFee is tricky: to get 0.1% you need to convert from 0.001
    async function getSwapFee() {
      const swapFee = await ocean.pool.getSwapFee(poolAddress)
      setSwapFee(`${Number(swapFee) * 100}`)
    }
    getSwapFee()
  }, [ocean, poolAddress])

  return (
    <div className={styles.output}>
      <div>
        <p>Minimum Received</p>
        <Token symbol="OCEAN" balance="100" />
        <Token symbol="% slippage" balance="10" />
      </div>
      <div>
        <p>&nbsp;</p>
        <Token symbol="% swap fee" balance={swapFee} />
      </div>
    </div>
  )
}
