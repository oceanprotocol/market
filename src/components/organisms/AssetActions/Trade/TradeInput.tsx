import React, { ChangeEvent, ReactElement } from 'react'
import styles from './TradeInput.module.css'

import {
  Field,
  FieldInputProps,
  FormikContextType,
  useFormikContext
} from 'formik'

import { useOcean } from '@oceanprotocol/react'
import { TradeLiquidity, TradeItem } from '.'
import PriceUnit from '../../../atoms/Price/PriceUnit'
import Input from '../../../atoms/Input'
import Button from '../../../atoms/Button'
import UserLiquidity from '../../../atoms/UserLiquidity'

export default function TradeInput({
  name,
  item,
  handleValueChange
}: {
  name: string
  item: TradeItem
  handleValueChange: (name: string, value: number) => void
}): ReactElement {
  const { ocean } = useOcean()

  // Connect with form
  const {
    handleChange,
    setFieldValue,
    validateForm
  }: FormikContextType<TradeLiquidity> = useFormikContext()

  return (
    <section className={styles.tradeInput}>
      <UserLiquidity
        amount={`${item?.amount}`}
        amountMax={`${item?.maxAmount}`}
        symbol={item?.token}
      />

      <Field name={name}>
        {({ field, form }: { field: FieldInputProps<number>; form: any }) => (
          <Input
            type="number"
            max={`${item?.maxAmount}`}
            prefix={item?.token}
            placeholder="0"
            field={field}
            form={form}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleValueChange(name, Number(e.target.value))
              validateForm()
              handleChange(e)
            }}
            disabled={!ocean}
          />
        )}
      </Field>
      <Button
        className={styles.buttonMax}
        style="text"
        size="small"
        onClick={() => {
          setFieldValue(name, item?.maxAmount)
          handleValueChange(name, item?.maxAmount)
        }}
      >
        Use Max
      </Button>
    </section>
  )
}
