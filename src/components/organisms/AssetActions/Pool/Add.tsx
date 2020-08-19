import React, { ReactElement, useState, ChangeEvent } from 'react'
import styles from './Add.module.css'
import stylesIndex from './index.module.css'
import Button from '../../../atoms/Button'
import Input from '../../../atoms/Input'
import { useOcean } from '@oceanprotocol/react'
import Header from './Header'
import Loader from '../../../atoms/Loader'

export default function Add({
  setShowAdd,
  dtSymbol,
  poolAddress
}: {
  setShowAdd: (show: boolean) => void
  dtSymbol: string
  poolAddress: string
}): ReactElement {
  const { ocean, accountId } = useOcean()
  const [amount, setAmount] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>()
  const [error, setError] = useState<string>()

  async function handleAddLiquidity() {
    setIsLoading(true)
    const result = await ocean.pool.addOceanLiquidity(
      accountId,
      poolAddress,
      amount
    )
    console.log(result)
    setIsLoading(false)
  }

  function handleAmountChange(e: ChangeEvent<HTMLInputElement>) {
    setAmount(e.target.value)
  }

  return (
    <div className={styles.add}>
      <Header title="Add Liquidity" backAction={() => setShowAdd(false)} />

      <Input
        name="ocean"
        label="OCEAN"
        type="number"
        placeholder="0"
        onChange={handleAmountChange}
      />
      {/* <Input name="dt" label={dtSymbol} type="number" placeholder="0" /> */}

      <p>You will receive:</p>

      <div className={stylesIndex.actions}>
        {isLoading ? (
          <Loader message="Adding Liquidity..." />
        ) : (
          <Button
            style="primary"
            size="small"
            onClick={() => handleAddLiquidity()}
          >
            Supply
          </Button>
        )}
      </div>
    </div>
  )
}
