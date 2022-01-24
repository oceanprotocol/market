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
import { getOceanConfig } from '@utils/ocean'

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
  datatokenSymbol,
  baseTokenSymbol,
  fetchAllData
}: {
  setShowAdd: (show: boolean) => void
  poolAddress: string
  totalPoolTokens: string
  totalBalance: PoolBalance
  swapFee: string
  datatokenSymbol: string
  baseTokenSymbol: string
  fetchAllData: () => void
}): ReactElement {
  const { accountId, balance, web3 } = useWeb3()
  const { isAssetNetwork } = useAsset()
  const { debug } = useUserPreferences()
  const [txId, setTxId] = useState<string>()
  const [amountMax, setAmountMax] = useState<string>()
  const [amount, setAmount] = useState<string>('0')
  const [newPoolTokens, setNewPoolTokens] = useState('0')
  const [newPoolShare, setNewPoolShare] = useState('0')
  const [isWarningAccepted, setIsWarningAccepted] = useState(false)
  const [tokenInAddress, setTokenInAddress] = useState<string>()

  // Live validation rules
  // https://github.com/jquense/yup#number
  const validationSchema: Yup.SchemaOf<FormAddLiquidity> = Yup.object().shape({
    amount: Yup.number()
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
        const tokenInAddress = await poolInstance.getBasetoken(poolAddress)
        setTokenInAddress(tokenInAddress)

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
  }, [web3, accountId, isAssetNetwork, poolAddress, balance?.ocean])

  // Submit
  async function handleAddLiquidity(amount: number, resetForm: () => void) {
    const poolInstance = new Pool(web3, LoggerInstance)
    const minPoolAmountOut = '0' // ? TODO: how to get?

    try {
      const result = await poolInstance.joinswapExternAmountIn(
        accountId,
        poolAddress,
        tokenInAddress,
        `${amount}`,
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
                  tokenInSymbol={baseTokenSymbol}
                  amountMax={amountMax}
                  setAmount={setAmount}
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
                amount === '' ||
                amount === '0'
              }
              isLoading={isSubmitting}
              loaderMessage="Adding Liquidity..."
              successMessage="Successfully added liquidity."
              actionName={content.pool.add.action}
              action={submitForm}
              amount={amount}
              txId={txId}
            />
            {debug && <DebugOutput title="Collected values" output={values} />}
          </>
        )}
      </Formik>
    </>
  )
}
