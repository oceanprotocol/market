import React, { ReactElement, useEffect, useState } from 'react'
import { BestPrice, DDO } from '@oceanprotocol/lib'
import Button from '../../../atoms/Button'
import { ReactComponent as Arrow } from '../../../../images/arrow.svg'
import { FormikContextType, useFormikContext } from 'formik'
import { PoolBalance } from '../../../../@types/TokenBalance'
import { FormTradeData, TradeItem } from '../../../../models/FormTrade'
import { useOcean } from '../../../../providers/Ocean'
import TradeInput from './TradeInput'
import Output from './Output'
import Slippage from './Slippage'
import PriceImpact from './PriceImpact'
import styles from './Swap.module.css'

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
  maxDt: number
  maxOcean: number
  balance: PoolBalance
  price: BestPrice
  setMaximumDt: (value: number) => void
  setMaximumOcean: (value: number) => void
  setCoin: (value: string) => void
}): ReactElement {
  const { ocean } = useOcean()
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
      const dtAmount = values.type === 'buy' ? maxDt : balance.datatoken
      const oceanAmount = values.type === 'buy' ? balance.ocean : maxOcean

      const maxBuyOcean = await ocean.pool.getOceanReceived(
        price.address,
        `${dtAmount}`
      )
      const maxBuyDt = await ocean.pool.getDTReceived(
        price.address,
        `${oceanAmount}`
      )

      const maximumDt =
        values.type === 'buy'
          ? Number(dtAmount) > Number(maxBuyDt)
            ? Number(maxBuyDt)
            : Number(dtAmount)
          : Number(dtAmount) > balance.datatoken
          ? balance.datatoken
          : Number(dtAmount)

      const maximumOcean =
        values.type === 'sell'
          ? Number(oceanAmount) > Number(maxBuyOcean)
            ? Number(maxBuyOcean)
            : Number(oceanAmount)
          : Number(oceanAmount) > balance.ocean
          ? balance.ocean
          : Number(oceanAmount)

      setMaximumDt(maximumDt)
      setMaximumOcean(maximumOcean)

      setOceanItem((prevState) => ({
        ...prevState,
        amount: oceanAmount,
        maxAmount: maximumOcean
      }))

      setDtItem((prevState) => ({
        ...prevState,
        amount: oceanAmount,
        maxAmount: maximumOcean
      }))
    }
    calculateMaximum()
  }, [ddo, maxOcean, maxDt, balance, price, values?.type, ocean])

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
        handleValueChange={handleValueChange}
      />

      <Button className={styles.swapButton} style="text" onClick={switchTokens}>
        <Arrow />
      </Button>

      <TradeInput
        name={values.type === 'sell' ? 'ocean' : 'datatoken'}
        item={values.type === 'sell' ? oceanItem : dtItem}
        handleValueChange={handleValueChange}
      />

      <Output dtSymbol={dtItem.token} poolAddress={price?.address} />

      <PriceImpact
        totalValue={totalValue}
        tokenAmount={tokenAmount}
        spotPrice={spotPrice}
      />
      <Slippage />
    </div>
  )
}
