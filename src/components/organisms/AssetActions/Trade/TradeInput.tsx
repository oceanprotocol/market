import React, { ChangeEvent, ReactElement } from 'react'
import styles from './TradeInput.module.css'

import {
  Field,
  FieldInputProps,
  FormikContextType,
  useFormikContext
} from 'formik'

import { useOcean } from '@oceanprotocol/react'
import Input from '../../../atoms/Input'
import Button from '../../../atoms/Button'
import UserLiquidity from '../../../atoms/UserLiquidity'
import { FormTradeData, TradeItem } from '../../../../models/FormTrade'

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
            disabled={!ocean}
          />
        )}
      </Field>
      {!isTopField && (
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
      )}
    </section>
  )
}
