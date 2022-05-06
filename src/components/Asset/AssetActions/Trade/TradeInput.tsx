import React, { ChangeEvent, ReactElement } from 'react'
import styles from './TradeInput.module.css'
import {
  Field,
  FieldInputProps,
  FormikContextType,
  useFormikContext,
  useField
} from 'formik'
import debounce from 'lodash.debounce'
import Button from '@shared/atoms/Button'
import Input from '@shared/FormInput'
import Error from '@shared/FormInput/Error'
import { FormTradeData, TradeItem } from './_types'
import UserLiquidity from '../UserLiquidity'
import { useWeb3 } from '@context/Web3'

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
  const { accountId } = useWeb3()

  // Connect with form
  const {
    handleChange,
    validateForm,
    values
  }: FormikContextType<FormTradeData> = useFormikContext()
  const [field, meta] = useField(name)
  const isTopField =
    (name === 'baseToken' && values.type === 'buy') ||
    (name === 'datatoken' && values.type === 'sell')
  const titleAvailable = isTopField ? `Your Balance` : `Pool Balance`
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
            min="0"
            prefix={item?.token}
            placeholder="0"
            field={field}
            form={form}
            disabled={!accountId || disabled}
            additionalComponent={<Error meta={meta} />}
            value={`${field.value}`}
            {...field}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleChange(e)
              handleValueChange(name, Number(e.target.value))
              // debounce needed to avoid validating the wrong (pass) value
              debounce(() => validateForm(), 100)
            }}
          />
        )}
      </Field>

      {/* {!isTopField && (
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
      )} */}
    </section>
  )
}
