import PriceUnit from '../../../../atoms/Price/PriceUnit'
import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import styles from './FormAdd.module.css'
import Input from '../../../../atoms/Input'
import { FormikContextType, useField, useFormikContext } from 'formik'
import Button from '../../../../atoms/Button'
import Token from '../Token'
import CoinSelect from '../CoinSelect'
import { FormAddLiquidity } from '.'
import { useOcean } from '@oceanprotocol/react'
import { Balance } from '..'

export default function FormAdd({
  content,
  coin,
  dtBalance,
  dtSymbol,
  amountMax,
  setCoin,
  totalPoolTokens,
  totalBalance,
  swapFee,
  poolAddress
}: {
  content: any
  coin: string
  dtBalance: string
  dtSymbol: string
  amountMax: string
  setCoin: (value: string) => void
  totalPoolTokens: string
  totalBalance: Balance
  swapFee: string
  poolAddress: string
}): ReactElement {
  const { ocean, balance } = useOcean()

  // Connect with form
  const {
    isSubmitting,
    touched,
    setTouched,
    handleChange,
    submitForm,
    setFieldValue,
    values
  }: FormikContextType<FormAddLiquidity> = useFormikContext()
  const [field, meta] = useField('amount')

  const [newPoolTokens, setNewPoolTokens] = useState('0')
  const [newPoolShare, setNewPoolShare] = useState('0')

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
      <div className={styles.addInput}>
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

        <Input
          type="number"
          max={amountMax}
          value={`${values.amount}`}
          prefix={<CoinSelect dtSymbol={dtSymbol} setCoin={setCoin} />}
          placeholder="0"
          field={field}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            // Workaround so validation kicks in on first touch
            !touched?.amount && setTouched({ amount: true })
            handleChange(e)
          }}
          disabled={!ocean}
        />

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
      </div>

      <div className={styles.output}>
        <div>
          <p>{content.output.titleIn}</p>
          <Token symbol="pool shares" balance={newPoolTokens} />
          <Token symbol="% of pool" balance={newPoolShare} />
        </div>
        <div>
          <p>{content.output.titleOut}</p>
          <Token symbol="% swap fee" balance={swapFee} />
        </div>
      </div>
    </>
  )
}
