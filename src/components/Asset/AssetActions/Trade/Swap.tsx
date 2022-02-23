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
import {
  calcMaxExactIn,
  calcMaxExactOut,
  LoggerInstance,
  Pool,
  PoolPriceAndFees
} from '@oceanprotocol/lib'
import { AssetExtended } from 'src/@types/AssetExtended'
import { usePool } from '@context/Pool'
import { useSiteMetadata } from '@hooks/useSiteMetadata'

Decimal.set({ toExpNeg: -15, precision: 15, rounding: 1 })

export default function Swap({
  asset,
  balance,
  setMaximumDt,
  setMaximumBaseToken,
  setCoin
}: {
  asset: AssetExtended
  balance: PoolBalance
  setMaximumDt: (value: string) => void
  setMaximumBaseToken: (value: string) => void
  setCoin: (value: string) => void
}): ReactElement {
  const { isAssetNetwork } = useAsset()
  const { web3 } = useWeb3()
  const { poolInfo, poolData } = usePool()
  const { appConfig } = useSiteMetadata()

  const [baseTokenItem, setBaseTokenItem] = useState<TradeItem>({
    amount: '0',
    token: poolInfo?.baseTokenSymbol,
    maxAmount: '0',
    address: poolInfo?.baseTokenAddress
  })
  const [dtItem, setDtItem] = useState<TradeItem>({
    amount: '0',
    token: poolInfo?.datatokenSymbol,
    maxAmount: '0',
    address: poolInfo?.datatokenAddress
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
      const maxDtFromPool =
        values.type === 'buy'
          ? calcMaxExactIn(poolData.datatokenLiquidity)
          : calcMaxExactOut(poolData.datatokenLiquidity)

      const maxBaseTokenFromPool =
        values.type === 'buy'
          ? calcMaxExactOut(poolData.baseTokenLiquidity)
          : calcMaxExactIn(poolData.baseTokenLiquidity)
      const amountDataToken =
        values.type === 'buy' ? maxDtFromPool : new Decimal(balance.datatoken)

      const amountBaseToken =
        values.type === 'buy'
          ? new Decimal(balance.baseToken).greaterThan(
              calcMaxExactIn(poolData.baseTokenLiquidity)
            )
            ? calcMaxExactIn(poolData.baseTokenLiquidity)
            : new Decimal(balance.baseToken)
          : maxBaseTokenFromPool

      try {
        setSwapFee(poolInfo.poolFee)

        const maxBuyBaseToken: PoolPriceAndFees =
          await poolInstance.getAmountOutExactIn(
            asset.accessDetails.addressOrId,
            poolInfo.datatokenAddress,
            poolInfo.baseTokenAddress,
            amountDataToken.toString(),
            appConfig.consumeMarketPoolSwapFee
          )

        const maxBuyDt: PoolPriceAndFees =
          await poolInstance.getAmountOutExactIn(
            asset.accessDetails?.addressOrId,
            poolInfo.baseTokenAddress,
            poolInfo.datatokenAddress,
            amountBaseToken.toString(),
            appConfig.consumeMarketPoolSwapFee
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
    poolData,
    balance,
    values.type,
    setMaximumDt,
    setMaximumBaseToken,
    asset,
    web3,
    dtItem.token,
    baseTokenItem.token,
    poolInfo.poolFee,
    poolInfo.datatokenAddress,
    poolInfo.baseTokenAddress,
    appConfig.consumeMarketPoolSwapFee
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
          dtItem.address,
          baseTokenItem.address,
          value.toString(),
          swapFee
        )

        setFieldValue('output', 'exactOut')

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

        setFieldValue('output', 'exactIn')
        setTotalValue(value.toString())
        setTokenAmount(newValue.tokenAmount)
        tokenIn = poolInfo.baseTokenAddress
        tokenOut = poolInfo.datatokenAddress
      }
    } else {
      if (values.type === 'sell') {
        newValue = await poolInstance.getAmountOutExactIn(
          asset.accessDetails.addressOrId,
          dtItem.address,
          baseTokenItem.address,
          value.toString(),
          swapFee
        )

        setFieldValue('output', 'exactIn')
        setTotalValue(value.toString())
        setTokenAmount(newValue.tokenAmount)
        tokenIn = poolInfo.datatokenAddress
        tokenOut = poolInfo.baseTokenAddress
      } else {
        newValue = await poolInstance.getAmountInExactOut(
          asset.accessDetails.addressOrId,
          baseTokenItem.address,
          dtItem.address,
          value.toString(),
          swapFee
        )

        setFieldValue('output', 'exactOut')

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
