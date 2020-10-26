import React, { ReactElement, useState, useEffect } from 'react'
import styles from './Add.module.css'
import { useOcean } from '@oceanprotocol/react'
import Header from './Header'
import { toast } from 'react-toastify'
import Button from '../../../atoms/Button'
import Token from './Token'
import { Balance } from './'
import PriceUnit from '../../../atoms/Price/PriceUnit'
import Actions from './Actions'
import { graphql, useStaticQuery } from 'gatsby'
import * as Yup from 'yup'
import { Field, FieldInputProps, Formik } from 'formik'
import Input from '../../../atoms/Input'
import CoinSelect from './CoinSelect'

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

interface FormAddLiquidity {
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
      .min(1, 'Must be more or equal to 1')
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
    if (!ocean) return

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
        {({
          values,
          touched,
          setTouched,
          isSubmitting,
          setFieldValue,
          submitForm,
          handleChange
        }) => {
          const newPoolTokens =
            totalBalance &&
            ((values.amount / Number(totalBalance.ocean)) * 100).toFixed(2)

          const newPoolShare =
            totalBalance &&
            ((Number(newPoolTokens) / Number(totalPoolTokens)) * 100).toFixed(2)

          return (
            <>
              <div className={styles.addInput}>
                <div className={styles.userLiquidity}>
                  <div>
                    <span>Available:</span>
                    {coin === 'OCEAN' ? (
                      <PriceUnit price={balance.ocean} symbol="OCEAN" small />
                    ) : (
                      <PriceUnit price={dtBalance} symbol={dtSymbol} small />
                    )}
                  </div>
                  <div>
                    <span>Maximum:</span>
                    <PriceUnit price={amountMax} symbol={coin} small />
                  </div>
                </div>

                <Field name="amount">
                  {({
                    field,
                    form
                  }: {
                    field: FieldInputProps<FormAddLiquidity>
                    form: any
                  }) => (
                    <Input
                      type="number"
                      max={amountMax}
                      value={`${values.amount}`}
                      prefix={
                        <CoinSelect dtSymbol={dtSymbol} setCoin={setCoin} />
                      }
                      placeholder="0"
                      field={field}
                      form={form}
                      onChange={(e) => {
                        // Workaround so validation kicks in on first touch
                        !touched?.amount && setTouched({ amount: true })
                        handleChange(e)
                      }}
                      disabled={!ocean}
                    />
                  )}
                </Field>

                {(Number(balance.ocean) || dtBalance) >
                  (values.amount || 0) && (
                  <Button
                    className={styles.buttonMax}
                    style="text"
                    size="small"
                    onClick={() => setFieldValue('amount', amountMax)}
                  >
                    Use Max
                  </Button>
                )}
              </div>

              <div className={styles.output}>
                <div>
                  <p>{content.output.titleIn}</p>
                  <Token symbol="pool shares" balance={newPoolTokens} />
                  <Token symbol="% of pool" balance={newPoolShare} />
                </div>
                <div>
                  <p>{content.output.titleOut}</p>
                  <Token symbol="% swap fee" balance={swapFee} />
                </div>
              </div>

              <Actions
                isLoading={isSubmitting}
                loaderMessage="Adding Liquidity..."
                actionName={content.action}
                action={submitForm}
                txId={txId}
              />
            </>
          )
        }}
      </Formik>
    </>
  )
}
