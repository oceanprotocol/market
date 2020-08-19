import React, { ReactElement, useState, ChangeEvent } from 'react'
import styles from './Remove.module.css'
import Button from '../../../atoms/Button'
import Input from '../../../atoms/Input'
import { useOcean } from '@oceanprotocol/react'
import Header from './Header'

export default function Remove({
  setShowRemove,
  poolAddress
}: {
  setShowRemove: (show: boolean) => void
  poolAddress: string
}): ReactElement {
  const { ocean, accountId } = useOcean()
  const [amount, setAmount] = useState<string>()

  const maximumPoolShares = '?'

  async function handleRemoveLiquidity() {
    await ocean.pool.removeOceanLiquidity(
      accountId,
      poolAddress,
      amount,
      maximumPoolShares
    )
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

      <Input
        name="ocean"
        label="OCEAN"
        type="number"
        placeholder="0"
        onChange={handleAmountChange}
      />
      {/* <Input name="dt" label={dtSymbol} type="number" placeholder="0" /> */}

      <p>You will receive:</p>

      <Button
        style="primary"
        size="small"
        onClick={() => handleRemoveLiquidity()}
      >
        Remove
      </Button>
    </div>
  )
}
