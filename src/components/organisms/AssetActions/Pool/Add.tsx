import React, { ReactElement, useState, ChangeEvent, useEffect } from 'react'
import styles from './Add.module.css'
import { useOcean } from '@oceanprotocol/react'
import Header from './Header'
import { toast } from 'react-toastify'
import InputElement from '../../../atoms/Input/InputElement'
import Button from '../../../atoms/Button'
import Token from './Token'
import { Balance } from './'
import PriceUnit from '../../../atoms/Price/PriceUnit'
import Actions from './Actions'
import { useUserPreferences } from '../../../../providers/UserPreferences'

export default function Add({
  setShowAdd,
  poolAddress,
  totalPoolTokens,
  totalBalance,
  liquidityProviderFee
}: {
  setShowAdd: (show: boolean) => void
  poolAddress: string
  totalPoolTokens: string
  totalBalance: Balance
  liquidityProviderFee: string
}): ReactElement {
  const { debug } = useUserPreferences()
  const { ocean, accountId, balance } = useOcean()
  const [amount, setAmount] = useState('')
  const [txId, setTxId] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>()

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

  function handleMax() {
    setAmount(balance.ocean)
  }

  return (
    <div className={styles.add}>
      <Header title="Add Liquidity" backAction={() => setShowAdd(false)} />

      <div className={styles.addInput}>
        <div className={styles.userBalance}>
          <span>Available: </span>
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

        {balance.ocean > amount && (
          <Button
            className={styles.buttonMax}
            style="text"
            size="small"
            onClick={handleMax}
          >
            Use Max
          </Button>
        )}
      </div>

      <div className={styles.output}>
        <div>
          <p>You will receive</p>
          {debug === true && <Token symbol="BPT" balance={newPoolTokens} />}
          <Token symbol="% of pool" balance={newPoolShare} />
        </div>
        <div>
          <p>You will earn</p>
          <Token
            symbol="% of each pool transaction"
            balance={liquidityProviderFee}
          />
        </div>
      </div>

      <Actions
        isLoading={isLoading}
        loaderMessage="Adding Liquidity..."
        actionName="Supply"
        action={handleAddLiquidity}
        txId={txId}
      />
    </div>
  )
}
