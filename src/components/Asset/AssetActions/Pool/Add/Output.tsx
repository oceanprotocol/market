import { FormikContextType, useFormikContext } from 'formik'
import React, { ReactElement, useEffect, useState } from 'react'
import { FormAddLiquidity } from '.'
import FormHelp from '@shared/Form/Input/Help'
import Token from '../Token'
import styles from './Output.module.css'
import Decimal from 'decimal.js'
import { pool } from '../../../../../../content/price.json'

export default function Output({
  newPoolTokens,
  newPoolShare,
  swapFee,
  dtSymbol,
  totalPoolTokens,
  totalBalance,
  coin
}: {
  newPoolTokens: string
  newPoolShare: string
  swapFee: string
  dtSymbol: string
  totalPoolTokens: string
  totalBalance: PoolBalance
  coin: string
}): ReactElement {
  const { help, titleIn, titleOut } = pool.add.output

  // Connect with form
  const { values }: FormikContextType<FormAddLiquidity> = useFormikContext()

  const [poolOcean, setPoolOcean] = useState('0')
  const [poolDatatoken, setPoolDatatoken] = useState('0')

  useEffect(() => {
    if (!values.amount || !totalBalance || !totalPoolTokens || !newPoolTokens)
      return
    const newPoolSupply = new Decimal(totalPoolTokens).plus(newPoolTokens)
    const ratio = new Decimal(newPoolTokens).div(newPoolSupply)
    const newOceanReserve =
      coin === 'OCEAN'
        ? new Decimal(totalBalance.ocean).plus(values.amount)
        : new Decimal(totalBalance.ocean)
    const newDtReserve =
      coin === 'OCEAN'
        ? new Decimal(totalBalance.datatoken)
        : new Decimal(totalBalance.datatoken).plus(values.amount)
    const poolOcean = newOceanReserve.mul(ratio).toString()
    const poolDatatoken = newDtReserve.mul(ratio).toString()
    setPoolOcean(poolOcean)
    setPoolDatatoken(poolDatatoken)
  }, [
    values.amount,
    coin,
    totalBalance,
    totalPoolTokens,
    newPoolShare,
    newPoolTokens
  ])

  return (
    <>
      <FormHelp className={styles.help}>
        {help.replace('SWAPFEE', swapFee)}
      </FormHelp>
      <div className={styles.output}>
        <div>
          <p>{titleIn}</p>
          <Token symbol="pool shares" balance={newPoolTokens} />
          <Token symbol="% of pool" balance={newPoolShare} />
        </div>
        <div>
          <p>{titleOut}</p>
          <Token symbol="OCEAN" balance={poolOcean} />
          <Token symbol={dtSymbol} balance={poolDatatoken} />
        </div>
      </div>
    </>
  )
}
