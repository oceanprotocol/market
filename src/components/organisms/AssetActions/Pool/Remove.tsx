import React, { ReactElement, useState, ChangeEvent } from 'react'
import styles from './Remove.module.css'
import stylesIndex from './index.module.css'
import Button from '../../../atoms/Button'
import { useOcean } from '@oceanprotocol/react'
import Header from './Header'
import { toast } from 'react-toastify'
import Loader from '../../../atoms/Loader'
import InputElement from '../../../atoms/Input/InputElement'
import Alert from '../../../atoms/Alert'

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

      <div className={stylesIndex.actions}>
        {isLoading ? (
          <Loader message="Removing Liquidity..." />
        ) : (
          <Button
            style="primary"
            size="small"
            onClick={() => handleRemoveLiquidity()}
          >
            Remove
          </Button>
        )}
        {txId && (
          <Alert
            text={`Liquidity removed. Transaction ID: ${txId}`}
            state="success"
          />
        )}
      </div>
    </div>
  )
}
