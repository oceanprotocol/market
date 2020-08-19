import React, { ReactElement, useState, ChangeEvent } from 'react'
import styles from './Add.module.css'
import stylesIndex from './index.module.css'
import Button from '../../../atoms/Button'
import Input from '../../../atoms/Input'
import { useOcean } from '@oceanprotocol/react'

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

  async function handleAddLiquidity() {
    await ocean.pool.addOceanLiquidity(accountId, poolAddress, amount)
  }

  function handleAmountChange(e: ChangeEvent<HTMLInputElement>) {
    setAmount(e.target.value)
  }

  return (
    <div className={styles.add}>
      <Button
        className={stylesIndex.back}
        style="text"
        size="small"
        onClick={() => setShowAdd(false)}
      >
        ← Back
      </Button>
      <h3 className={stylesIndex.title}>Add Liquidity</h3>

      <Input
        name="ocean"
        label="OCEAN"
        type="number"
        placeholder="0"
        onChange={handleAmountChange}
      />
      {/* <Input name="dt" label={dtSymbol} type="number" placeholder="0" /> */}

      <p>You will receive:</p>

      <Button style="primary" size="small" onClick={() => handleAddLiquidity()}>
        Add
      </Button>
    </div>
  )
}
