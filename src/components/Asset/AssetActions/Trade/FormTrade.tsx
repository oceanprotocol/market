import React, { ReactElement, useState } from 'react'
import { Asset, LoggerInstance } from '@oceanprotocol/lib'
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

export default function FormTrade({
  ddo,
  balance,
  maxDt,
  maxOcean,
  price
}: {
  ddo: Asset
  balance: PoolBalance
  maxDt: string
  maxOcean: string
  price: BestPrice
}): ReactElement {
  const { accountId } = useWeb3()
  const { isAssetNetwork } = useAsset()
  const { debug } = useUserPreferences()
  const [txId, setTxId] = useState<string>()
  const [coinFrom, setCoinFrom] = useState<string>('OCEAN')

  const [maximumOcean, setMaximumOcean] = useState(maxOcean)
  const [maximumDt, setMaximumDt] = useState(maxDt)
  const [isWarningAccepted, setIsWarningAccepted] = useState(false)

  const tokenAddress = ''
  const tokenSymbol = ''

  const validationSchema: Yup.SchemaOf<FormTradeData> = Yup.object()
    .shape({
      ocean: Yup.number()
        .max(
          Number(maximumOcean),
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
    try {
      const impact = new Decimal(
        new Decimal(100).sub(new Decimal(values.slippage))
      ).div(100)
      const precision = 15
      // const tx =
      //   values.type === 'buy'
      //     ? await ocean.pool.buyDTWithExactOcean(
      //         accountId,
      //         price.address,
      //         new Decimal(values.datatoken)
      //           .mul(impact)
      //           .toFixed(precision)
      //           .toString(),
      //         new Decimal(values.ocean).toFixed(precision).toString()
      //       )
      //     : await ocean.pool.sellDT(
      //         accountId,
      //         price.address,
      //         new Decimal(values.datatoken).toFixed(precision).toString(),
      //         new Decimal(values.ocean)
      //           .mul(impact)
      //           .toFixed(precision)
      //           .toString()
      //       )
      // setTxId(tx?.transactionHash)
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
      {({ isSubmitting, submitForm, values, isValid }) => (
        <>
          {isWarningAccepted ? (
            <Swap
              ddo={ddo}
              balance={balance}
              maxDt={maxDt}
              maxOcean={maxOcean}
              price={price}
              setCoin={setCoinFrom}
              setMaximumOcean={setMaximumOcean}
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
              values.ocean === undefined
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
                : values.ocean
                ? `${values.ocean}`
                : undefined
            }
            action={submitForm}
            txId={txId}
            tokenAddress={tokenAddress}
            tokenSymbol={tokenSymbol}
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
