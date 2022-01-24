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
import { Datatoken, LoggerInstance, Pool } from '@oceanprotocol/lib'

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
  dtAddress,
  fetchAllData
}: {
  setShowAdd: (show: boolean) => void
  poolAddress: string
  totalPoolTokens: string
  totalBalance: PoolBalance
  swapFee: string
  dtSymbol: string
  dtAddress: string
  fetchAllData: () => void
}): ReactElement {
  const { accountId, balance, web3 } = useWeb3()
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
  const [tokenInAddress, setTokenInAddress] = useState<string>()

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
    if (!web3 || !accountId || !isAssetNetwork || coin === 'OCEAN') return

    async function getDtBalance() {
      const datatokenInstance = new Datatoken(web3)
      const dtBalance = await datatokenInstance.balance(dtAddress, accountId)
      setDtBalance(dtBalance)
    }
    getDtBalance()
  }, [web3, accountId, dtAddress, coin, isAssetNetwork])

  // Get maximum amount for either OCEAN or datatoken
  useEffect(() => {
    if (!web3 || !accountId || !isAssetNetwork || !poolAddress) return

    async function getMaximum() {
      const poolInstance = new Pool(web3, LoggerInstance)
      const baseTokenAddress = await poolInstance.getBasetoken(poolAddress)
      const tokenInAddress = coin === 'OCEAN' ? baseTokenAddress : dtAddress
      setTokenInAddress(tokenInAddress)

      const amountMaxPool = await poolInstance.getReserve(
        poolAddress,
        tokenInAddress
      )

      // coin === 'OCEAN'
      //   ? await poolInstance.getOceanMaxAddLiquidity(poolAddress)
      //   : await poolInstance.getDTMaxAddLiquidity(poolAddress)
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
  }, [
    web3,
    accountId,
    isAssetNetwork,
    poolAddress,
    dtAddress,
    coin,
    dtBalance,
    balance.ocean
  ])

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
      // resetForm()
      fetchAllData()
    } catch (error) {
      console.error(error.message)
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
              actionName={content.pool.add.action}
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
