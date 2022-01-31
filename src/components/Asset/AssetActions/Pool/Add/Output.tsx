import { FormikContextType, useFormikContext } from 'formik'
import React, { ReactElement, useEffect, useState } from 'react'
import { FormAddLiquidity } from '.'
import FormHelp from '@shared/FormInput/Help'
import Token from '../Token'
import styles from './Output.module.css'
import Decimal from 'decimal.js'
import content from '../../../../../../content/price.json'

export default function Output({
  newPoolTokens,
  newPoolShare,
  swapFee,
  datatokenSymbol,
  totalPoolTokens,
  totalBalance
}: {
  newPoolTokens: string
  newPoolShare: string
  swapFee: string
  datatokenSymbol: string
  totalPoolTokens: string
  totalBalance: PoolBalance
}): ReactElement {
  const { help, titleIn, titleOut } = content.pool.add.output

  // Connect with form
  const { values }: FormikContextType<FormAddLiquidity> = useFormikContext()

  const [poolOcean, setPoolOcean] = useState('0')
  const [poolDatatoken, setPoolDatatoken] = useState('0')

  useEffect(() => {
    if (!values.amount || !totalBalance || !totalPoolTokens || !newPoolTokens)
      return
    const newPoolSupply = new Decimal(totalPoolTokens).plus(newPoolTokens)
    const ratio = new Decimal(newPoolTokens).div(newPoolSupply)
    const newOceanReserve = new Decimal(totalBalance.ocean).plus(values.amount)
    const newDtReserve = new Decimal(totalBalance.datatoken)
    const poolOcean = newOceanReserve.mul(ratio).toString()
    const poolDatatoken = newDtReserve.mul(ratio).toString()
    setPoolOcean(poolOcean)
    setPoolDatatoken(poolDatatoken)
  }, [
    values.amount,
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
          <Token symbol={datatokenSymbol} balance={poolDatatoken} />
        </div>
      </div>
    </>
  )
}
