import React, { ReactElement, useState } from 'react'
import { BestPrice, DDO, Logger } from '@oceanprotocol/lib'
import * as Yup from 'yup'
import { Formik } from 'formik'
import Actions from '../Pool/Actions'
import { graphql, useStaticQuery } from 'gatsby'
import { useUserPreferences } from '../../../../providers/UserPreferences'
import { toast } from 'react-toastify'
import Swap from './Swap'
import { PoolBalance } from '../../../../@types/TokenBalance'
import Alert from '../../../atoms/Alert'
import styles from './FormTrade.module.css'
import { FormTradeData, initialValues } from '../../../../models/FormTrade'
import Decimal from 'decimal.js'
import { useOcean } from '../../../../providers/Ocean'
import { useWeb3 } from '../../../../providers/Web3'
import { useAsset } from '../../../../providers/Asset'

const contentQuery = graphql`
  query TradeQuery {
    content: allFile(filter: { relativePath: { eq: "price.json" } }) {
      edges {
        node {
          childContentJson {
            trade {
              action
              warning
            }
          }
        }
      }
    }
  }
`

export default function FormTrade({
  ddo,
  balance,
  maxDt,
  maxOcean,
  price
}: {
  ddo: DDO
  balance: PoolBalance
  maxDt: number
  maxOcean: number
  price: BestPrice
}): ReactElement {
  const data = useStaticQuery(contentQuery)
  const content = data.content.edges[0].node.childContentJson.trade
  const { accountId } = useWeb3()
  const { ocean } = useOcean()
  const { isAssetNetwork } = useAsset()
  const { debug } = useUserPreferences()
  const [txId, setTxId] = useState<string>()
  const [coinFrom, setCoinFrom] = useState<string>('OCEAN')

  const [maximumOcean, setMaximumOcean] = useState(maxOcean)
  const [maximumDt, setMaximumDt] = useState(maxDt)
  const [isWarningAccepted, setIsWarningAccepted] = useState(false)

  const validationSchema: Yup.SchemaOf<FormTradeData> = Yup.object()
    .shape({
      ocean: Yup.number()
        .max(maximumOcean, (param) => `Must be more or equal to ${param.max}`)
        .min(0.001, (param) => `Must be more or equal to ${param.min}`)
        .required('Required')
        .nullable(),
      datatoken: Yup.number()
        .max(maximumDt, (param) => `Must be less or equal than ${param.max}`)
        .min(0.00001, (param) => `Must be more or equal to ${param.min}`)
        .required('Required')
        .nullable(),
      type: Yup.string(),
      slippage: Yup.string()
    })
    .defined()

  async function handleTrade(values: FormTradeData) {
    try {
      const impact = new Decimal(100 - Number(values.slippage)).div(100)
      const precision = 15
      const tx =
        values.type === 'buy'
          ? await ocean.pool.buyDTWithExactOcean(
              accountId,
              price.address,
              new Decimal(values.datatoken)
                .mul(impact)
                .toFixed(precision)
                .toString(),
              new Decimal(values.ocean).toFixed(precision).toString()
            )
          : await ocean.pool.sellDT(
              accountId,
              price.address,
              new Decimal(values.datatoken).toFixed(precision).toString(),
              new Decimal(values.ocean)
                .mul(impact)
                .toFixed(precision)
                .toString()
            )
      setTxId(tx?.transactionHash)
    } catch (error) {
      Logger.error(error.message)
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
                text={content.warning}
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
            actionName={content.action}
            amount={`${
              values.type === 'sell' ? values.datatoken : values.ocean
            }`}
            action={submitForm}
            coin={coinFrom}
            txId={txId}
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
