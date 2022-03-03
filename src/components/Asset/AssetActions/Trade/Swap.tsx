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
import { MAX_DECIMALS } from '@utils/constants'

// Decimal.set({ toExpNeg: -15, precision: 5, rounding: Decimal.ROUND_DOWN })

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
  const [lpSwapFee, setLpSwapFee] = useState<string>()

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
        values.type === 'buy'
          ? maxDtFromPool
          : new Decimal(balance.baseToken).greaterThan(
              calcMaxExactIn(poolData.datatokenLiquidity)
            )
          ? calcMaxExactIn(poolData.datatokenLiquidity)
          : new Decimal(balance.datatoken)

      const amountBaseToken =
        values.type === 'buy'
          ? new Decimal(balance.baseToken).greaterThan(
              calcMaxExactIn(poolData.baseTokenLiquidity)
            )
            ? calcMaxExactIn(poolData.baseTokenLiquidity)
            : new Decimal(balance.baseToken)
          : maxBaseTokenFromPool

      try {
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
              : amountDataToken.toDecimalPlaces(MAX_DECIMALS).toString()
            : amountDataToken.greaterThan(new Decimal(balance.datatoken))
            ? balance.datatoken
            : amountDataToken.toDecimalPlaces(MAX_DECIMALS).toString()

        const maximumBaseToken =
          values.type === 'sell'
            ? amountBaseToken.greaterThan(
                new Decimal(maxBuyBaseToken.tokenAmount)
              )
              ? maxBuyBaseToken.tokenAmount
              : amountBaseToken.toDecimalPlaces(MAX_DECIMALS).toString()
            : amountBaseToken.greaterThan(new Decimal(balance.baseToken))
            ? balance.baseToken
            : amountBaseToken.toDecimalPlaces(MAX_DECIMALS).toString()

        setMaximumDt(maximumDt)
        setMaximumBaseToken(maximumBaseToken)

        setBaseTokenItem((prevState) => ({
          ...prevState,
          amount: amountBaseToken.toDecimalPlaces(MAX_DECIMALS).toString(),
          maxAmount: maximumBaseToken
        }))

        setDtItem((prevState) => ({
          ...prevState,
          amount: amountDataToken.toDecimalPlaces(MAX_DECIMALS).toString(),
          maxAmount: maximumDt
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
    poolInfo.liquidityProviderSwapFee,
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
    try {
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
            appConfig.consumeMarketPoolSwapFee
          )

          setFieldValue('output', 'exactOut')

          setTotalValue(
            new Decimal(newValue.tokenAmount)
              .toDecimalPlaces(MAX_DECIMALS)
              .toString()
          )
          setLpSwapFee(
            new Decimal(newValue.liquidityProviderSwapFeeAmount)
              .toDecimalPlaces(MAX_DECIMALS)
              .toString()
          )
          setTokenAmount(value.toString())

          tokenIn = poolInfo.datatokenAddress
          tokenOut = poolInfo.baseTokenAddress
        } else {
          newValue = await poolInstance.getAmountOutExactIn(
            asset.accessDetails.addressOrId,
            baseTokenItem.address,
            dtItem.address,
            value.toString(),
            appConfig.consumeMarketPoolSwapFee
          )

          setFieldValue('output', 'exactIn')
          setTotalValue(value.toString())
          setTokenAmount(
            new Decimal(newValue.tokenAmount)
              .toDecimalPlaces(MAX_DECIMALS)
              .toString()
          )
          setLpSwapFee(
            new Decimal(newValue.liquidityProviderSwapFeeAmount)
              .toDecimalPlaces(MAX_DECIMALS)
              .toString()
          )
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
            appConfig.consumeMarketPoolSwapFee
          )

          setFieldValue('output', 'exactIn')
          setTotalValue(value.toString())
          setTokenAmount(
            new Decimal(newValue.tokenAmount)
              .toDecimalPlaces(MAX_DECIMALS)
              .toString()
          )
          setLpSwapFee(
            new Decimal(newValue.liquidityProviderSwapFeeAmount)
              .toDecimalPlaces(MAX_DECIMALS)
              .toString()
          )
          tokenIn = poolInfo.datatokenAddress
          tokenOut = poolInfo.baseTokenAddress
        } else {
          newValue = await poolInstance.getAmountInExactOut(
            asset.accessDetails.addressOrId,
            baseTokenItem.address,
            dtItem.address,
            value.toString(),
            appConfig.consumeMarketPoolSwapFee
          )

          setFieldValue('output', 'exactOut')

          setTotalValue(
            new Decimal(newValue.tokenAmount)
              .toDecimalPlaces(MAX_DECIMALS)
              .toString()
          )
          setTokenAmount(value.toString())
          setLpSwapFee(
            new Decimal(newValue.liquidityProviderSwapFeeAmount)
              .toDecimalPlaces(MAX_DECIMALS)
              .toString()
          )
          tokenIn = poolInfo.baseTokenAddress
          tokenOut = poolInfo.datatokenAddress
        }
      }

      await setFieldValue(
        name === 'baseToken' ? 'datatoken' : 'baseToken',
        new Decimal(newValue.tokenAmount)
          .toDecimalPlaces(MAX_DECIMALS)
          .toString()
      )

      const spotPrice = await poolInstance.getSpotPrice(
        asset.accessDetails.addressOrId,
        tokenIn,
        tokenOut,
        appConfig.consumeMarketPoolSwapFee
      )
      setSpotPrice(spotPrice)
      validateForm()
    } catch (ex) {
      LoggerInstance.error(ex)
    }
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

      <Output
        poolAddress={asset.accessDetails?.addressOrId}
        lpSwapFee={lpSwapFee}
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
