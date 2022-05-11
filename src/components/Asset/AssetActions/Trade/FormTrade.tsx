import React, { ReactElement, useState } from 'react'
import {
  AmountsInMaxFee,
  AmountsOutMaxFee,
  LoggerInstance,
  Pool,
  TokenInOutMarket
} from '@oceanprotocol/lib'
import * as Yup from 'yup'
import { Formik } from 'formik'
import Actions from '../Pool/Actions'
import { useUserPreferences } from '@context/UserPreferences'
import { toast } from 'react-toastify'
import Swap from './Swap'
import Alert from '@shared/atoms/Alert'
import styles from './FormTrade.module.css'
import Decimal from 'decimal.js'
import { useWeb3 } from '@context/Web3'
import { useAsset } from '@context/Asset'
import { FormTradeData } from './_types'
import { initialValues } from './_constants'
import content from '../../../../../content/price.json'
import { AssetExtended } from 'src/@types/AssetExtended'
import { usePool } from '@context/Pool'
import { useMarketMetadata } from '@context/MarketMetadata'

export default function FormTrade({
  asset,
  balance
}: {
  asset: AssetExtended
  balance: PoolBalance
}): ReactElement {
  const { web3, accountId } = useWeb3()
  const { isAssetNetwork } = useAsset()
  const { debug } = useUserPreferences()
  const { appConfig } = useMarketMetadata()
  const { poolInfo, fetchAllData } = usePool()

  const [txId, setTxId] = useState<string>()
  const [coinFrom, setCoinFrom] = useState<string>('OCEAN')
  const [maximumBaseToken, setMaximumBaseToken] = useState('0')
  const [maximumDt, setMaximumDt] = useState('0')

  const validationSchema: Yup.SchemaOf<FormTradeData> = Yup.object()
    .shape({
      baseToken: Yup.number()
        .max(
          Number(maximumBaseToken),
          (param) => `Must be less or equal to ${param.max}`
        )
        .min(0.001, (param) => `Must be more or equal to ${param.min}`)
        .required('Required')
        .nullable(),
      datatoken: Yup.number()
        .max(
          Number(maximumDt),
          (param) => `Must be less or equal to ${param.max}`
        )
        .min(0.00001, (param) => `Must be more or equal to ${param.min}`)
        .required('Required')
        .nullable(),
      type: Yup.string(),
      slippage: Yup.string()
    })
    .defined()

  async function handleTrade(values: FormTradeData) {
    if (!web3 || !asset || !poolInfo || !values || !appConfig) return

    try {
      const poolInstance = new Pool(web3)
      let tx
      if (values.output === 'exactIn') {
        const tokenInOutMarket: TokenInOutMarket = {
          tokenIn:
            values.type === 'sell'
              ? poolInfo.datatokenAddress
              : poolInfo.baseTokenAddress,
          tokenOut:
            values.type === 'sell'
              ? poolInfo.baseTokenAddress
              : poolInfo.datatokenAddress,
          marketFeeAddress: appConfig.marketFeeAddress,
          tokenInDecimals:
            values.type === 'sell'
              ? poolInfo.datatokenDecimals
              : poolInfo.baseTokenDecimals,
          tokenOutDecimals:
            values.type === 'sell'
              ? poolInfo.baseTokenDecimals
              : poolInfo.datatokenDecimals
        }

        const amountsInOutMaxFee: AmountsInMaxFee = {
          tokenAmountIn:
            values.type === 'sell' ? values.datatoken : values.baseToken,
          minAmountOut: new Decimal(
            values.type === 'sell' ? values.baseToken : values.datatoken
          )
            .mul(
              new Decimal(1)
                .minus(new Decimal(values.slippage).div(new Decimal(100)))
                .toString()
            )
            .toString(),
          swapMarketFee: appConfig.consumeMarketPoolSwapFee
        }
        tx = await poolInstance.swapExactAmountIn(
          accountId,
          asset.accessDetails.addressOrId,
          tokenInOutMarket,
          amountsInOutMaxFee
        )

        if (!tx) {
          throw new Error('Failed to swap tokens!')
        }
      }
      if (values.output === 'exactOut') {
        const tokenOutMarket: TokenInOutMarket = {
          tokenIn:
            values.type === 'sell'
              ? poolInfo.datatokenAddress
              : poolInfo.baseTokenAddress,
          tokenOut:
            values.type === 'sell'
              ? poolInfo.baseTokenAddress
              : poolInfo.datatokenAddress,
          marketFeeAddress: appConfig.marketFeeAddress,
          tokenInDecimals:
            values.type === 'sell'
              ? poolInfo.datatokenDecimals
              : poolInfo.baseTokenDecimals,
          tokenOutDecimals:
            values.type === 'sell'
              ? poolInfo.baseTokenDecimals
              : poolInfo.datatokenDecimals
        }

        const amountsOutMaxFee: AmountsOutMaxFee = {
          maxAmountIn: new Decimal(
            values.type === 'sell' ? values.datatoken : values.baseToken
          )
            .mul(
              new Decimal(1)
                .plus(new Decimal(values.slippage).div(new Decimal(100)))
                .toString()
            )
            .toString(),
          tokenAmountOut:
            values.type === 'sell' ? values.baseToken : values.datatoken,
          swapMarketFee: appConfig.consumeMarketPoolSwapFee
        }
        tx = await poolInstance.swapExactAmountOut(
          accountId,
          asset.accessDetails.addressOrId,
          tokenOutMarket,
          amountsOutMaxFee
        )
        if (!tx) {
          throw new Error('Failed to swap tokens!')
        }
      }
      await fetchAllData()
      setTxId(tx?.transactionHash)
    } catch (error) {
      LoggerInstance.error(error.message)
      toast.error(error.message)
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setFieldValue, setSubmitting, resetForm }) => {
        await handleTrade(values)
        await setFieldValue('baseToken', '')
        await setFieldValue('datatoken', '')
        resetForm()
        setSubmitting(false)
      }}
    >
      {({ isSubmitting, setSubmitting, submitForm, values, isValid }) => (
        <>
          <Swap
            asset={asset}
            balance={balance}
            setCoin={setCoinFrom}
            setMaximumBaseToken={setMaximumBaseToken}
            setMaximumDt={setMaximumDt}
            isLoading={isSubmitting}
          />
          <Actions
            isDisabled={
              !isValid ||
              !isAssetNetwork ||
              values.datatoken === undefined ||
              values.baseToken === undefined
            }
            isLoading={isSubmitting}
            loaderMessage="Swapping tokens..."
            successMessage="Successfully swapped tokens."
            actionName={content.trade.action}
            slippage={values.slippage}
            amount={
              values.type === 'sell'
                ? values.datatoken
                  ? `${values.datatoken}`
                  : undefined
                : values.baseToken
                ? `${values.baseToken}`
                : undefined
            }
            action={submitForm}
            txId={txId}
            tokenAddress={
              values.type === 'buy'
                ? poolInfo.baseTokenAddress
                : poolInfo.datatokenAddress
            }
            tokenSymbol={
              values.type === 'buy'
                ? poolInfo.baseTokenSymbol
                : poolInfo.datatokenSymbol
            }
            setSubmitting={setSubmitting}
          />

          {debug && (
            <pre>
              <code>{JSON.stringify(values, null, 2)}</code>
            </pre>
          )}
        </>
      )}
    </Formik>
  )
}
