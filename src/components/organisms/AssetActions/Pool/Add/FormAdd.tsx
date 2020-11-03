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
import DtBalance from '../../../../../models/DtBalance'

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
  totalBalance: DtBalance
  poolAddress: string
  setNewPoolTokens: (value: string) => void
  setNewPoolShare: (value: string) => void
}): ReactElement {
  const { ocean, balance } = useOcean()

  // Connect with form
  const {
    touched,
    setTouched,
    handleChange,
    setFieldValue,
    values
  }: FormikContextType<FormAddLiquidity> = useFormikContext()

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
            prefix={<CoinSelect dtSymbol={dtSymbol} setCoin={setCoin} />}
            placeholder="0"
            field={field}
            form={form}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              // Workaround so validation kicks in on first touch
              !touched?.amount && setTouched({ amount: true })
              handleChange(e)
            }}
            disabled={!ocean}
          />
        )}
      </Field>

      {(Number(balance.ocean) || dtBalance) > (values.amount || 0) && (
        <Button
          className={styles.buttonMax}
          style="text"
          size="small"
          onClick={() => setFieldValue('amount', amountMax)}
        >
          Use Max
        </Button>
      )}
    </>
  )
}
