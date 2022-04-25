import React, { ReactElement, useEffect } from 'react'
import styles from './FormAdd.module.css'
import Input from '@shared/FormInput'
import Error from '@shared/FormInput/Error'
import { FormikContextType, useField, useFormikContext } from 'formik'
import Button from '@shared/atoms/Button'
import { FormAddLiquidity } from '.'
import UserLiquidity from '../../UserLiquidity'
import { useWeb3 } from '@context/Web3'
import { isValidNumber } from '@utils/numbers'
import Decimal from 'decimal.js'
import { useAsset } from '@context/Asset'
import { Pool } from '@oceanprotocol/lib'
import { usePool } from '@context/Pool'

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
  const { isAssetNetwork } = useAsset()
  const { poolData, poolInfo } = usePool()

  // Connect with form
  const {
    setFieldValue,
    values,
    isSubmitting
  }: FormikContextType<FormAddLiquidity> = useFormikContext()
  const [field, meta] = useField('amount')
  useEffect(() => {
    async function calculatePoolShares() {
      if (!web3 || !poolData?.id || !poolInfo?.totalPoolTokens) return

      if (!values.amount || !poolInfo?.baseTokenAddress) {
        setNewPoolTokens('0')
        setNewPoolShare('0')
        return
      }
      if (Number(values.amount) > Number(amountMax)) return

      const poolInstance = new Pool(web3)

      const poolTokens = await poolInstance.calcPoolOutGivenSingleIn(
        poolData.id,
        poolInfo.baseTokenAddress,
        values.amount.toString()
      )
      setNewPoolTokens(poolTokens)
      const newPoolShareDecimal =
        isValidNumber(poolTokens) && isValidNumber(poolInfo.totalPoolTokens)
          ? new Decimal(poolTokens)
              .dividedBy(
                new Decimal(poolInfo.totalPoolTokens).plus(
                  new Decimal(poolTokens)
                )
              )
              .mul(100)
              .toString()
          : '0'
      setNewPoolShare(newPoolShareDecimal)
    }
    calculatePoolShares()
  }, [
    poolInfo?.baseTokenAddress,
    web3,
    values.amount,
    poolInfo?.totalPoolTokens,
    amountMax,
    poolData?.id,
    setNewPoolTokens,
    setNewPoolShare
  ])

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
