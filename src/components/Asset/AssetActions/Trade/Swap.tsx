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
import { MAX_DECIMALS } from '@utils/constants'
import { useMarketMetadata } from '@context/MarketMetadata'

// Decimal.set({ toExpNeg: -15, precision: 5, rounding: Decimal.ROUND_DOWN })

export default function Swap({
  asset,
  balance,
  setMaximumDt,
  setMaximumBaseToken,
  setCoin,
  isLoading
}: {
  asset: AssetExtended
  balance: PoolBalance
  setMaximumDt: (value: string) => void
  setMaximumBaseToken: (value: string) => void
  setCoin: (value: string) => void
  isLoading: boolean
}): ReactElement {
  const { isAssetNetwork } = useAsset()
  const { web3 } = useWeb3()
  const { poolInfo, poolData } = usePool()
  const { appConfig } = useMarketMetadata()

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
    if (!asset || !balance || !values?.type || !web3 || !appConfig || !poolInfo)
      return
    const poolInstance = new Pool(web3)

    async function calculateMaximum() {
      const datatokenLiquidity = await poolInstance.getReserve(
        poolData.id,
        poolData.datatoken.address,
        poolData.datatoken.decimals
      )
      const baseTokenLiquidity = await poolInstance.getReserve(
        poolData.id,
        poolData.baseToken.address,
        poolData.baseToken.decimals
      )
      if (values.type === 'buy') {
        const maxBaseTokenFromPool = calcMaxExactIn(baseTokenLiquidity)

        const maxBaseTokens = maxBaseTokenFromPool.greaterThan(
          new Decimal(balance.baseToken)
        )
          ? balance.baseToken
          : maxBaseTokenFromPool.toDecimalPlaces(MAX_DECIMALS).toString()

        const maxDt = await poolInstance.getAmountOutExactIn(
          asset.accessDetails?.addressOrId,
          poolInfo.baseTokenAddress,
          poolInfo.datatokenAddress,
          maxBaseTokens.toString(),
          appConfig.consumeMarketPoolSwapFee,
          poolInfo.baseTokenDecimals,
          poolInfo.datatokenDecimals
        )
        const maximumDt = new Decimal(maxDt.tokenAmount)
          .toDecimalPlaces(MAX_DECIMALS)
          .toString()
        setMaximumDt(maximumDt)
        setMaximumBaseToken(maxBaseTokens)

        setBaseTokenItem((prevState) => ({
          ...prevState,
          amount: balance.baseToken,
          maxAmount: maxBaseTokens
        }))

        setDtItem((prevState) => ({
          ...prevState,
          amount: datatokenLiquidity,
          maxAmount: maximumDt
        }))
      } else {
        const maxDtFromPool = calcMaxExactIn(datatokenLiquidity)
        const maxDatatokens = maxDtFromPool.greaterThan(
          new Decimal(balance.datatoken)
        )
          ? balance.datatoken
          : maxDtFromPool.toDecimalPlaces(MAX_DECIMALS).toString()

        const maxBaseTokens = await poolInstance.getAmountOutExactIn(
          asset.accessDetails?.addressOrId,
          poolInfo?.datatokenAddress,
          poolInfo?.baseTokenAddress,
          maxDatatokens.toString(),
          appConfig.consumeMarketPoolSwapFee,
          poolInfo.datatokenDecimals,
          poolInfo.baseTokenDecimals
        )
        const maximumBasetokens = new Decimal(maxBaseTokens.tokenAmount)
          .toDecimalPlaces(MAX_DECIMALS)
          .toString()
        setMaximumDt(maxDatatokens)
        setMaximumBaseToken(maximumBasetokens)

        setDtItem((prevState) => ({
          ...prevState,
          amount: balance.datatoken,
          maxAmount: maxDatatokens
        }))
        setBaseTokenItem((prevState) => ({
          ...prevState,
          amount: baseTokenLiquidity,
          maxAmount: maximumBasetokens
        }))
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
    dtItem.amount,
    baseTokenItem.token,
    baseTokenItem.amount,
    appConfig,
    poolInfo
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
        disabled={!isAssetNetwork || isLoading}
        handleValueChange={handleValueChange}
      />

      <Button
        className={styles.swapButton}
        style="text"
        onClick={switchTokens}
        disabled={!isAssetNetwork || isLoading}
      >
        <Arrow />
      </Button>

      <TradeInput
        name={values.type === 'sell' ? 'baseToken' : 'datatoken'}
        item={values.type === 'sell' ? baseTokenItem : dtItem}
        disabled={!isAssetNetwork || isLoading}
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
      <Slippage disabled={!isAssetNetwork || isLoading} />
    </div>
  )
}
