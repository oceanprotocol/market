import React, { ReactElement, useState, ChangeEvent, useEffect } from 'react'
import styles from './Remove.module.css'
import { useOcean } from '@oceanprotocol/react'
import Header from './Header'
import { toast } from 'react-toastify'
import Actions from './Actions'
import { Logger } from '@oceanprotocol/lib'
import Token from './Token'
import FormHelp from '../../../atoms/Input/Help'

export default function Remove({
  setShowRemove,
  poolAddress,
  poolTokens
}: {
  setShowRemove: (show: boolean) => void
  poolAddress: string
  poolTokens: string
}): ReactElement {
  const { ocean, accountId } = useOcean()
  const [amountPercent, setAmountPercent] = useState('0')
  const [amountPoolShares, setAmountPoolShares] = useState('0')
  const [amountOcean, setAmountOcean] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>()
  const [txId, setTxId] = useState<string>()

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

  // Check and set outputs when percentage changes
  useEffect(() => {
    if (!ocean || !poolTokens) return

    // TODO: check max amount to be able to remove
    // getOceanMaxRemoveLiquidity()

    async function getValues() {
      const amountPoolShares =
        (Number(amountPercent) / 100) * Number(poolTokens)
      setAmountPoolShares(`${amountPoolShares}`)

      const amountOcean = await ocean.pool.getOceanRemovedforPoolShares(
        poolAddress,
        `${amountPoolShares}`
      )
      setAmountOcean(amountOcean)
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
          <FormHelp>
            Set the amount of your pool shares to spend. You will get the
            equivalent value in OCEAN.
          </FormHelp>
        </div>
      </form>

      <p>You will spend</p>

      <Token symbol="pool shares" balance={amountPoolShares} noIcon />

      <p>You will receive</p>

      <Token symbol="OCEAN" balance={amountOcean} />

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
