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
import { useSiteMetadata } from '@hooks/useSiteMetadata'

export default function FormTrade({
  asset,
  balance,
  maxDt,
  maxBaseToken
}: {
  asset: AssetExtended
  balance: PoolBalance
  maxDt: string
  maxBaseToken: string
}): ReactElement {
  const { web3, accountId } = useWeb3()
  const { isAssetNetwork } = useAsset()
  const { debug } = useUserPreferences()
  const { appConfig } = useSiteMetadata()
  const { poolInfo } = usePool()
  const [txId, setTxId] = useState<string>()
  const [coinFrom, setCoinFrom] = useState<string>('OCEAN')

  const [maximumBaseToken, setMaximumBaseToken] = useState(maxBaseToken)
  const [maximumDt, setMaximumDt] = useState(maxDt)
  const [isWarningAccepted, setIsWarningAccepted] = useState(false)

  console.log('MARKET SWAP FEE: ', appConfig)

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
    if (!web3 || !asset || !poolInfo || !values) return

    try {
      const poolInstance = new Pool(web3)

      const swapMarketFeeIn = await poolInstance.getMarketFees(
        asset.accessDetails.addressOrId,
        poolInfo.baseTokenAddress
      )

      const swapMarketFeeOut = await poolInstance.getMarketFees(
        asset.accessDetails.addressOrId,
        poolInfo.datatokenAddress
      )

      const tokenInOutMarket: TokenInOutMarket = {
        tokenIn: poolInfo.baseTokenAddress,
        tokenOut: poolInfo.datatokenAddress,
        marketFeeAddress: appConfig.consumeMarketPoolSwapFee
      }
      const tokenOutMarket: TokenInOutMarket = {
        tokenIn: poolInfo.datatokenAddress,
        tokenOut: poolInfo.baseTokenAddress,
        marketFeeAddress: appConfig.consumeMarketPoolSwapFee
      }

      const impact = new Decimal(
        new Decimal(100).sub(new Decimal(values.slippage))
      ).div(100)
      const precision = 15

      const amountsInOutMaxFee: AmountsInMaxFee = {
        tokenAmountIn: new Decimal(values.datatoken)
          .mul(impact)
          .toFixed(precision)
          .toString(),
        minAmountOut: '2',
        swapMarketFee: swapMarketFeeIn
      }

      const amountsOutMaxFee: AmountsOutMaxFee = {
        maxAmountIn: '50',
        tokenAmountOut: new Decimal(values.baseToken)
          .mul(impact)
          .toFixed(precision)
          .toString(),
        swapMarketFee: swapMarketFeeOut
      }

      const tx =
        values.type === 'buy'
          ? await poolInstance.swapExactAmountIn(
              accountId,
              asset.accessDetails.addressOrId,
              tokenInOutMarket,
              amountsInOutMaxFee
            )
          : await poolInstance.swapExactAmountOut(
              accountId,
              asset.accessDetails.addressOrId,
              tokenOutMarket,
              amountsOutMaxFee
            )
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
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        await handleTrade(values)
        resetForm()
        setSubmitting(false)
      }}
    >
      {({ isSubmitting, setSubmitting, submitForm, values, isValid }) => (
        <>
          {isWarningAccepted ? (
            <Swap
              assetExtended={asset}
              balance={balance}
              maxDt={maxDt}
              maxBaseToken={maxBaseToken}
              setCoin={setCoinFrom}
              setMaximumBaseToken={setMaximumBaseToken}
              setMaximumDt={setMaximumDt}
            />
          ) : (
            <div className={styles.alertWrap}>
              <Alert
                text={content.trade.warning}
                state="info"
                action={{
                  name: 'I understand',
                  style: 'text',
                  handleAction: () => setIsWarningAccepted(true)
                }}
              />
            </div>
          )}
          <Actions
            isDisabled={
              !isValid ||
              !isWarningAccepted ||
              !isAssetNetwork ||
              values.datatoken === undefined ||
              values.baseToken === undefined
            }
            isLoading={isSubmitting}
            loaderMessage="Swapping tokens..."
            successMessage="Successfully swapped tokens."
            actionName={content.trade.action}
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
