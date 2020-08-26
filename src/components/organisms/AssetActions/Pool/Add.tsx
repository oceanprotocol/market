import React, { ReactElement, useState, ChangeEvent } from 'react'
import styles from './Add.module.css'
import stylesIndex from './index.module.css'
import Button from '../../../atoms/Button'
import { useOcean } from '@oceanprotocol/react'
import Header from './Header'
import Loader from '../../../atoms/Loader'
import { toast } from 'react-toastify'
import InputElement from '../../../atoms/Input/InputElement'
import Token from './Token'
import { Balance } from './'
import PriceUnit from '../../../atoms/Price/PriceUnit'

function calculatePercent(percent: number, num: number) {
  return (percent / 100) * num
}

export default function Add({
  setShowAdd,
  dtSymbol,
  poolAddress,
  totalPoolTokens,
  totalBalance
}: {
  setShowAdd: (show: boolean) => void
  dtSymbol: string
  poolAddress: string
  totalPoolTokens: string
  totalBalance: Balance
}): ReactElement {
  const { ocean, accountId, balance } = useOcean()
  const [amount, setAmount] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>()
  const [newDtAmount, setNewDtAmount] = useState<string>()

  const newPoolTokens =
    totalBalance &&
    ((Number(amount) / Number(totalBalance.ocean)) * 100).toFixed(2)

  const newPoolShare =
    totalBalance &&
    ((Number(newPoolTokens) / Number(totalPoolTokens)) * 100).toFixed(2)

  async function handleAddLiquidity() {
    setIsLoading(true)

    try {
      const result = await ocean.pool.addOceanLiquidity(
        accountId,
        poolAddress,
        amount
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
    <div className={styles.add}>
      <Header title="Add Liquidity" backAction={() => setShowAdd(false)} />

      <div className={styles.addInput}>
        <div className={styles.userBalance}>
          <span>Available:</span>
          <PriceUnit price={balance.ocean} symbol="OCEAN" small />
        </div>

        <InputElement
          value={amount}
          name="ocean"
          type="number"
          prefix="OCEAN"
          placeholder="0"
          onChange={handleAmountChange}
        />
      </div>

      <div>
        <p>You will receive:</p>
        <Token symbol={dtSymbol} balance={newDtAmount} />
        <Token symbol="BPT" balance={newPoolTokens} />
        <Token symbol="% of pool" balance={newPoolShare} />
      </div>

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
