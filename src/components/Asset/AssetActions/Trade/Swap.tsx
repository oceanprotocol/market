import React, { ReactElement, useEffect, useState } from 'react'
import styles from './Swap.module.css'
import TradeInput from './TradeInput'
import Button from '@shared/atoms/Button'
import Arrow from '@images/arrow.svg'
import { FormikContextType, swap, useFormikContext } from 'formik'
import Output from './Output'
import Slippage from './Slippage'
import PriceImpact from './PriceImpact'
import Decimal from 'decimal.js'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import { FormTradeData, TradeItem } from './_types'
import { Asset, Pool, LoggerInstance } from '@oceanprotocol/lib'
import { DecimationAlgorithm } from 'chart.js'

Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })

export default function Swap({
  ddo,
  maxDt,
  maxBaseToken,
  balance,
  price,
  setMaximumDt,
  setMaximumBaseToken,
  setCoin
}: {
  ddo: Asset
  maxDt: string
  maxBaseToken: string
  balance: PoolBalance
  price: BestPrice
  setMaximumDt: (value: string) => void
  setMaximumBaseToken: (value: string) => void
  setCoin: (value: string) => void
}): ReactElement {
  const { isAssetNetwork } = useAsset()
  const { web3 } = useWeb3()

  const [baseTokenItem, setBaseTokenItem] = useState<TradeItem>({
    amount: '0',
    token: price.oceanSymbol,
    maxAmount: '0'
  })
  const [dtItem, setDtItem] = useState<TradeItem>({
    amount: '0',
    token: ddo.datatokens[0].symbol,
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
    if (!web3 || !ddo || !balance || !values?.type || !price) return

    async function calculateMaximum() {
      try {
        const poolInstance = new Pool(web3, LoggerInstance)
        console.log('VALUES: ', values.type)

        const amountDataToken =
          values.type === 'buy'
            ? new Decimal(maxDt)
            : new Decimal(balance.datatoken)
        console.log('Amount DataToken: ', amountDataToken.toString())

        const amountBaseToken =
          values.type === 'buy'
            ? new Decimal(balance.ocean)
            : new Decimal(maxBaseToken)
        console.log('Amount BASEToken: ', amountBaseToken.toString())

        const swapFee = await poolInstance.getSwapFee(price.address)

        console.log(
          'FCT ITEMS: ',
          price.address,
          dtItem.token,
          baseTokenItem.token,
          amountDataToken.toString(),
          swapFee
        )

        const maxBuyBaseToken = await poolInstance.getAmountInExactOut(
          price.address,
          dtItem.token,
          baseTokenItem.token,
          amountDataToken.toString(),
          swapFee
        )
        console.log('MAX BUY BASE TOKEN: ', maxBuyBaseToken)

        const maxBuyDt = await poolInstance.getAmountInExactOut(
          price.address,
          baseTokenItem.token,
          dtItem.token,
          amountBaseToken.toString(),
          swapFee
        )

        const maximumDt =
          values.type === 'buy'
            ? amountDataToken.greaterThan(new Decimal(maxBuyDt))
              ? maxBuyDt
              : amountDataToken
            : amountDataToken.greaterThan(new Decimal(balance.datatoken))
            ? balance.datatoken
            : amountDataToken

        const maximumBaseToken =
          values.type === 'sell'
            ? amountBaseToken.greaterThan(new Decimal(maxBuyBaseToken))
              ? maxBuyBaseToken
              : amountBaseToken
            : amountBaseToken.greaterThan(new Decimal(balance.ocean))
            ? balance.ocean
            : amountBaseToken

        console.log('MAXIMUM DT: ', maximumDt)
        console.log('MAXIMUM BT: ', maximumBaseToken)
        setMaximumDt(maximumDt.toString())
        setMaximumBaseToken(maximumBaseToken.toString())

        setBaseTokenItem((prevState) => ({
          ...prevState,
          amount: amountBaseToken.toString(),
          maxAmount: maximumBaseToken.toString()
        }))

        setDtItem((prevState) => ({
          ...prevState,
          amount: amountDataToken.toString(),
          maxAmount: maximumDt.toString()
        }))
      } catch (error) {
        LoggerInstance.error(error.message)
      }
    }
    calculateMaximum()
  }, [
    web3,
    ddo,
    maxDt,
    maxBaseToken,
    balance,
    price,
    values.type,
    setMaximumDt,
    setMaximumBaseToken
  ])

  const switchTokens = () => {
    setFieldValue('type', values.type === 'buy' ? 'sell' : 'buy')
    setCoin(values.type === 'sell' ? 'OCEAN' : ddo.datatokens[0].symbol)
    // don't reset form because we don't want to reset type
    setFieldValue('datatoken', 0)
    setFieldValue('ocean', 0)
    setErrors({})
  }

  const handleValueChange = async (name: string, value: number) => {
    const tokenIn = ''
    const tokenOut = ''
    let newValue

    // if (name === 'ocean') {
    //   if (values.type === 'sell') {
    //     newValue = await ocean.pool.getDTNeeded(price.address, value.toString())

    //     setTotalValue(newValue)
    //     setTokenAmount(value.toString())

    //     tokenIn = ddo.services[0].datatokenAddress
    //     tokenOut = ocean.pool.oceanAddress
    //   } else {
    //     newValue = await ocean.pool.getDTReceived(
    //       price.address,
    //       value.toString()
    //     )

    //     setTotalValue(value.toString())
    //     setTokenAmount(newValue)
    //     tokenIn = ocean.pool.oceanAddress
    //     tokenOut = ddo.services[0].datatokenAddress
    //   }
    // } else {
    //   if (values.type === 'sell') {
    //     newValue = await ocean.pool.getOceanReceived(
    //       price.address,
    //       value.toString()
    //     )

    //     setTotalValue(value.toString())
    //     setTokenAmount(newValue)
    //     tokenIn = ddo.services[0].datatokenAddress
    //     tokenOut = ocean.pool.oceanAddress
    //   } else {
    //     newValue = await ocean.pool.getOceanNeeded(
    //       price.address,
    //       value.toString()
    //     )

    //     setTotalValue(newValue)
    //     setTokenAmount(value.toString())
    //     tokenIn = ocean.pool.oceanAddress
    //     tokenOut = ddo.services[0].datatokenAddress
    //   }
    // }

    await setFieldValue(name === 'ocean' ? 'datatoken' : 'ocean', newValue)

    // const spotPrice = await ocean.pool.getSpotPrice(
    //   price.address,
    //   tokenIn,
    //   tokenOut
    // )

    // setSpotPrice(spotPrice)
    validateForm()
  }

  return (
    <div className={styles.swap}>
      <TradeInput
        name={values.type === 'sell' ? 'datatoken' : 'ocean'}
        item={values.type === 'sell' ? dtItem : baseTokenItem}
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
        item={values.type === 'sell' ? baseTokenItem : dtItem}
        disabled={!isAssetNetwork}
        handleValueChange={handleValueChange}
      />

      <Output
        dtSymbol={dtItem.token}
        baseTokenSymbol={baseTokenItem.token}
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
