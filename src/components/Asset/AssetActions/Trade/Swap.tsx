import React, { ReactElement, useEffect, useState } from 'react'
import { DDO } from '@oceanprotocol/lib'
import styles from './Swap.module.css'
import TradeInput from './TradeInput'
import Button from '@shared/atoms/Button'
import Arrow from '@images/arrow.svg'
import { FormikContextType, useFormikContext } from 'formik'
import { useOcean } from '@context/Ocean'
import Output from './Output'
import Slippage from './Slippage'
import PriceImpact from './PriceImpact'

import Decimal from 'decimal.js'
import { useAsset } from '@context/Asset'
import { FormTradeData, TradeItem } from './_types'

Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })

export default function Swap({
  ddo,
  maxDt,
  maxOcean,
  balance,
  price,
  setMaximumDt,
  setMaximumOcean,
  setCoin
}: {
  ddo: DDO
  maxDt: string
  maxOcean: string
  balance: PoolBalance
  price: BestPrice
  setMaximumDt: (value: string) => void
  setMaximumOcean: (value: string) => void
  setCoin: (value: string) => void
}): ReactElement {
  const { ocean } = useOcean()
  const { isAssetNetwork } = useAsset()
  const [oceanItem, setOceanItem] = useState<TradeItem>({
    amount: '0',
    token: price.oceanSymbol,
    maxAmount: '0'
  })
  const [dtItem, setDtItem] = useState<TradeItem>({
    amount: '0',
    token: ddo.dataTokenInfo.symbol,
    maxAmount: '0'
  })

  const {
    setFieldValue,
    values,
    setErrors,
    validateForm
  }: FormikContextType<FormTradeData> = useFormikContext()

  // Values used for calculation of price impact
  const [spotPrice, setSpotPrice] = useState<string>()
  const [totalValue, setTotalValue] = useState<string>()
  const [tokenAmount, setTokenAmount] = useState<string>()

  useEffect(() => {
    if (!ddo || !balance || !values?.type || !price) return

    async function calculateMaximum() {
      const dtAmount =
        values.type === 'buy'
          ? new Decimal(maxDt)
          : new Decimal(balance.datatoken)
      const oceanAmount =
        values.type === 'buy'
          ? new Decimal(balance.ocean)
          : new Decimal(maxOcean)

      const maxBuyOcean = await ocean.pool.getOceanReceived(
        price.address,
        `${dtAmount.toString()}`
      )
      const maxBuyDt = await ocean.pool.getDTReceived(
        price.address,
        `${oceanAmount.toString()}`
      )

      const maximumDt =
        values.type === 'buy'
          ? dtAmount.greaterThan(new Decimal(maxBuyDt))
            ? maxBuyDt
            : dtAmount
          : dtAmount.greaterThan(new Decimal(balance.datatoken))
          ? balance.datatoken
          : dtAmount

      const maximumOcean =
        values.type === 'sell'
          ? oceanAmount.greaterThan(new Decimal(maxBuyOcean))
            ? maxBuyOcean
            : oceanAmount
          : oceanAmount.greaterThan(new Decimal(balance.ocean))
          ? balance.ocean
          : oceanAmount

      setMaximumDt(maximumDt.toString())
      setMaximumOcean(maximumOcean.toString())

      setOceanItem((prevState) => ({
        ...prevState,
        amount: oceanAmount.toString(),
        maxAmount: maximumOcean.toString()
      }))

      setDtItem((prevState) => ({
        ...prevState,
        amount: dtAmount.toString(),
        maxAmount: maximumDt.toString()
      }))
    }
    calculateMaximum()
  }, [
    ddo,
    maxOcean,
    maxDt,
    balance,
    price,
    values?.type,
    ocean,
    setMaximumDt,
    setMaximumOcean
  ])

  const switchTokens = () => {
    setFieldValue('type', values.type === 'buy' ? 'sell' : 'buy')
    setCoin(values.type === 'sell' ? 'OCEAN' : ddo.dataTokenInfo.symbol)
    // don't reset form because we don't want to reset type
    setFieldValue('datatoken', 0)
    setFieldValue('ocean', 0)
    setErrors({})
  }

  const handleValueChange = async (name: string, value: number) => {
    let tokenIn = ''
    let tokenOut = ''
    let newValue

    if (name === 'ocean') {
      if (values.type === 'sell') {
        newValue = await ocean.pool.getDTNeeded(price.address, value.toString())

        setTotalValue(newValue)
        setTokenAmount(value.toString())

        tokenIn = ddo.dataToken
        tokenOut = ocean.pool.oceanAddress
      } else {
        newValue = await ocean.pool.getDTReceived(
          price.address,
          value.toString()
        )

        setTotalValue(value.toString())
        setTokenAmount(newValue)
        tokenIn = ocean.pool.oceanAddress
        tokenOut = ddo.dataToken
      }
    } else {
      if (values.type === 'sell') {
        newValue = await ocean.pool.getOceanReceived(
          price.address,
          value.toString()
        )

        setTotalValue(value.toString())
        setTokenAmount(newValue)
        tokenIn = ddo.dataToken
        tokenOut = ocean.pool.oceanAddress
      } else {
        newValue = await ocean.pool.getOceanNeeded(
          price.address,
          value.toString()
        )

        setTotalValue(newValue)
        setTokenAmount(value.toString())
        tokenIn = ocean.pool.oceanAddress
        tokenOut = ddo.dataToken
      }
    }

    await setFieldValue(name === 'ocean' ? 'datatoken' : 'ocean', newValue)

    const spotPrice = await ocean.pool.getSpotPrice(
      price.address,
      tokenIn,
      tokenOut
    )

    setSpotPrice(spotPrice)
    validateForm()
  }

  return (
    <div className={styles.swap}>
      <TradeInput
        name={values.type === 'sell' ? 'datatoken' : 'ocean'}
        item={values.type === 'sell' ? dtItem : oceanItem}
        disabled={!isAssetNetwork}
        handleValueChange={handleValueChange}
      />

      <Button
        className={styles.swapButton}
        style="text"
        onClick={switchTokens}
        disabled={!isAssetNetwork}
      >
        <Arrow />
      </Button>

      <TradeInput
        name={values.type === 'sell' ? 'ocean' : 'datatoken'}
        item={values.type === 'sell' ? oceanItem : dtItem}
        disabled={!isAssetNetwork}
        handleValueChange={handleValueChange}
      />

      <Output
        dtSymbol={dtItem.token}
        oceanSymbol={oceanItem.token}
        poolAddress={price?.address}
      />

      <PriceImpact
        totalValue={totalValue}
        tokenAmount={tokenAmount}
        spotPrice={spotPrice}
      />
      <Slippage disabled={!isAssetNetwork} />
    </div>
  )
}
