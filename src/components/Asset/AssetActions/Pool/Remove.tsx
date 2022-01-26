import React, {
  ReactElement,
  useState,
  ChangeEvent,
  useEffect,
  useRef
} from 'react'
import styles from './Remove.module.css'
import Header from './Header'
import { toast } from 'react-toastify'
import Actions from './Actions'
import { LoggerInstance, Pool } from '@oceanprotocol/lib'
import Token from './Token'
import FormHelp from '@shared/FormInput/Help'
import Button from '@shared/atoms/Button'
import { getMaxPercentRemove } from './utils'
import debounce from 'lodash.debounce'
import UserLiquidity from '../UserLiquidity'
import InputElement from '@shared/FormInput/InputElement'
import { useWeb3 } from '@context/Web3'
import Decimal from 'decimal.js'
import { useAsset } from '@context/Asset'
import content from '../../../../../content/price.json'

const slippagePresets = ['5', '10', '15', '25', '50']

export default function Remove({
  setShowRemove,
  poolAddress,
  poolTokens,
  totalPoolTokens,
  tokenOutAddress,
  tokenOutSymbol,
  fetchAllData
}: {
  setShowRemove: (show: boolean) => void
  poolAddress: string
  poolTokens: string
  totalPoolTokens: string
  tokenOutAddress: string
  tokenOutSymbol: string
  fetchAllData: () => void
}): ReactElement {
  const { accountId, web3 } = useWeb3()
  const { isAssetNetwork } = useAsset()

  const [amountPercent, setAmountPercent] = useState('0')
  const [amountMaxPercent, setAmountMaxPercent] = useState('100')
  const [amountPoolShares, setAmountPoolShares] = useState('0')
  const [amountOcean, setAmountOcean] = useState('0')
  const [isLoading, setIsLoading] = useState<boolean>()
  const [txId, setTxId] = useState<string>()
  const [slippage, setSlippage] = useState<string>('5')
  const [minOceanAmount, setMinOceanAmount] = useState<string>('0')

  // TODO: precision needs to be set based on baseToken decimals
  Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })
  const poolInstance = new Pool(web3, LoggerInstance)

  async function handleRemoveLiquidity() {
    setIsLoading(true)

    try {
      const result = await poolInstance.exitswapPoolAmountIn(
        accountId,
        poolAddress,
        tokenOutAddress,
        amountPoolShares,
        minOceanAmount
      )
      setTxId(result?.transactionHash)
      fetchAllData()
    } catch (error) {
      LoggerInstance.error(error.message)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // TODO: Get and set max percentage
  useEffect(() => {
    if (!accountId || !poolTokens) return

    async function getMax() {
      // const amountMaxPercent = await getMaxPercentRemove(poolAddress, poolTokens)
      // setAmountMaxPercent(amountMaxPercent)
    }
    getMax()
  }, [accountId, poolAddress, poolTokens])

  const getValues = useRef(
    debounce(async (newAmountPoolShares) => {
      const newAmountOcean = await poolInstance.calcSingleOutGivenPoolIn(
        poolAddress,
        tokenOutAddress,
        newAmountPoolShares
      )
      setAmountOcean(newAmountOcean)
    }, 150)
  )

  // Check and set outputs when amountPoolShares changes
  useEffect(() => {
    if (!accountId || !poolTokens) return
    getValues.current(amountPoolShares)
  }, [amountPoolShares, accountId, poolTokens, poolAddress, totalPoolTokens])

  useEffect(() => {
    const minOceanAmount = new Decimal(amountOcean)
      .mul(new Decimal(100).minus(new Decimal(slippage)))
      .dividedBy(100)
      .toString()

    setMinOceanAmount(minOceanAmount.slice(0, 18))
  }, [slippage, amountOcean])

  // Set amountPoolShares based on set slider value
  function handleAmountPercentChange(e: ChangeEvent<HTMLInputElement>) {
    setAmountPercent(e.target.value)
    if (!poolTokens) return

    const amountPoolShares = new Decimal(e.target.value)
      .dividedBy(100)
      .mul(new Decimal(poolTokens))
      .toString()

    setAmountPoolShares(`${amountPoolShares.slice(0, 18)}`)
  }

  function handleMaxButton(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    setAmountPercent(amountMaxPercent)

    const amountPoolShares = new Decimal(amountMaxPercent)
      .dividedBy(100)
      .mul(new Decimal(poolTokens))
      .toString()

    setAmountPoolShares(`${amountPoolShares.slice(0, 18)}`)
  }

  function handleSlippageChange(e: ChangeEvent<HTMLSelectElement>) {
    setSlippage(e.target.value)
  }

  return (
    <div className={styles.remove}>
      <Header
        title={content.pool.remove.title}
        backAction={() => setShowRemove(false)}
      />

      <form className={styles.removeInput}>
        <UserLiquidity amount={poolTokens} symbol="pool shares" />
        <div className={styles.range}>
          <h3>{amountPercent}%</h3>
          <div className={styles.slider}>
            <input
              type="range"
              min="0"
              max={amountMaxPercent}
              disabled={!isAssetNetwork}
              value={amountPercent}
              onChange={handleAmountPercentChange}
            />
            <Button
              style="text"
              size="small"
              className={styles.maximum}
              disabled={!isAssetNetwork}
              onClick={handleMaxButton}
            >
              {`${amountMaxPercent}% max`}
            </Button>
          </div>

          <FormHelp>{content.pool.remove.simple}</FormHelp>
        </div>
      </form>
      <div className={styles.output}>
        <div>
          <p>{content.pool.remove.output.titleIn}</p>
          <Token symbol="pool shares" balance={amountPoolShares} noIcon />
        </div>
        <div>
          <p>{content.pool.remove.output.titleOut} minimum</p>
          <Token symbol={tokenOutSymbol} balance={minOceanAmount} />
        </div>
      </div>
      <div className={styles.slippage}>
        <strong>Expected price impact</strong>
        <InputElement
          name="slippage"
          type="select"
          size="mini"
          postfix="%"
          sortOptions={false}
          options={slippagePresets}
          disabled={!isAssetNetwork}
          value={slippage}
          onChange={handleSlippageChange}
        />
      </div>
      <Actions
        isLoading={isLoading}
        loaderMessage="Removing Liquidity..."
        actionName={content.pool.remove.action}
        action={handleRemoveLiquidity}
        successMessage="Successfully removed liquidity."
        isDisabled={!isAssetNetwork}
        txId={txId}
        tokenAddress={tokenOutAddress}
        tokenSymbol={tokenOutSymbol}
      />
    </div>
  )
}
