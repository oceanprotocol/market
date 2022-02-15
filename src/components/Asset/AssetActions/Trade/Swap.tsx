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
import { LoggerInstance, Pool, PoolPriceAndFees } from '@oceanprotocol/lib'
import { AssetExtended } from 'src/@types/AssetExtended'
import { usePool } from '@context/Pool'

Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })

export default function Swap({
  asset,
  maxDt,
  maxBaseToken,
  balance,
  setMaximumDt,
  setMaximumBaseToken,
  setCoin
}: {
  asset: AssetExtended
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
    token: asset.accessDetails.baseToken?.symbol,
    maxAmount: '0',
    address: asset.accessDetails.baseToken.address
  })
  const [dtItem, setDtItem] = useState<TradeItem>({
    amount: '0',
    token: asset.accessDetails.datatoken.symbol,
    maxAmount: '0',
    address: asset.accessDetails.datatoken.address
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
    if (!asset || !balance || !values?.type || !web3) return
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
        setSwapFee(poolInfo.poolFee)

        const maxBuyBaseToken: PoolPriceAndFees =
          await poolInstance.getAmountOutExactIn(
            asset.accessDetails.addressOrId,
            poolInfo.datatokenAddress,
            poolInfo.baseTokenAddress,
            amountDataToken.toString(),
            poolInfo.poolFee
          )
        const maxBuyDt: PoolPriceAndFees =
          await poolInstance.getAmountOutExactIn(
            asset.accessDetails?.addressOrId,
            poolInfo.baseTokenAddress,
            poolInfo.datatokenAddress,
            amountBaseToken.toString(),
            poolInfo.poolFee
          )

        const maximumDt =
          values.type === 'buy'
            ? amountDataToken.greaterThan(new Decimal(maxBuyDt.tokenAmount))
              ? maxBuyDt.tokenAmount
              : amountDataToken
            : amountDataToken.greaterThan(new Decimal(balance.datatoken))
            ? balance.datatoken
            : amountDataToken

        const maximumBaseToken =
          values.type === 'sell'
            ? amountBaseToken.greaterThan(
                new Decimal(maxBuyBaseToken.tokenAmount)
              )
              ? maxBuyBaseToken.tokenAmount
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
    asset,
    web3,
    dtItem.token,
    baseTokenItem.token
  ])

  const switchTokens = () => {
    setFieldValue('type', values.type === 'buy' ? 'sell' : 'buy')
    setCoin(
      values.type === 'sell'
        ? poolInfo.baseTokenSymbol
        : poolInfo.datatokenSymbol
    )
    // don't reset form because we don't want to reset type
    setFieldValue('datatoken', 0)
    setFieldValue('baseToken', 0)
    setErrors({})
  }

  const handleValueChange = async (name: string, value: number) => {
    let tokenIn = ''
    let tokenOut = ''
    const poolInstance = new Pool(web3)
    let newValue: PoolPriceAndFees

    if (name === 'baseToken') {
      if (values.type === 'sell') {
        newValue = await poolInstance.getAmountInExactOut(
          asset.accessDetails.addressOrId,
          baseTokenItem.address,
          dtItem.address,
          value.toString(),
          swapFee
        )

        setTotalValue(newValue.tokenAmount)
        setTokenAmount(value.toString())
        tokenIn = poolInfo.datatokenAddress
        tokenOut = poolInfo.baseTokenAddress
      } else {
        newValue = await poolInstance.getAmountOutExactIn(
          asset.accessDetails.addressOrId,
          baseTokenItem.address,
          dtItem.address,
          value.toString(),
          swapFee
        )

        setTotalValue(value.toString())
        setTokenAmount(newValue.tokenAmount.toString())
        tokenIn = poolInfo.baseTokenAddress
        tokenOut = poolInfo.datatokenAddress
      }
    } else {
      if (values.type === 'sell') {
        newValue = await poolInstance.getAmountInExactOut(
          asset.accessDetails.addressOrId,
          dtItem.address,
          baseTokenItem.address,
          value.toString(),
          swapFee
        )

        setTotalValue(value.toString())
        setTokenAmount(newValue.tokenAmount)
        tokenIn = poolInfo.datatokenAddress
        tokenOut = poolInfo.baseTokenAddress
      } else {
        newValue = await poolInstance.getAmountOutExactIn(
          asset.accessDetails.addressOrId,
          dtItem.address,
          baseTokenItem.address,
          value.toString(),
          swapFee
        )

        setTotalValue(newValue.tokenAmount)
        setTokenAmount(value.toString())
        tokenIn = poolInfo.baseTokenAddress
        tokenOut = poolInfo.datatokenAddress
      }
    }

    await setFieldValue(
      name === 'baseToken' ? 'datatoken' : 'baseToken',
      newValue.tokenAmount
    )
    const spotPrice = await poolInstance.getSpotPrice(
      asset.accessDetails.addressOrId,
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
        name={values.type === 'sell' ? 'datatoken' : 'baseToken'}
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
        name={values.type === 'sell' ? 'baseToken' : 'datatoken'}
        item={values.type === 'sell' ? baseTokenItem : dtItem}
        disabled={!isAssetNetwork}
        handleValueChange={handleValueChange}
      />

      <Output poolAddress={asset.accessDetails?.addressOrId} />

      <PriceImpact
        totalValue={totalValue}
        tokenAmount={tokenAmount}
        spotPrice={spotPrice}
      />
      <Slippage disabled={!isAssetNetwork} />
    </div>
  )
}
