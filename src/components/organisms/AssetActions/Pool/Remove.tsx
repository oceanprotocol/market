import React, { ReactElement, useState, ChangeEvent, useEffect } from 'react'
import styles from './Remove.module.css'
import { useOcean } from '@oceanprotocol/react'
import Header from './Header'
import { toast } from 'react-toastify'
import Actions from './Actions'
import { Logger } from '@oceanprotocol/lib'
import { Balance } from '.'
import Token from './Token'

export default function Remove({
  setShowRemove,
  poolAddress,
  poolTokens,
  totalPoolTokens,
  userLiquidity,
  dtSymbol
}: {
  setShowRemove: (show: boolean) => void
  poolAddress: string
  poolTokens: string
  totalPoolTokens: string
  userLiquidity: Balance
  dtSymbol: string
}): ReactElement {
  const { ocean, accountId } = useOcean()
  const [amountPercent, setAmountPercent] = useState('0')
  const [amountPoolShares, setAmountPoolShares] = useState('0')
  const [amountOcean, setAmountOcean] = useState('0')
  const [amountDatatoken, setAmountDatatoken] = useState('0')
  const [isLoading, setIsLoading] = useState<boolean>()
  const [txId, setTxId] = useState<string>('')

  async function handleRemoveLiquidity() {
    setIsLoading(true)

    try {
      const result = await ocean.pool.removePoolLiquidity(
        accountId,
        poolAddress,
        amountPoolShares
      )
      setTxId(result.transactionHash)
    } catch (error) {
      Logger.error(error.message)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleAmountPercentChange(e: ChangeEvent<HTMLInputElement>) {
    setAmountPercent(e.target.value)
  }

  useEffect(() => {
    if (!ocean) return

    async function getValues() {
      const amountPoolShares =
        (Number(poolTokens) / Number(amountPercent)) * 100
      setAmountPoolShares(`${amountPoolShares}`)

      const amountOcean = await ocean.pool.getPoolSharesForRemoveOcean(
        poolAddress,
        `${amountPoolShares}`
      )
      setAmountOcean(amountOcean)

      const amountDatatoken = await ocean.pool.getPoolSharesForRemoveDT(
        poolAddress,
        `${amountPoolShares}`
      )
      setAmountDatatoken(amountDatatoken)
    }
    getValues()
  }, [amountPercent, ocean, poolTokens, poolAddress])

  return (
    <div className={styles.remove}>
      <Header
        title="Remove Liquidity"
        backAction={() => setShowRemove(false)}
      />

      <form className={styles.removeInput}>
        <div className={styles.range}>
          <h3>{amountPercent}%</h3>
          <input
            type="range"
            min="0"
            max="100"
            step="25"
            value={amountPercent}
            onChange={handleAmountPercentChange}
          />
        </div>
      </form>

      <p>You will receive</p>

      <Token symbol="OCEAN" balance={amountOcean} />
      <Token symbol={dtSymbol} balance={amountDatatoken} />

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
