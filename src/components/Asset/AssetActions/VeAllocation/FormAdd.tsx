import React, { ReactElement, useEffect } from 'react'
import styles from './FormAdd.module.css'
import Input from '@shared/FormInput'
import Error from '@shared/FormInput/Error'
import { FormikContextType, useField, useFormikContext } from 'formik'
import Button from '@shared/atoms/Button'
import { FormAddLiquidity } from '.'
import { useWeb3 } from '@context/Web3'
import { isValidNumber } from '@utils/numbers'
import Decimal from 'decimal.js'
import { useAsset } from '@context/Asset'

export default function FormAdd({
  amountMax,
  setNewPoolTokens,
  setNewPoolShare
}: {
  amountMax: string
  setNewPoolTokens: (value: string) => void
  setNewPoolShare: (value: string) => void
}): ReactElement {
  const { balance, web3 } = useWeb3()

  // Connect with form
  const {
    setFieldValue,
    values,
    isSubmitting
  }: FormikContextType<FormAddLiquidity> = useFormikContext()
  const [field, meta] = useField('amount')
  useEffect(() => {
    console.log('effect')
  }, [])

  return (
    <>
      <UserLiquidity
        amount={balance.ocean}
        amountMax={amountMax}
        symbol={poolInfo?.baseTokenSymbol}
      />

      <Input
        type="number"
        min="0"
        prefix={poolInfo?.baseTokenSymbol}
        placeholder="0"
        disabled={!isAssetNetwork || isSubmitting}
        {...field}
        additionalComponent={<Error meta={meta} />}
      />

      {Number(balance.ocean) > 0 && (
        <Button
          className={styles.buttonMax}
          style="text"
          size="small"
          disabled={!web3 || isSubmitting}
          onClick={() => setFieldValue('amount', amountMax)}
        >
          Use Max
        </Button>
      )}
    </>
  )
}
