import React, { ReactElement, useEffect, useState } from 'react'
import { useMetadata, usePricing } from '@oceanprotocol/react'
import { DDO } from '@oceanprotocol/lib'
import styles from './Swap.module.css'
import TradeInput from './TradeInput'
import Button from '../../../atoms/Button'
import { ReactComponent as Arrow } from '../../../../images/arrow.svg'
import { TradeLiquidity, TradeItem } from '.'
import { FormikContextType, useFormikContext } from 'formik'
import DtBalance from '../../../../models/DtBalance'

export default function Swap({
  ddo,
  maxDt,
  maxOcean,
  balance,
  setMaximumDt,
  setMaximumOcean
}: {
  ddo: DDO
  maxDt: number
  maxOcean: number
  balance: DtBalance
  setMaximumDt: (value: number) => void
  setMaximumOcean: (value: number) => void
}): ReactElement {
  const [oceanItem, setOceanItem] = useState<TradeItem>()
  const [dtItem, setDtItem] = useState<TradeItem>()
  const { dtSymbol } = usePricing(ddo)
  const { price } = useMetadata(ddo)

  const {
    setFieldValue,
    values,
    validateForm
  }: FormikContextType<TradeLiquidity> = useFormikContext()

  useEffect(() => {
    if (!ddo || !balance || !values) return
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
      amount: balance.ocean,
      token: 'OCEAN',
      maxAmount: maximumOcean
    })
    setDtItem({
      amount: balance.datatoken,
      token: dtSymbol,
      maxAmount: maximumDt
    })
  }, [ddo, dtSymbol, maxOcean, maxDt, balance, values.type])

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
      <div className={styles.tradeInput}>
        <TradeInput
          name={values.type === 'sell' ? 'datatoken' : 'ocean'}
          item={values.type === 'sell' ? dtItem : oceanItem}
          handleValueChange={handleValueChange}
        />
      </div>
      <Button className={styles.swapButton} style="text" onClick={swapTokens}>
        <Arrow />
      </Button>
      <div className={styles.tradeInput}>
        <TradeInput
          name={values.type === 'sell' ? 'ocean' : 'datatoken'}
          item={values.type === 'sell' ? oceanItem : dtItem}
          handleValueChange={handleValueChange}
        />
      </div>
    </>
  )
}
