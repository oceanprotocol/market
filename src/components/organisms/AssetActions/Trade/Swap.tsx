import React, { ReactElement, useEffect, useState } from 'react'
import { BestPrice, DDO } from '@oceanprotocol/lib'
import styles from './Swap.module.css'
import TradeInput from './TradeInput'
import Button from '../../../atoms/Button'
import { ReactComponent as Arrow } from '../../../../images/arrow.svg'
import { FormikContextType, useFormikContext } from 'formik'
import { PoolBalance } from '../../../../@types/TokenBalance'
import Output from './Output'
import Slippage from './Slippage'
import { getSpotPrice } from '../../../../utils/subgraph'
import { FormTradeData, TradeItem } from '../../../../models/FormTrade'
import { useOcean } from '../../../../providers/Ocean'
import { usePrices } from '../../../../providers/Prices'
import Decimal from 'decimal.js'

interface FiatPrices {
  oceanFiatValue: number
  datatokenFiatValue: number
}

function calculatePriceImpact(inputValue: number, outputValue: number) {
  console.log(inputValue, outputValue)
  const difference = new Decimal(outputValue - inputValue)
  // const avg = (outputValue + inputValue) / 2
  const ration = difference.div(inputValue)
  const percent = ration.abs().mul(100).toFixed(2).toString()
  return percent.toString()
}

async function getFiatValues(
  oceanTokenAmount: number,
  dataTokenAmount: number,
  ddo: DDO,
  fiatPrice: number
) {
  const fiatPrices: FiatPrices = {
    oceanFiatValue: 0,
    datatokenFiatValue: 0
  }
  const spotPrice: number = await getSpotPrice(ddo)
  fiatPrices.datatokenFiatValue = fiatPrice * (spotPrice * dataTokenAmount)
  fiatPrices.oceanFiatValue = fiatPrice * oceanTokenAmount

  return fiatPrices
}

async function getPriceImpact(
  ddo: DDO,
  oceanTokenAmount: number,
  dataTokenAmount: number,
  sell: boolean,
  fiatPrice: number
) {
  const fiatPrices: FiatPrices = await getFiatValues(
    oceanTokenAmount,
    dataTokenAmount,
    ddo,
    fiatPrice
  )
  const priceImpact = await calculatePriceImpact(
    sell ? fiatPrices.datatokenFiatValue : fiatPrices.oceanFiatValue,
    sell ? fiatPrices.oceanFiatValue : fiatPrices.datatokenFiatValue
  )

  console.log(priceImpact)
  return priceImpact
}

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
  balance: PoolBalance
  price: BestPrice
  setMaximumDt: (value: number) => void
  setMaximumOcean: (value: number) => void
}): ReactElement {
  const { ocean } = useOcean()
  const { prices } = usePrices()
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
  const [priceImpact, setPriceImpact] = useState<string>('0')

  const {
    setFieldValue,
    values,
    setErrors,
    validateForm
  }: FormikContextType<FormTradeData> = useFormikContext()

  useEffect(() => {
    console.log(values)

    if (!values.ocean && !values.datatoken) return

    getPriceImpact(
      ddo,
      values.ocean,
      values.datatoken,
      values.type === 'sell',
      (prices as any).eur
    ).then((newPriceImpact) => {
      setPriceImpact(newPriceImpact)
    })
  }, [values.ocean, values.datatoken])

  useEffect(() => {
    if (!ddo || !balance || !values || !price) return

    async function calculateMaximum() {
      const dtAmount = values.type === 'buy' ? maxDt : balance.datatoken
      const oceanAmount = values.type === 'buy' ? balance.ocean : maxOcean

      const maxBuyOcean = await ocean.pool.getOceanReceived(
        price.address,
        dtAmount.toString()
      )
      const maxBuyDt = await ocean.pool.getDTReceived(
        price.address,
        oceanAmount.toString()
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
      setOceanItem({
        ...oceanItem,
        amount: oceanAmount,
        maxAmount: maximumOcean
      })
      setDtItem({
        ...dtItem,
        amount: dtAmount,
        maxAmount: maximumDt
      })
    }
    calculateMaximum()
  }, [ddo, maxOcean, maxDt, balance, price?.value, values.type])

  const switchTokens = () => {
    setFieldValue('type', values.type === 'buy' ? 'sell' : 'buy')
    // don't reset form because we don't want to reset type
    setFieldValue('datatoken', 0)
    setFieldValue('ocean', 0)
    setErrors({})
  }

  const handleValueChange = async (name: string, value: number) => {
    const newValue =
      name === 'ocean'
        ? values.type === 'sell'
          ? await ocean.pool.getDTNeeded(price.address, value.toString())
          : await ocean.pool.getDTReceived(price.address, value.toString())
        : values.type === 'sell'
        ? await ocean.pool.getOceanReceived(price.address, value.toString())
        : await ocean.pool.getOceanNeeded(price.address, value.toString())

    await setFieldValue(name === 'ocean' ? 'datatoken' : 'ocean', newValue)

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

      <Slippage priceImpact={priceImpact} />
    </div>
  )
}
