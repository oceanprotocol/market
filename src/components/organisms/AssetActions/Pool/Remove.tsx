import React, { ReactElement, useState, ChangeEvent } from 'react'
import styles from './Remove.module.css'
import { useOcean } from '@oceanprotocol/react'
import Header from './Header'
import { toast } from 'react-toastify'
import InputElement from '../../../atoms/Input/InputElement'
import Actions from './Actions'

export default function Remove({
  setShowRemove,
  poolAddress,
  totalPoolTokens
}: {
  setShowRemove: (show: boolean) => void
  poolAddress: string
  totalPoolTokens: string
}): ReactElement {
  const { ocean, accountId } = useOcean()
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>()
  const [txId, setTxId] = useState<string>('')

  async function handleRemoveLiquidity() {
    setIsLoading(true)

    try {
      const result = await ocean.pool.removeOceanLiquidity(
        accountId,
        poolAddress,
        amount,
        totalPoolTokens
      )
      setTxId(result.transactionHash)
    } catch (error) {
      console.error(error.message)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleAmountChange(e: ChangeEvent<HTMLInputElement>) {
    setAmount(e.target.value)
  }

  return (
    <div className={styles.remove}>
      <Header
        title="Remove Liquidity"
        backAction={() => setShowRemove(false)}
      />

      <div className={styles.removeInput}>
        <InputElement
          value={amount}
          name="ocean"
          type="number"
          prefix="OCEAN"
          placeholder="0"
          onChange={handleAmountChange}
        />
      </div>

      {/* <Input name="dt" label={dtSymbol} type="number" placeholder="0" /> */}

      <p>You will receive</p>

      <Actions
        isLoading={isLoading}
        loaderMessage="Removing Liquidity..."
        actionName="Remove"
        action={handleRemoveLiquidity}
        txId={txId}
      />
    </div>
  )
}
