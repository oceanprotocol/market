import React, { ReactElement, useState, useEffect } from 'react'
import { useOcean } from '@oceanprotocol/react'
import Header from '../Header'
import { toast } from 'react-toastify'
import { Balance } from '..'
import Actions from '../Actions'
import { graphql, useStaticQuery } from 'gatsby'
import * as Yup from 'yup'
import { Formik } from 'formik'
import FormAdd from './FormAdd'
import styles from './index.module.css'

const contentQuery = graphql`
  query PoolAddQuery {
    content: allFile(filter: { relativePath: { eq: "price.json" } }) {
      edges {
        node {
          childContentJson {
            pool {
              add {
                title
                output {
                  titleIn
                  titleOut
                }
                action
              }
            }
          }
        }
      }
    }
  }
`

export interface FormAddLiquidity {
  amount: number
}

const initialValues: FormAddLiquidity = {
  amount: undefined
}

export default function Add({
  setShowAdd,
  poolAddress,
  totalPoolTokens,
  totalBalance,
  swapFee,
  dtSymbol,
  dtAddress
}: {
  setShowAdd: (show: boolean) => void
  poolAddress: string
  totalPoolTokens: string
  totalBalance: Balance
  swapFee: string
  dtSymbol: string
  dtAddress: string
}): ReactElement {
  const data = useStaticQuery(contentQuery)
  const content = data.content.edges[0].node.childContentJson.pool.add

  const { ocean, accountId, balance } = useOcean()
  const [txId, setTxId] = useState<string>()
  const [coin, setCoin] = useState('OCEAN')
  const [dtBalance, setDtBalance] = useState<string>()
  const [amountMax, setAmountMax] = useState<string>()

  // Live validation rules
  // https://github.com/jquense/yup#number
  const validationSchema = Yup.object().shape<FormAddLiquidity>({
    amount: Yup.number()
      .min(0.01, 'Must be more or equal to 0.01')
      .max(
        Number(amountMax),
        `Maximum you can add is ${Number(amountMax).toFixed(2)} ${coin}`
      )
      .required('Required')
  })

  // Get datatoken balance when datatoken selected
  useEffect(() => {
    if (!ocean || coin === 'OCEAN') return

    async function getDtBalance() {
      const dtBalance = await ocean.datatokens.balance(dtAddress, accountId)
      setDtBalance(dtBalance)
    }
    getDtBalance()
  }, [ocean, accountId, dtAddress, coin])

  // Get maximum amount for either OCEAN or datatoken
  useEffect(() => {
    if (!ocean || !poolAddress) return

    async function getMaximum() {
      const amountMaxPool =
        coin === 'OCEAN'
          ? await ocean.pool.getOceanMaxAddLiquidity(poolAddress)
          : await ocean.pool.getDTMaxAddLiquidity(poolAddress)

      const amountMax =
        coin === 'OCEAN'
          ? Number(balance.ocean) > Number(amountMaxPool)
            ? amountMaxPool
            : balance.ocean
          : Number(dtBalance) > Number(amountMaxPool)
          ? amountMaxPool
          : dtBalance
      setAmountMax(amountMax)
    }
    getMaximum()
  }, [ocean, poolAddress, coin, dtBalance, balance.ocean])

  // Submit
  async function handleAddLiquidity(amount: number, resetForm: () => void) {
    try {
      const result =
        coin === 'OCEAN'
          ? await ocean.pool.addOceanLiquidity(
              accountId,
              poolAddress,
              `${amount}`
            )
          : await ocean.pool.addDTLiquidity(accountId, poolAddress, `${amount}`)

      setTxId(result?.transactionHash)
      resetForm()
    } catch (error) {
      console.error(error.message)
      toast.error(error.message)
    }
  }

  return (
    <>
      <Header title={content.title} backAction={() => setShowAdd(false)} />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          await handleAddLiquidity(values.amount, resetForm)
          setSubmitting(false)
        }}
      >
        {({ isSubmitting, submitForm }) => (
          <>
            <FormAdd
              coin={coin}
              content={content}
              dtBalance={dtBalance}
              dtSymbol={dtSymbol}
              amountMax={amountMax}
              setCoin={setCoin}
              totalPoolTokens={totalPoolTokens}
              totalBalance={totalBalance}
              swapFee={swapFee}
              poolAddress={poolAddress}
            />

            <Actions
              isLoading={isSubmitting}
              loaderMessage="Adding Liquidity..."
              successMessage="Successfully added liquidity."
              actionName={content.action}
              action={submitForm}
              txId={txId}
            />
          </>
        )}
      </Formik>
    </>
  )
}
