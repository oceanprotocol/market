import React, { ReactElement, useState, ChangeEvent, useEffect } from 'react'
import styles from './Add.module.css'
import { useOcean } from '@oceanprotocol/react'
import Header from './Header'
import { toast } from 'react-toastify'
import Button from '../../../atoms/Button'
import Token from './Token'
import { Balance } from './'
import PriceUnit from '../../../atoms/Price/PriceUnit'
import Actions from './Actions'
import Tooltip from '../../../atoms/Tooltip'
import { ReactComponent as Caret } from '../../../../images/caret.svg'
import { graphql, useStaticQuery } from 'gatsby'
import * as Yup from 'yup'
import { Field, FieldInputProps, Formik } from 'formik'
import Input from '../../../atoms/Input'

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
  const [txId, setTxId] = useState<string>('')
  const [coin, setCoin] = useState<string>('OCEAN')
  const [dtBalance, setDtBalance] = useState<string>()
  const [amountMax, setAmountMax] = useState<string>()

  // Live validation rules
  // https://github.com/jquense/yup#number
  const validationSchema = Yup.object().shape<FormAddLiquidity>({
    amount: Yup.number()
      .min(1, 'Must be more or equal to 1')
      .max(
        Number(amountMax),
        `Must be less or equal to ${Number(amountMax).toFixed(2)}`
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
      const amountMax =
        coin === 'OCEAN'
          ? await ocean.pool.getOceanMaxAddLiquidity(poolAddress)
          : await ocean.pool.getDTMaxAddLiquidity(poolAddress)
      setAmountMax(amountMax)
    }
    getMaximum()
  }, [ocean, poolAddress, coin])

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

  // TODO: this is only a prototype and is an accessibility nightmare.
  // Needs to be refactored to either use custom select element instead of tippy.js,
  // or use <button> in this implementation.
  // Also needs to be closed when users click an option.
  const CoinSelect = () => (
    <ul className={styles.coinPopover}>
      <li onClick={() => setCoin('OCEAN')}>OCEAN</li>
      <li onClick={() => setCoin(dtSymbol)}>{dtSymbol}</li>
    </ul>
  )

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
        {({ values, isSubmitting, setFieldValue, submitForm }) => {
          // TODO: move these 2 const to some useEffect() so it dos not
          // constantly re-renders all the time
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
                  {({ field, form }: { field: any; form: any }) => (
                    <Input
                      type="number"
                      max={amountMax}
                      prefix={
                        <Tooltip
                          content={<CoinSelect />}
                          trigger="click focus"
                          className={styles.coinswitch}
                          placement="bottom"
                        >
                          {coin}
                          <Caret aria-hidden="true" />
                        </Tooltip>
                      }
                      placeholder="0"
                      field={field}
                      form={form}
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
