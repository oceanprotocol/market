import React, { ReactElement, useState } from 'react'
import { useOcean } from '@oceanprotocol/react'
import { BestPrice, DDO, Logger } from '@oceanprotocol/lib'
import * as Yup from 'yup'
import { TradeLiquidity } from '.'
import { Formik } from 'formik'
import Actions from '../Pool/Actions'
import { graphql, useStaticQuery } from 'gatsby'
import { useUserPreferences } from '../../../../providers/UserPreferences'
import { toast } from 'react-toastify'
import Swap from './Swap'
import DtBalance from '../../../../models/DtBalance'

const initialValues: TradeLiquidity = {
  ocean: 0,
  datatoken: 0,
  type: 'buy'
}

const contentQuery = graphql`
  query TradeQuery {
    content: allFile(filter: { relativePath: { eq: "price.json" } }) {
      edges {
        node {
          childContentJson {
            trade {
              title
              action
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
  balance: DtBalance
  maxDt: number
  maxOcean: number
  price: BestPrice
}): ReactElement {
  const data = useStaticQuery(contentQuery)
  const content = data.content.edges[0].node.childContentJson.trade
  const { ocean, accountId } = useOcean()
  const { debug } = useUserPreferences()
  const [txId, setTxId] = useState<string>()

  const [maximumOcean, setMaximumOcean] = useState(maxOcean)
  const [maximumDt, setMaximumDt] = useState(maxDt)

  const validationSchema = Yup.object().shape<TradeLiquidity>({
    ocean: Yup.number()
      .max(maxOcean, `Must be less or equal than ${maximumOcean}`)
      .min(0.001, 'Must be more or equal to 0.01')
      .required('Required'),
    datatoken: Yup.number()
      .max(maxDt, `Must be less or equal than ${maximumDt}`)
      .min(0.00001, 'Must be more or equal to 0.01')
      .required('Required'),
    type: Yup.string()
  })

  async function handleTrade(values: TradeLiquidity) {
    try {
      const tx =
        values.type === 'buy'
          ? await ocean.pool.buyDT(
              accountId,
              price.address,
              values.datatoken.toString(),
              (values.ocean * 1.1).toString()
            )
          : await ocean.pool.sellDT(
              accountId,
              price.address,
              values.datatoken.toString(),
              (values.ocean * 0.9).toString()
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
      {({ isSubmitting, submitForm, values }) => (
        <>
          <Swap
            ddo={ddo}
            balance={balance}
            maxDt={maxDt}
            maxOcean={maxOcean}
            price={price}
            setMaximumOcean={setMaximumOcean}
            setMaximumDt={setMaximumDt}
          />
          <Actions
            isLoading={isSubmitting}
            loaderMessage="Swaping tokens..."
            successMessage="Successfully swaped tokens."
            actionName={content.action}
            action={submitForm}
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
