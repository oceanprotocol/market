import React, { ReactElement, useState, ChangeEvent } from 'react'
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
import Tooltip from '../../../atoms/Tooltip'
import { ReactComponent as Caret } from '../../../../images/caret.svg'

export default function Add({
  setShowAdd,
  poolAddress,
  totalPoolTokens,
  totalBalance,
  swapFee,
  dtSymbol
}: {
  setShowAdd: (show: boolean) => void
  poolAddress: string
  totalPoolTokens: string
  totalBalance: Balance
  swapFee: string
  dtSymbol: string
}): ReactElement {
  const { debug } = useUserPreferences()
  const { ocean, accountId, balance } = useOcean()
  const [amount, setAmount] = useState('')
  const [txId, setTxId] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>()
  const [coin, setCoin] = useState<string>('OCEAN')

  const newPoolTokens =
    totalBalance &&
    ((Number(amount) / Number(totalBalance.ocean)) * 100).toFixed(2)

  const newPoolShare =
    totalBalance &&
    ((Number(newPoolTokens) / Number(totalPoolTokens)) * 100).toFixed(2)

  async function handleAddLiquidity() {
    setIsLoading(true)

    const addMethod =
      coin === 'OCEAN'
        ? ocean.pool.addOceanLiquidity
        : ocean.pool.addDTLiquidity

    try {
      const result = await addMethod(accountId, poolAddress, amount)
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

  const CoinSelect = () => (
    <ul className={styles.coinPopover}>
      <li onClick={() => setCoin('OCEAN')}>OCEAN</li>
      <li onClick={() => setCoin(dtSymbol)}>{dtSymbol}</li>
    </ul>
  )

  return (
    <>
      <Header title="Add Liquidity" backAction={() => setShowAdd(false)} />

      <div className={styles.addInput}>
        <div className={styles.userLiquidity}>
          <span>Available: </span>
          <PriceUnit price={balance.ocean} symbol="OCEAN" small />
        </div>

        <InputElement
          value={amount}
          name="coin"
          type="number"
          prefix={
            <Tooltip
              content={<CoinSelect />}
              trigger="click focus"
              className={styles.coinswitch}
              placement="bottom"
            >
              {coin}
              <Caret aria-hidden="true" />
            </Tooltip>
          }
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
          <Token symbol="% swap fee" balance={swapFee} />
        </div>
      </div>

      <Actions
        isLoading={isLoading}
        loaderMessage="Adding Liquidity..."
        actionName="Supply"
        action={handleAddLiquidity}
        txId={txId}
      />
    </>
  )
}
