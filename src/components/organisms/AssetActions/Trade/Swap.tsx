import React, { ReactElement, useEffect, useState } from 'react'
import { usePricing } from '@oceanprotocol/react'
import { BestPrice, DDO } from '@oceanprotocol/lib'
import styles from './Swap.module.css'
import TradeInput from './TradeInput'
import Button from '../../../atoms/Button'
import { ReactComponent as Arrow } from '../../../../images/arrow.svg'
import { TradeLiquidity, TradeItem } from '.'
import { FormikContextType, useFormikContext } from 'formik'
import DtBalance from '../../../../models/DtBalance'
import Token from '../Pool/Token'

export default function Swap({
  ddo,
  maxDt,
  maxOcean,
  balance,
  price,
  setMaximumDt,
  setMaximumOcean
}: {
  ddo: DDO
  maxDt: number
  maxOcean: number
  balance: DtBalance
  price: BestPrice
  setMaximumDt: (value: number) => void
  setMaximumOcean: (value: number) => void
}): ReactElement {
  const [oceanItem, setOceanItem] = useState<TradeItem>({
    amount: 0,
    token: 'OCEAN',
    maxAmount: 0
  })
  const [dtItem, setDtItem] = useState<TradeItem>({
    amount: 0,
    token: ddo.dataTokenInfo.symbol,
    maxAmount: 0
  })

  const {
    setFieldValue,
    values,
    validateForm
  }: FormikContextType<TradeLiquidity> = useFormikContext()

  useEffect(() => {
    if (!ddo || !balance || !values || !price) return

    const maximumDt = values.type === 'sell' ? balance.datatoken : maxDt
    const maximumOcean =
      values.type === 'sell'
        ? balance.datatoken * price.value > maxOcean
          ? maxOcean
          : balance.datatoken * price.value
        : maxDt * price.value > balance.ocean
        ? balance.ocean
        : maxDt * price.value
    setMaximumDt(maximumDt)
    setMaximumOcean(maximumOcean)
    setOceanItem({
      ...oceanItem,
      amount: balance.ocean,
      maxAmount: maximumOcean
    })
    setDtItem({
      ...dtItem,
      amount: balance.datatoken,
      maxAmount: maximumDt
    })
  }, [ddo, maxOcean, maxDt, balance, price?.value, values.type])

  const swapTokens = () => {
    setFieldValue('type', values.type === 'buy' ? 'sell' : 'buy')
  }

  const handleValueChange = async (name: string, value: number) => {
    const newValue =
      name === 'ocean' ? value / price.value : value * price.value
    setFieldValue(name === 'ocean' ? 'datatoken' : 'ocean', newValue)
    validateForm()
  }

  return (
    <>
      <TradeInput
        name={values.type === 'sell' ? 'datatoken' : 'ocean'}
        item={values.type === 'sell' ? dtItem : oceanItem}
        handleValueChange={handleValueChange}
      />

      <Button className={styles.swapButton} style="text" onClick={swapTokens}>
        <Arrow />
      </Button>

      <TradeInput
        name={values.type === 'sell' ? 'ocean' : 'datatoken'}
        item={values.type === 'sell' ? oceanItem : dtItem}
        handleValueChange={handleValueChange}
      />

      <div className={styles.output}>
        <div>
          <p>Slippage</p>
          <Token symbol="%" balance="10" />
        </div>
        <div>
          <p>Minimum Received</p>
          <Token symbol="OCEAN" balance="100" />
        </div>
      </div>
    </>
  )
}
