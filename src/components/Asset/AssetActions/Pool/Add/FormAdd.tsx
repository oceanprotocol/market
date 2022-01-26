import React, { ReactElement, useEffect } from 'react'
import styles from './FormAdd.module.css'
import Input from '@shared/FormInput'
import {
  Field,
  FieldInputProps,
  FormikContextType,
  useFormikContext
} from 'formik'
import Button from '@shared/atoms/Button'
import { FormAddLiquidity } from '.'
import UserLiquidity from '../../UserLiquidity'
import { useWeb3 } from '@context/Web3'
import { isValidNumber } from '@utils/numbers'
import Decimal from 'decimal.js'
import { useAsset } from '@context/Asset'
import { LoggerInstance, Pool } from '@oceanprotocol/lib'

export default function FormAdd({
  tokenInAddress,
  tokenInSymbol,
  amountMax,
  totalPoolTokens,
  totalBalance,
  poolAddress,
  setNewPoolTokens,
  setNewPoolShare
}: {
  tokenInAddress: string
  tokenInSymbol: string
  amountMax: string
  totalPoolTokens: string
  totalBalance: PoolBalance
  poolAddress: string
  setNewPoolTokens: (value: string) => void
  setNewPoolShare: (value: string) => void
}): ReactElement {
  const { balance, web3 } = useWeb3()
  const { isAssetNetwork } = useAsset()

  // Connect with form
  const { setFieldValue, values }: FormikContextType<FormAddLiquidity> =
    useFormikContext()

  useEffect(() => {
    async function calculatePoolShares() {
      if (!web3) return

      if (!values.amount || !tokenInAddress) {
        setNewPoolTokens('0')
        setNewPoolShare('0')
        return
      }
      if (Number(values.amount) > Number(amountMax)) return

      const poolInstance = new Pool(web3, LoggerInstance)

      const poolTokens = await poolInstance.calcPoolOutGivenSingleIn(
        poolAddress,
        tokenInAddress,
        values.amount
      )
      setNewPoolTokens(poolTokens)
      const newPoolShareDecimal =
        isValidNumber(poolTokens) && isValidNumber(totalPoolTokens)
          ? new Decimal(poolTokens)
              .dividedBy(
                new Decimal(totalPoolTokens).plus(new Decimal(poolTokens))
              )
              .mul(100)
              .toString()
          : '0'
      totalBalance && setNewPoolShare(newPoolShareDecimal)
    }
    calculatePoolShares()
  }, [
    tokenInAddress,
    web3,
    values.amount,
    totalBalance,
    totalPoolTokens,
    amountMax,
    poolAddress,
    setNewPoolTokens,
    setNewPoolShare
  ])

  return (
    <>
      <UserLiquidity
        amount={balance.ocean}
        amountMax={amountMax}
        symbol={tokenInSymbol}
      />

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
            name="amount"
            max={amountMax}
            min="0"
            value={values.amount}
            step="any"
            prefix={tokenInSymbol}
            placeholder="0"
            field={field}
            form={form}
            disabled={!isAssetNetwork}
          />
        )}
      </Field>

      {Number(balance.ocean) && (
        <Button
          className={styles.buttonMax}
          style="text"
          size="small"
          disabled={!web3}
          onClick={() => setFieldValue('amount', amountMax)}
        >
          Use Max
        </Button>
      )}
    </>
  )
}
