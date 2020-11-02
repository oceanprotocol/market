import PriceUnit from '../../../../atoms/Price/PriceUnit'
import React, { ChangeEvent, ReactElement, useEffect } from 'react'
import styles from './FormAdd.module.css'
import Input from '../../../../atoms/Input'
import {
  Field,
  FieldInputProps,
  FormikContextType,
  useFormikContext
} from 'formik'
import Button from '../../../../atoms/Button'
import CoinSelect from '../CoinSelect'
import { FormAddLiquidity } from '.'
import { useOcean } from '@oceanprotocol/react'
import { Balance } from '..'

export default function FormAdd({
  coin,
  dtBalance,
  dtSymbol,
  amountMax,
  setCoin,
  totalPoolTokens,
  totalBalance,
  poolAddress,
  setNewPoolTokens,
  setNewPoolShare
}: {
  coin: string
  dtBalance: string
  dtSymbol: string
  amountMax: string
  setCoin: (value: string) => void
  totalPoolTokens: string
  totalBalance: Balance
  poolAddress: string
  setNewPoolTokens: (value: string) => void
  setNewPoolShare: (value: string) => void
}): ReactElement {
  const { ocean, balance } = useOcean()

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

    // Manually handle change events instead of using `handleChange` from Formik.
    // Solves bug where 0.0 can't be typed.
    validateField('amount')
    setFieldValue('amount', e.target.value)
  }

  useEffect(() => {
    async function calculatePoolShares() {
      if (!values.amount) {
        setNewPoolTokens('0')
        setNewPoolShare('0')
        return
      }
      if (Number(values.amount) > Number(amountMax)) return
      const poolTokens = await ocean.pool.calcPoolOutGivenSingleIn(
        poolAddress,
        coin === 'OCEAN' ? ocean.pool.oceanAddress : ocean.pool.dtAddress,
        values.amount.toString()
      )
      setNewPoolTokens(poolTokens)
      setNewPoolShare(
        totalBalance &&
          (
            (Number(poolTokens) /
              (Number(totalPoolTokens) + Number(poolTokens))) *
            100
          ).toFixed(2)
      )
    }
    calculatePoolShares()
  }, [values.amount])

  return (
    <>
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
            name="amount"
            max={amountMax}
            value={`${values.amount}`}
            step="any"
            prefix={<CoinSelect dtSymbol={dtSymbol} setCoin={setCoin} />}
            placeholder="0"
            field={field}
            form={form}
            onChange={handleFieldChange}
            disabled={!ocean}
          />
        )}
      </Field>

      {(Number(balance.ocean) || dtBalance) > (values.amount || 0) && (
        <Button
          className={styles.buttonMax}
          style="text"
          size="small"
          disabled={!ocean}
          onClick={() => setFieldValue('amount', amountMax)}
        >
          Use Max
        </Button>
      )}
    </>
  )
}
