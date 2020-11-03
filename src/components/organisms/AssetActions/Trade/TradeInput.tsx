import React, { ChangeEvent, ReactElement, useEffect } from 'react'
import styles from './TradeInput.module.css'

import {
  Field,
  FieldInputProps,
  FormikContextType,
  useField,
  useFormikContext
} from 'formik'

import { useOcean } from '@oceanprotocol/react'
import DtBalance from '../../../../models/DtBalance'
import { TradeLiquidity, TradeValue } from '.'
import PriceUnit from '../../../atoms/Price/PriceUnit'
import Input from '../../../atoms/Input'
import Button from '../../../atoms/Button'

export default function TradeInput({
  name,
  value
}: {
  name: string
  value: TradeValue
}): ReactElement {
  const { ocean, balance } = useOcean()
  // Connect with form
  const {
    handleChange,
    values
  }: FormikContextType<TradeLiquidity> = useFormikContext()


  return value ? (
    <>
      <div className={styles.userLiquidity}>
        <div> <span>{name === 'buyToken' ? `To`: `From`}</span></div>
        <div>
       
          <span>Available:</span>
          {value.token === 'OCEAN' ? (
            <PriceUnit price={balance.ocean} symbol="OCEAN" small />
          ) : (
            <PriceUnit price={`${value.amount}`} symbol={value.token} small />
          )}
        </div>
        <div>
          <span>Maximum:</span>
          <PriceUnit price={`${value.maxAmount}`} symbol={value.token} small />
        </div>
      </div>

      <Field name={name} >
      {({
          field,
          form
        }: {
          field: FieldInputProps<number>
          form: any
        }) => (
          <Input
            type="number"
    
            max={`${value.maxAmount}`}
            prefix={value.token}
            placeholder="0"
            field={field}
            form={form}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              // Workaround so validation kicks in on first touch
       
              handleChange(e)
            }}
            disabled={!ocean}
          />
        )}
      </Field>
      {(Number(balance.ocean) || value.amount) >
        (value.maxAmount|| 0) && (
        <Button
          className={styles.buttonMax}
          style="text"
          size="small"
          //   onClick={() => setFieldValue('amount', amountMax)}
        >
          Use Max
        </Button>
      )}
    </>
  ) : <></>
}
