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

export default function TradeInput({
  name,
  item,
  handleValueChange
}: {
  name: string
  item: TradeItem
  handleValueChange: (value: number) => void
}): ReactElement {
  const { ocean } = useOcean()
  // Connect with form
  const {
    handleChange,
    setFieldValue,
    validateForm,
    values
  }: FormikContextType<TradeLiquidity> = useFormikContext()
  return item ? (
    <>
      <div className={styles.userLiquidity}>
        <div>
          <span>
            {(name === 'ocean' && values.type === 'sell') ||
            (name === 'datatoken' && values.type === 'buy')
              ? `To`
              : `From`}
          </span>
        </div>
        <div>
          <span>Available:</span>
          <PriceUnit price={`${item.amount}`} symbol={item.token} small />
        </div>
        <div>
          <span>Maximum:</span>
          <PriceUnit price={`${item.maxAmount}`} symbol={item.token} small />
        </div>
      </div>
      <Field name={name}>
        {({ field, form }: { field: FieldInputProps<number>; form: any }) => (
          <Input
            type="number"
            max={`${item.maxAmount}`}
            prefix={item.token}
            placeholder="0"
            field={field}
            form={form}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleValueChange(Number(e.target.value))
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
          setFieldValue(name, item.maxAmount)
          handleValueChange(item.maxAmount)
        }}
      >
        Use Max
      </Button>
    </>
  ) : (
    <></>
  )
}
