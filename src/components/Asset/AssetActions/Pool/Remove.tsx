import React, {
  ReactElement,
  useState,
  ChangeEvent,
  useEffect,
  FormEvent,
  useRef
} from 'react'
import styles from './Remove.module.css'
import Header from './Header'
import { toast } from 'react-toastify'
import Actions from './Actions'
import { LoggerInstance } from '@oceanprotocol/lib'
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

export default function Remove({
  setShowRemove,
  poolAddress,
  poolTokens,
  totalPoolTokens,
  dtSymbol
}: {
  setShowRemove: (show: boolean) => void
  poolAddress: string
  poolTokens: string
  totalPoolTokens: string
  dtSymbol: string
}): ReactElement {
  const slippagePresets = ['5', '10', '15', '25', '50']
  const { accountId } = useWeb3()
  const { isAssetNetwork } = useAsset()
  const [amountPercent, setAmountPercent] = useState('0')
  const [amountMaxPercent, setAmountMaxPercent] = useState('100')
  const [amountPoolShares, setAmountPoolShares] = useState('0')
  const [amountOcean, setAmountOcean] = useState('0')
  const [amountDatatoken, setAmountDatatoken] = useState('0')
  const [isAdvanced, setIsAdvanced] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>()
  const [txId, setTxId] = useState<string>()
  const [slippage, setSlippage] = useState<string>('5')
  const [minOceanAmount, setMinOceanAmount] = useState<string>('0')
  const [minDatatokenAmount, setMinDatatokenAmount] = useState<string>('0')

  Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })

  async function handleRemoveLiquidity() {
    setIsLoading(true)
    try {
      // const result =
      //   isAdvanced === true
      //     ? await ocean.pool.removePoolLiquidity(
      //         accountId,
      //         poolAddress,
      //         amountPoolShares,
      //         minDatatokenAmount,
      //         minOceanAmount
      //       )
      //     : await ocean.pool.removeOceanLiquidityWithMinimum(
      //         accountId,
      //         poolAddress,
      //         amountPoolShares,
      //         minOceanAmount
      //       )
      // setTxId(result?.transactionHash)
    } catch (error) {
      LoggerInstance.error(error.message)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Get and set max percentage
  useEffect(() => {
    if (!accountId || !poolTokens) return

    async function getMax() {
      // const amountMaxPercent =
      //   isAdvanced === true
      //     ? '100'
      //     : await getMaxPercentRemove(poolAddress, poolTokens)
      // setAmountMaxPercent(amountMaxPercent)
    }
    getMax()
  }, [accountId, isAdvanced, poolAddress, poolTokens])

  const getValues = useRef(
    debounce(async (newAmountPoolShares, isAdvanced) => {
      // if (isAdvanced === true) {
      //   const tokens = await ocean.pool.getTokensRemovedforPoolShares(
      //     poolAddress,
      //     `${newAmountPoolShares}`
      //   )
      //   setAmountOcean(tokens?.oceanAmount)
      //   setAmountDatatoken(tokens?.dtAmount)
      //   return
      // }
      // const amountOcean = await ocean.pool.getOceanRemovedforPoolShares(
      //   poolAddress,
      //   newAmountPoolShares
      // )
      // setAmountOcean(amountOcean)
    }, 150)
  )
  // Check and set outputs when amountPoolShares changes
  useEffect(() => {
    if (!accountId || !poolTokens) return
    getValues.current(amountPoolShares, isAdvanced)
  }, [
    amountPoolShares,
    isAdvanced,
    accountId,
    poolTokens,
    poolAddress,
    totalPoolTokens
  ])

  useEffect(() => {
    const minOceanAmount = new Decimal(amountOcean)
      .mul(new Decimal(100).minus(new Decimal(slippage)))
      .dividedBy(100)
      .toString()

    const minDatatokenAmount = new Decimal(amountDatatoken)
      .mul(new Decimal(100).minus(new Decimal(slippage)))
      .dividedBy(100)
      .toString()

    setMinOceanAmount(minOceanAmount.slice(0, 18))
    setMinDatatokenAmount(minDatatokenAmount.slice(0, 18))
  }, [slippage, amountOcean, amountDatatoken, isAdvanced])

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

  function handleAdvancedButton(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault()
    setIsAdvanced(!isAdvanced)

    setAmountPoolShares('0')
    setAmountPercent('0')
    setAmountOcean('0')
    setSlippage('5')
    setMinOceanAmount('0')
    setMinDatatokenAmount('0')

    if (isAdvanced === true) {
      setAmountDatatoken('0')
    }
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

          <FormHelp>
            {isAdvanced === true
              ? content.pool.remove.advanced
              : content.pool.remove.simple}
          </FormHelp>
          <Button
            style="text"
            size="small"
            onClick={handleAdvancedButton}
            disabled={!isAssetNetwork}
            className={styles.toggle}
          >
            {isAdvanced === true ? 'Simple' : 'Advanced'}
          </Button>
        </div>
      </form>
      <div className={styles.output}>
        <div>
          <p>{content.pool.remove.output.titleIn}</p>
          <Token symbol="pool shares" balance={amountPoolShares} noIcon />
        </div>
        <div>
          <p>{content.pool.remove.output.titleOut} minimum</p>
          {isAdvanced === true ? (
            <>
              <Token symbol="OCEAN" balance={minOceanAmount} />
              <Token symbol={dtSymbol} balance={minDatatokenAmount} />
            </>
          ) : (
            <Token symbol="OCEAN" balance={minOceanAmount} />
          )}
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
      />
    </div>
  )
}
