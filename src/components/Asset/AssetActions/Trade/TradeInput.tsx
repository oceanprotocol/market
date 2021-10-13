import React, { ChangeEvent, ReactElement } from 'react'
import styles from './TradeInput.module.css'
import {
  Field,
  FieldInputProps,
  FormikContextType,
  useFormikContext
} from 'formik'
import Input from '@shared/Form/Input'
import Button from '@shared/atoms/Button'
import { useOcean } from '../../../../context/Ocean'
import { FormTradeData, TradeItem } from './_types'
import UserLiquidity from '@shared/atoms/UserLiquidity'

export default function TradeInput({
  name,
  item,
  disabled,
  handleValueChange
}: {
  name: string
  item: TradeItem
  disabled: boolean
  handleValueChange: (name: string, value: number) => void
}): ReactElement {
  const { ocean } = useOcean()

  // Connect with form
  const {
    handleChange,
    setFieldValue,
    validateForm,
    values
  }: FormikContextType<FormTradeData> = useFormikContext()

  const isTopField =
    (name === 'ocean' && values.type === 'buy') ||
    (name === 'datatoken' && values.type === 'sell')
  const titleAvailable = isTopField ? `Balance` : `Available from pool`
  const titleMaximum = isTopField ? `Maximum to spend` : `Maximum to receive`

  return (
    <section className={styles.tradeInput}>
      <UserLiquidity
        amount={`${item?.amount}`}
        amountMax={`${item?.maxAmount}`}
        symbol={item?.token}
        titleAvailable={titleAvailable}
        titleMaximum={titleMaximum}
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
            value={`${field.value}`}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleValueChange(name, Number(e.target.value))
              validateForm()
              handleChange(e)
            }}
            disabled={!ocean || disabled}
          />
        )}
      </Field>
      {!isTopField && (
        <Button
          className={styles.buttonMax}
          disabled={disabled}
          style="text"
          size="small"
          onClick={() => {
            setFieldValue(name, item?.maxAmount)
            handleValueChange(name, Number(item?.maxAmount))
          }}
        >
          Use Max
        </Button>
      )}
    </section>
  )
}
