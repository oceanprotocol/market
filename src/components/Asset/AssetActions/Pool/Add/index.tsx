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
import { useWeb3 } from '@context/Web3'
import { useAsset } from '@context/Asset'
import content from '../../../../../../content/price.json'
import { LoggerInstance, Pool } from '@oceanprotocol/lib'

export interface FormAddLiquidity {
  amount: string
}

const initialValues: FormAddLiquidity = {
  amount: ''
}

export default function Add({
  setShowAdd,
  poolAddress,
  totalPoolTokens,
  totalBalance,
  swapFee,
  datatokenSymbol,
  tokenInSymbol,
  tokenInAddress,
  fetchAllData
}: {
  setShowAdd: (show: boolean) => void
  poolAddress: string
  totalPoolTokens: string
  totalBalance: PoolBalance
  swapFee: string
  datatokenSymbol: string
  tokenInSymbol: string
  tokenInAddress: string
  fetchAllData: () => void
}): ReactElement {
  const { accountId, balance, web3 } = useWeb3()
  const { isAssetNetwork } = useAsset()
  const { debug } = useUserPreferences()
  const [txId, setTxId] = useState<string>()
  const [amountMax, setAmountMax] = useState<string>()
  const [newPoolTokens, setNewPoolTokens] = useState('0')
  const [newPoolShare, setNewPoolShare] = useState('0')
  const [isWarningAccepted, setIsWarningAccepted] = useState(false)

  // Live validation rules
  // https://github.com/jquense/yup#number
  const validationSchema: Yup.SchemaOf<FormAddLiquidity> = Yup.object().shape({
    amount: Yup.string()
      .min(0.00001, (param) => `Must be more or equal to ${param.min}`)
      .max(
        Number(amountMax),
        `Maximum you can add is ${Number(amountMax).toFixed(2)} OCEAN`
      )
      .required('Required')
  })

  // Get maximum amount for OCEAN
  useEffect(() => {
    if (!web3 || !accountId || !isAssetNetwork || !poolAddress) return

    async function getMaximum() {
      try {
        const poolInstance = new Pool(web3, LoggerInstance)

        const amountMaxPool = await poolInstance.getReserve(
          poolAddress,
          tokenInAddress
        )

        const amountMax =
          Number(balance.ocean) > Number(amountMaxPool)
            ? amountMaxPool
            : balance.ocean
        setAmountMax(Number(amountMax).toFixed(3))
      } catch (error) {
        LoggerInstance.error(error.message)
      }
    }
    getMaximum()
  }, [
    web3,
    accountId,
    isAssetNetwork,
    poolAddress,
    tokenInAddress,
    balance?.ocean
  ])

  // Submit
  async function handleAddLiquidity(amount: string, resetForm: () => void) {
    const poolInstance = new Pool(web3, LoggerInstance)
    const minPoolAmountOut = '0' // ? TODO: how to get?

    try {
      const result = await poolInstance.joinswapExternAmountIn(
        accountId,
        poolAddress,
        tokenInAddress,
        amount,
        minPoolAmountOut
      )
      setTxId(result?.transactionHash)
      fetchAllData()
      resetForm()
    } catch (error) {
      LoggerInstance.error(error.message)
      toast.error(error.message)
    }
  }

  return (
    <>
      <Header
        title={content.pool.add.title}
        backAction={() => setShowAdd(false)}
      />
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
                  tokenInAddress={tokenInAddress}
                  tokenInSymbol={tokenInSymbol}
                  amountMax={amountMax}
                  totalPoolTokens={totalPoolTokens}
                  totalBalance={totalBalance}
                  poolAddress={poolAddress}
                  setNewPoolTokens={setNewPoolTokens}
                  setNewPoolShare={setNewPoolShare}
                />
              ) : (
                content.pool.add.warning && (
                  <Alert
                    className={styles.warning}
                    text={content.pool.add.warning.toString()}
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
              datatokenSymbol={datatokenSymbol}
              totalPoolTokens={totalPoolTokens}
              totalBalance={totalBalance}
            />

            <Actions
              isDisabled={
                !isValid ||
                !isWarningAccepted ||
                !values.amount ||
                values.amount === '' ||
                values.amount === '0'
              }
              isLoading={isSubmitting}
              loaderMessage="Adding Liquidity..."
              successMessage="Successfully added liquidity."
              actionName={content.pool.add.action}
              action={submitForm}
              amount={values.amount}
              tokenAddress={tokenInAddress}
              tokenSymbol={tokenInSymbol}
              txId={txId}
            />
            {debug && <DebugOutput output={values} />}
          </>
        )}
      </Formik>
    </>
  )
}
