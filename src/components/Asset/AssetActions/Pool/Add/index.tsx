import React, { ReactElement, useState, useEffect } from 'react'
import Header from '../Header'
import { toast } from 'react-toastify'
import Actions from '../Actions'
import * as Yup from 'yup'
import { Formik } from 'formik'
import FormAdd from './FormAdd'
import styles from './index.module.css'
import Alert from '@shared/atoms/Alert'
import { useUserPreferences } from '@context/UserPreferences'
import Output from './Output'
import DebugOutput from '@shared/DebugOutput'
import { useOcean } from '@context/Ocean'
import { useWeb3 } from '@context/Web3'
import { useAsset } from '@context/Asset'
import { pool } from '../../../../../../content/price.json'

export interface FormAddLiquidity {
  amount: number
}

const initialValues: FormAddLiquidity = {
  amount: undefined
}

export default function Add({
  setShowAdd,
  refreshInfo,
  poolAddress,
  totalPoolTokens,
  totalBalance,
  swapFee,
  dtSymbol,
  dtAddress
}: {
  setShowAdd: (show: boolean) => void
  refreshInfo: () => void
  poolAddress: string
  totalPoolTokens: string
  totalBalance: PoolBalance
  swapFee: string
  dtSymbol: string
  dtAddress: string
}): ReactElement {
  const { accountId, balance } = useWeb3()
  const { ocean } = useOcean()
  const { isAssetNetwork } = useAsset()
  const { debug } = useUserPreferences()
  const [txId, setTxId] = useState<string>()
  const [coin, setCoin] = useState('OCEAN')
  const [dtBalance, setDtBalance] = useState<string>()
  const [amountMax, setAmountMax] = useState<string>()
  const [amount, setAmount] = useState<string>('0')
  const [newPoolTokens, setNewPoolTokens] = useState('0')
  const [newPoolShare, setNewPoolShare] = useState('0')
  const [isWarningAccepted, setIsWarningAccepted] = useState(false)

  // Live validation rules
  // https://github.com/jquense/yup#number
  const validationSchema: Yup.SchemaOf<FormAddLiquidity> = Yup.object().shape({
    amount: Yup.number()
      .min(0.00001, (param) => `Must be more or equal to ${param.min}`)
      .max(
        Number(amountMax),
        `Maximum you can add is ${Number(amountMax).toFixed(2)} ${coin}`
      )
      .required('Required')
  })

  // Get datatoken balance when datatoken selected
  useEffect(() => {
    if (!ocean || !isAssetNetwork || coin === 'OCEAN') return

    async function getDtBalance() {
      const dtBalance = await ocean.datatokens.balance(dtAddress, accountId)
      setDtBalance(dtBalance)
    }
    getDtBalance()
  }, [ocean, accountId, dtAddress, coin])

  // Get maximum amount for either OCEAN or datatoken
  useEffect(() => {
    if (!ocean || !isAssetNetwork || !poolAddress) return

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
      setAmountMax(Number(amountMax).toFixed(3))
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
      refreshInfo()
    } catch (error) {
      console.error(error.message)
      toast.error(error.message)
    }
  }

  return (
    <>
      <Header title={pool.add.title} backAction={() => setShowAdd(false)} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          await handleAddLiquidity(values.amount, resetForm)
          setSubmitting(false)
        }}
      >
        {({ isSubmitting, submitForm, values, isValid }) => (
          <>
            <div className={styles.addInput}>
              {isWarningAccepted ? (
                <FormAdd
                  coin={coin}
                  dtBalance={dtBalance}
                  dtSymbol={dtSymbol}
                  amountMax={amountMax}
                  setCoin={setCoin}
                  setAmount={setAmount}
                  totalPoolTokens={totalPoolTokens}
                  totalBalance={totalBalance}
                  poolAddress={poolAddress}
                  setNewPoolTokens={setNewPoolTokens}
                  setNewPoolShare={setNewPoolShare}
                />
              ) : (
                pool.add.warning && (
                  <Alert
                    className={styles.warning}
                    text={pool.add.warning.toString()}
                    state="info"
                    action={{
                      name: 'I understand',
                      style: 'text',
                      handleAction: () => setIsWarningAccepted(true)
                    }}
                  />
                )
              )}
            </div>

            <Output
              newPoolTokens={newPoolTokens}
              newPoolShare={newPoolShare}
              swapFee={swapFee}
              dtSymbol={dtSymbol}
              totalPoolTokens={totalPoolTokens}
              totalBalance={totalBalance}
              coin={coin}
            />

            <Actions
              isDisabled={
                !isValid ||
                !isWarningAccepted ||
                amount === '' ||
                amount === '0'
              }
              isLoading={isSubmitting}
              loaderMessage="Adding Liquidity..."
              successMessage="Successfully added liquidity."
              actionName={pool.add.action}
              action={submitForm}
              amount={amount}
              coin={coin}
              txId={txId}
            />
            {debug && <DebugOutput title="Collected values" output={values} />}
          </>
        )}
      </Formik>
    </>
  )
}
