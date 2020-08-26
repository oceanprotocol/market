import React, { ReactElement, useState, ChangeEvent } from 'react'
import styles from './Remove.module.css'
import stylesIndex from './index.module.css'
import Button from '../../../atoms/Button'
import Input from '../../../atoms/Input'
import { useOcean } from '@oceanprotocol/react'
import Header from './Header'
import { toast } from 'react-toastify'
import Loader from '../../../atoms/Loader'
import InputElement from '../../../atoms/Input/InputElement'

export default function Remove({
  setShowRemove,
  poolAddress
}: {
  setShowRemove: (show: boolean) => void
  poolAddress: string
}): ReactElement {
  const { ocean, accountId } = useOcean()
  const [amount, setAmount] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>()

  const maximumPoolShares = '?'

  async function handleRemoveLiquidity() {
    setIsLoading(true)

    try {
      const result = await ocean.pool.removeOceanLiquidity(
        accountId,
        poolAddress,
        amount,
        maximumPoolShares
      )
      console.log(result)
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

      <p>You will receive:</p>

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
      </div>
    </div>
  )
}
