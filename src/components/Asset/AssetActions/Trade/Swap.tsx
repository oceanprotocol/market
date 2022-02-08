import React, { ReactElement, useEffect, useState } from 'react'
import styles from './Swap.module.css'
import TradeInput from './TradeInput'
import Button from '@shared/atoms/Button'
import Arrow from '@images/arrow.svg'
import { FormikContextType, useFormikContext } from 'formik'
import Output from './Output'
import Slippage from './Slippage'
import PriceImpact from './PriceImpact'
import Decimal from 'decimal.js'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import { FormTradeData, TradeItem } from './_types'
import { LoggerInstance, Pool } from '@oceanprotocol/lib'
import { AssetExtended } from 'src/@types/AssetExtended'
import { usePool } from '@context/Pool'

Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })

export default function Swap({
  assetExtended,
  maxDt,
  maxBaseToken,
  balance,
  setMaximumDt,
  setMaximumBaseToken,
  setCoin
}: {
  assetExtended: AssetExtended
  maxDt: string
  maxBaseToken: string
  balance: PoolBalance
  setMaximumDt: (value: string) => void
  setMaximumBaseToken: (value: string) => void
  setCoin: (value: string) => void
}): ReactElement {
  const { isAssetNetwork } = useAsset()
  const { web3 } = useWeb3()
  const { poolInfo } = usePool()

  const [baseTokenItem, setBaseTokenItem] = useState<TradeItem>({
    amount: '0',
    token: assetExtended.accessDetails.baseToken?.symbol,
    maxAmount: '0'
  })
  const [dtItem, setDtItem] = useState<TradeItem>({
    amount: '0',
    token: assetExtended.accessDetails.datatoken.symbol,
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
  const [swapFee, setSwapFee] = useState<string>()

  useEffect(() => {
    if (!assetExtended || !balance || !values?.type) return
    const poolInstance = new Pool(web3)

    async function calculateMaximum() {
      const amountDataToken =
        values.type === 'buy'
          ? new Decimal(maxDt)
          : new Decimal(balance.datatoken)

      const amountBaseToken =
        values.type === 'buy'
          ? new Decimal(balance.baseToken)
          : new Decimal(maxBaseToken)

      try {
        const swapFee = await poolInstance.getSwapFee(
          assetExtended.accessDetails?.addressOrId
        )
        setSwapFee(swapFee)

        const maxBuyBaseToken = await poolInstance.getAmountOutExactIn(
          assetExtended.accessDetails.addressOrId,
          poolInfo.datatokenAddress,
          poolInfo.baseTokenAddress,
          amountDataToken.toString(),
          swapFee
        )
        const maxBuyDt = await poolInstance.getAmountOutExactIn(
          assetExtended.accessDetails?.addressOrId,
          poolInfo.baseTokenAddress,
          poolInfo.datatokenAddress,
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
            : amountBaseToken.greaterThan(new Decimal(balance.baseToken))
            ? balance.baseToken
            : amountBaseToken

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
    maxDt,
    maxBaseToken,
    balance,
    values.type,
    setMaximumDt,
    setMaximumBaseToken,
    assetExtended,
    web3,
    dtItem.token,
    baseTokenItem.token
  ])

  const switchTokens = () => {
    setFieldValue('type', values.type === 'buy' ? 'sell' : 'buy')
    setCoin(
      values.type === 'sell' ? 'OCEAN' : assetExtended.datatokens[0].symbol
    )
    // don't reset form because we don't want to reset type
    setFieldValue('datatoken', 0)
    setFieldValue('ocean', 0)
    setErrors({})
  }

  const handleValueChange = async (name: string, value: number) => {
    let tokenIn = ''
    let tokenOut = ''
    const poolInstance = new Pool(web3)
    let newValue

    if (name === 'ocean') {
      if (values.type === 'sell') {
        newValue = await poolInstance.calcPoolOutGivenSingleIn(
          assetExtended.accessDetails.addressOrId,
          dtItem.token,
          value.toString()
        )

        setTotalValue(newValue)
        setTokenAmount(value.toString())

        tokenIn = assetExtended.services[0].datatokenAddress
        tokenOut = poolInfo.baseTokenAddress
      } else {
        newValue = await poolInstance.calcSingleInGivenPoolOut(
          assetExtended.accessDetails.addressOrId,
          baseTokenItem.token,
          value.toString()
        )

        setTotalValue(value.toString())
        setTokenAmount(newValue)
        tokenIn = poolInfo.baseTokenAddress
        tokenOut = assetExtended.services[0].datatokenAddress
      }
    } else {
      if (values.type === 'sell') {
        newValue = await poolInstance.calcSingleInGivenPoolOut(
          assetExtended.accessDetails.addressOrId,
          baseTokenItem.token,
          value.toString()
        )

        setTotalValue(value.toString())
        setTokenAmount(newValue)
        tokenIn = assetExtended.services[0].datatokenAddress
        tokenOut = poolInfo.baseTokenAddress
      } else {
        newValue = await poolInstance.calcPoolOutGivenSingleIn(
          assetExtended.accessDetails.addressOrId,
          dtItem.token,
          value.toString()
        )

        setTotalValue(newValue)
        setTokenAmount(value.toString())
        tokenIn = poolInfo.baseTokenAddress
        tokenOut = assetExtended.services[0].datatokenAddress
      }
    }

    await setFieldValue(name === 'ocean' ? 'datatoken' : 'ocean', newValue)
    const spotPrice = await poolInstance.getSpotPrice(
      assetExtended.accessDetails.addressOrId,
      tokenIn,
      tokenOut,
      swapFee
    )

    setSpotPrice(spotPrice)
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
        poolAddress={assetExtended.accessDetails?.addressOrId}
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
