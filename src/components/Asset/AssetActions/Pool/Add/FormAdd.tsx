import React, { ChangeEvent, ReactElement, useEffect } from 'react'
import styles from './FormAdd.module.css'
import Input from '@shared/FormInput'
import {
  Field,
  FieldInputProps,
  FormikContextType,
  useFormikContext
} from 'formik'
import Button from '@shared/atoms/Button'
import CoinSelect from '../CoinSelect'
import { FormAddLiquidity } from '.'
import UserLiquidity from '../../UserLiquidity'
import { useWeb3 } from '@context/Web3'

import { isValidNumber } from '@utils/numbers'
import Decimal from 'decimal.js'
import { useAsset } from '@context/Asset'
import { LoggerInstance, Pool } from '@oceanprotocol/lib'

export default function FormAdd({
  tokenInAddress,
  coin,
  dtBalance,
  dtSymbol,
  amountMax,
  setCoin,
  setAmount,
  totalPoolTokens,
  totalBalance,
  poolAddress,
  setNewPoolTokens,
  setNewPoolShare
}: {
  tokenInAddress: string
  coin: string
  dtBalance: string
  dtSymbol: string
  amountMax: string
  setCoin: (value: string) => void
  setAmount: (value: string) => void
  totalPoolTokens: string
  totalBalance: PoolBalance
  poolAddress: string
  setNewPoolTokens: (value: string) => void
  setNewPoolShare: (value: string) => void
}): ReactElement {
  const { balance, web3 } = useWeb3()
  const { isAssetNetwork } = useAsset()

  // Connect with form
  const {
    touched,
    setTouched,
    setFieldValue,
    validateField,
    values
  }: FormikContextType<FormAddLiquidity> = useFormikContext()

  function handleFieldChange(e: ChangeEvent<HTMLInputElement>) {
    // Workaround so validation kicks in on first touch
    !touched?.amount && setTouched({ amount: true })
    setAmount(e.target.value)

    // Manually handle change events instead of using `handleChange` from Formik.
    // Solves bug where 0.0 can't be typed.
    validateField('amount')
    setFieldValue('amount', e.target.value)
  }

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
        `${values.amount}`
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

  useEffect(() => {
    setFieldValue('amount', undefined)
  }, [coin])

  return (
    <>
      <UserLiquidity
        amount={coin === 'OCEAN' ? balance.ocean : dtBalance}
        amountMax={amountMax}
        symbol={coin}
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
            value={`${values.amount}`}
            step="any"
            prefix={
              <CoinSelect
                dtSymbol={dtSymbol}
                setCoin={setCoin}
                disabled={!web3 || !isAssetNetwork}
              />
            }
            placeholder="0"
            field={field}
            form={form}
            onChange={handleFieldChange}
            disabled={!isAssetNetwork}
          />
        )}
      </Field>

      {(Number(balance.ocean) || dtBalance) > (values.amount || 0) && (
        <Button
          className={styles.buttonMax}
          style="text"
          size="small"
          disabled={!web3}
          onClick={() => {
            setAmount(amountMax)
            setFieldValue('amount', amountMax)
          }}
        >
          Use Max
        </Button>
      )}
    </>
  )
}
