import React, { ReactElement, useState, ChangeEvent } from 'react'
import styles from './Remove.module.css'
import { useOcean } from '@oceanprotocol/react'
import Header from './Header'
import { toast } from 'react-toastify'
import InputElement from '../../../atoms/Input/InputElement'
import Actions from './Actions'
import { Logger } from '@oceanprotocol/lib'
import Button from '../../../atoms/Button'
import PriceUnit from '../../../atoms/Price/PriceUnit'
import { Balance } from '.'

export default function Remove({
  setShowRemove,
  poolAddress,
  totalPoolTokens,
  userLiquidity,
  dtSymbol
}: {
  setShowRemove: (show: boolean) => void
  poolAddress: string
  totalPoolTokens: string
  userLiquidity: Balance
  dtSymbol: string
}): ReactElement {
  const { ocean, accountId } = useOcean()
  const [amountOcean, setAmountOcean] = useState('')
  const [amountDatatoken, setAmountDatatoken] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>()
  const [txId, setTxId] = useState<string>('')

  async function handleRemoveLiquidity() {
    setIsLoading(true)

    // TODO: can remove OCEAN & DT in one transaction?
    // exitswapExternAmountOut? exitswapPoolAmountIn?
    // TODO: when user hits 'use max', use pool.exitPool()

    try {
      const result = await ocean.pool.removeOceanLiquidity(
        accountId,
        poolAddress,
        amountOcean,
        totalPoolTokens
      )
      setTxId(result.transactionHash)
    } catch (error) {
      Logger.error(error.message)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // TODO: enforce correct weight rules
  function handleOceanAmountChange(e: ChangeEvent<HTMLInputElement>) {
    setAmountOcean(e.target.value)
    setAmountDatatoken(`${Number(e.target.value) * 9}`)
  }

  function handleMaxOcean() {
    setAmountOcean(`${userLiquidity.ocean}`)
    setAmountDatatoken(`${userLiquidity.ocean * 9}`)
  }

  function handleMaxDatatoken() {
    setAmountDatatoken(`${userLiquidity.datatoken}`)
    setAmountOcean(`${userLiquidity.ocean / 9}`)
  }

  function handleDatatokenAmountChange(e: ChangeEvent<HTMLInputElement>) {
    setAmountDatatoken(e.target.value)
    setAmountOcean(`${Number(e.target.value) / 9}`)
  }

  return (
    <div className={styles.remove}>
      <Header
        title="Remove Liquidity"
        backAction={() => setShowRemove(false)}
      />

      <form className={styles.removeInput}>
        <fieldset className={styles.removeRow}>
          <div className={styles.userLiquidity}>
            <span>Your pool liquidity: </span>
            <PriceUnit price={`${userLiquidity.ocean}`} symbol="OCEAN" small />
          </div>
          <InputElement
            value={amountOcean}
            name="ocean"
            type="number"
            prefix="OCEAN"
            placeholder="0"
            onChange={handleOceanAmountChange}
          />

          {userLiquidity.ocean > Number(amountOcean) && (
            <Button
              className={styles.buttonMax}
              style="text"
              size="small"
              onClick={handleMaxOcean}
            >
              Use Max
            </Button>
          )}
        </fieldset>

        <fieldset className={styles.removeRow}>
          <div className={styles.userLiquidity}>
            <span>Your pool liquidity: </span>
            <PriceUnit
              price={`${userLiquidity.datatoken}`}
              symbol={dtSymbol}
              small
            />
          </div>
          <InputElement
            value={amountDatatoken}
            name="ocean"
            type="number"
            prefix={dtSymbol}
            placeholder="0"
            onChange={handleDatatokenAmountChange}
          />

          {userLiquidity.datatoken > Number(amountDatatoken) && (
            <Button
              className={styles.buttonMax}
              style="text"
              size="small"
              onClick={handleMaxDatatoken}
            >
              Use Max
            </Button>
          )}
        </fieldset>
      </form>

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
