import React, { ReactElement, useEffect, useState } from 'react'
import { useMetadata, usePricing } from '@oceanprotocol/react'
import { DDO } from '@oceanprotocol/lib'
import styles from './index.module.css'

import TradeInput from './TradeInput'
import Button from '../../../atoms/Button'
import { ReactComponent as Arrow } from '../../../../images/arrowDown.svg'
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

  const handleOceanChange = async (value: number) => {
    const dtValue = value / price.value
    setFieldValue('datatoken', dtValue)
    validateForm()
  }
  const handleDatatokenChange = async (value: number) => {
    const oceanValue = value * price.value
    setFieldValue('ocean', oceanValue)
    validateForm()
  }
  return (
    <>
      <div className={styles.tradeInput}>
        {values.type === 'sell' ? (
          <TradeInput
            name="datatoken"
            item={dtItem}
            handleValueChange={handleDatatokenChange}
          />
        ) : (
          <TradeInput
            name="ocean"
            item={oceanItem}
            handleValueChange={handleOceanChange}
          />
        )}
      </div>
      <div className={styles.swapButton}>
        <Button style="text" onClick={swapTokens}>
          <Arrow />
        </Button>
      </div>
      <div className={styles.tradeInput}>
        {values.type === 'sell' ? (
          <TradeInput
            name="ocean"
            item={oceanItem}
            handleValueChange={handleOceanChange}
          />
        ) : (
          <TradeInput
            name="datatoken"
            item={dtItem}
            handleValueChange={handleDatatokenChange}
          />
        )}
      </div>
    </>
  )
}
