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
import Tooltip from '../../../atoms/Tooltip'
import { ReactComponent as Caret } from '../../../../images/caret.svg'
import { graphql, useStaticQuery } from 'gatsby'
import FormHelp from '../../../atoms/Input/Help'

const contentQuery = graphql`
  query PoolAddQuery {
    content: allFile(filter: { relativePath: { eq: "price.json" } }) {
      edges {
        node {
          childContentJson {
            pool {
              add {
                title
                output {
                  titleIn
                  titleOut
                }
                action
              }
            }
          }
        }
      }
    }
  }
`

export default function Add({
  setShowAdd,
  poolAddress,
  totalPoolTokens,
  totalBalance,
  swapFee,
  dtSymbol,
  dtAddress
}: {
  setShowAdd: (show: boolean) => void
  poolAddress: string
  totalPoolTokens: string
  totalBalance: Balance
  swapFee: string
  dtSymbol: string
  dtAddress: string
}): ReactElement {
  const data = useStaticQuery(contentQuery)
  const content = data.content.edges[0].node.childContentJson.pool.add

  const { ocean, accountId, balance } = useOcean()
  const [amount, setAmount] = useState('')
  const [txId, setTxId] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>()
  const [coin, setCoin] = useState<string>('OCEAN')
  const [dtBalance, setDtBalance] = useState<string>()
  const [amountMax, setAmountMax] = useState<string>()

  const newPoolTokens =
    totalBalance &&
    ((Number(amount) / Number(totalBalance.ocean)) * 100).toFixed(2)

  const newPoolShare =
    totalBalance &&
    ((Number(newPoolTokens) / Number(totalPoolTokens)) * 100).toFixed(2)

  // Get datatoken balance when datatoken selected
  useEffect(() => {
    if (!ocean || coin === 'OCEAN') return

    async function getDtBalance() {
      const dtBalance = await ocean.datatokens.balance(dtAddress, accountId)
      setDtBalance(dtBalance)
    }
    getDtBalance()
  }, [ocean, accountId, dtAddress, coin])

  // Get maximum amount for either OCEAN or datatoken
  useEffect(() => {
    if (!ocean) return

    async function getMaximum() {
      const amountMax =
        coin === 'OCEAN'
          ? await ocean.pool.getOceanMaxAddLiquidity(poolAddress)
          : await ocean.pool.getDTMaxAddLiquidity(poolAddress)
      setAmountMax(amountMax)
    }
    getMaximum()
  }, [ocean, poolAddress, coin])

  async function handleAddLiquidity() {
    setIsLoading(true)

    try {
      const result =
        coin === 'OCEAN'
          ? await ocean.pool.addOceanLiquidity(accountId, poolAddress, amount)
          : await ocean.pool.addDTLiquidity(accountId, poolAddress, amount)

      setTxId(result?.transactionHash)
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
    setAmount(amountMax)
  }

  // TODO: this is only a prototype and is an accessibility nightmare.
  // Needs to be refactored to either use custom select element instead of tippy.js,
  // or use <button> in this implementation.
  // Also needs to be closed when users click an option.
  const CoinSelect = () => (
    <ul className={styles.coinPopover}>
      <li onClick={() => setCoin('OCEAN')}>OCEAN</li>
      <li onClick={() => setCoin(dtSymbol)}>{dtSymbol}</li>
    </ul>
  )

  return (
    <>
      <Header title={content.title} backAction={() => setShowAdd(false)} />

      <div className={styles.addInput}>
        <div className={styles.userLiquidity}>
          <div>
            <span>Available:</span>
            {coin === 'OCEAN' ? (
              <PriceUnit price={balance.ocean} symbol="OCEAN" small />
            ) : (
              <PriceUnit price={dtBalance} symbol={dtSymbol} small />
            )}
          </div>
          <div>
            <span>Maximum:</span>
            <PriceUnit price={amountMax} symbol={coin} small />
          </div>
        </div>

        <InputElement
          value={amount}
          name="coin"
          type="number"
          max={amountMax}
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

        {(balance.ocean || dtBalance) > amount && (
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
          <p>{content.output.titleIn}</p>
          <Token symbol="pool shares" balance={newPoolTokens} />
          <Token symbol="% of pool" balance={newPoolShare} />
        </div>
        <div>
          <p>{content.output.titleOut}</p>
          <Token symbol="% swap fee" balance={swapFee} />
        </div>
      </div>

      <Actions
        isLoading={isLoading}
        loaderMessage="Adding Liquidity..."
        actionName={content.action}
        action={handleAddLiquidity}
        txId={txId}
      />
    </>
  )
}
