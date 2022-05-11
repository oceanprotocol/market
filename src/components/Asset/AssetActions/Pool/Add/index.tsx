import React, { ReactElement, useState, useEffect } from 'react'
import Header from '../Actions/Header'
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
import { calcMaxExactIn, LoggerInstance, Pool } from '@oceanprotocol/lib'
import { usePool } from '@context/Pool'
import { MAX_DECIMALS } from '@utils/constants'
import { getMaxDecimalsValidation } from '@utils/numbers'

export interface FormAddLiquidity {
  amount: number
}

const initialValues: FormAddLiquidity = {
  amount: 0
}

export default function Add({
  setShowAdd
}: {
  setShowAdd: (show: boolean) => void
}): ReactElement {
  const { accountId, balance, web3 } = useWeb3()
  const { isAssetNetwork } = useAsset()
  const { poolData, poolInfo, fetchAllData } = usePool()
  const { debug } = useUserPreferences()

  const [txId, setTxId] = useState<string>()
  const [amountMax, setAmountMax] = useState<string>()
  const [newPoolTokens, setNewPoolTokens] = useState('0')
  const [newPoolShare, setNewPoolShare] = useState('0')

  // Live validation rules
  // https://github.com/jquense/yup#number
  const validationSchema: Yup.SchemaOf<FormAddLiquidity> = Yup.object().shape({
    amount: Yup.number()
      .min(0.00001, (param) => `Must be more or equal to ${param.min}`)
      .max(
        Number(amountMax),
        `Maximum you can add is ${Number(amountMax).toFixed(2)} OCEAN`
      )
      .test(
        'maxDigitsAfterDecimal',
        `Must have maximum ${MAX_DECIMALS} decimal digits`,
        (param) =>
          getMaxDecimalsValidation(MAX_DECIMALS).test(param?.toString())
      )
      .required('Required')
  })

  // Get maximum amount for OCEAN
  useEffect(() => {
    if (
      !web3 ||
      !accountId ||
      !isAssetNetwork ||
      !poolData?.id ||
      !poolInfo?.baseTokenAddress
    )
      return

    async function getMaximum() {
      try {
        const poolInstance = new Pool(web3)

        const poolReserve = await poolInstance.getReserve(
          poolData.id,
          poolInfo.baseTokenAddress,
          poolInfo.baseTokenDecimals
        )

        const amountMaxPool = calcMaxExactIn(poolReserve)
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
    poolData?.id,
    poolInfo?.baseTokenAddress,
    poolInfo?.baseTokenDecimals,
    balance?.ocean
  ])

  // Submit
  async function handleAddLiquidity(amount: string, resetForm: () => void) {
    const poolInstance = new Pool(web3)
    const minPoolAmountOut = '0' // ? how to get? : you would get this value by using `calcPoolOutGivenSingleIn` and substracting slippage from that , like we don in trade. it is ok to be 0 here. We can change after we implement global slippage

    try {
      const result = await poolInstance.joinswapExternAmountIn(
        accountId,
        poolData?.id,
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
        backAction={() => {
          setShowAdd(false)
          fetchAllData()
        }}
      />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          await handleAddLiquidity(values.amount.toString(), resetForm)
          setSubmitting(false)
        }}
      >
        {({ isSubmitting, setSubmitting, submitForm, values, isValid }) => (
          <>
            <div className={styles.addInput}>
              <FormAdd
                amountMax={amountMax}
                setNewPoolTokens={setNewPoolTokens}
                setNewPoolShare={setNewPoolShare}
              />
            </div>

            <Output newPoolTokens={newPoolTokens} newPoolShare={newPoolShare} />

            <Actions
              isDisabled={!isValid || !values.amount || values.amount === 0}
              isLoading={isSubmitting}
              loaderMessage="Adding Liquidity..."
              successMessage="Successfully added liquidity."
              actionName={content.pool.add.action}
              action={submitForm}
              amount={values.amount.toString()}
              tokenAddress={poolInfo?.baseTokenAddress}
              tokenSymbol={poolInfo?.baseTokenSymbol}
              txId={txId}
              setSubmitting={setSubmitting}
            />
            {debug && <DebugOutput output={values} />}
          </>
        )}
      </Formik>
    </>
  )
}
