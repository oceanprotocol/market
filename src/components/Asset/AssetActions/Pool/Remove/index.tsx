import React, {
  ReactElement,
  useState,
  ChangeEvent,
  useEffect,
  useRef
} from 'react'
import styles from './index.module.css'
import Header from '../Actions/Header'
import { toast } from 'react-toastify'
import Actions from '../Actions'
import { LoggerInstance, Pool } from '@oceanprotocol/lib'
import Token from '../../../../@shared/Token'
import FormHelp from '@shared/FormInput/Help'
import Button from '@shared/atoms/Button'
import debounce from 'lodash.debounce'
import UserLiquidity from '../../UserLiquidity'
import InputElement from '@shared/FormInput/InputElement'
import { useWeb3 } from '@context/Web3'
import Decimal from 'decimal.js'
import { useAsset } from '@context/Asset'
import content from '../../../../../../content/price.json'
import { usePool } from '@context/Pool'
import { getMax } from './_utils'

const slippagePresets = ['5', '10', '15', '25', '50']

export default function Remove({
  setShowRemove
}: {
  setShowRemove: (show: boolean) => void
}): ReactElement {
  const { accountId, web3 } = useWeb3()
  const { isAssetNetwork } = useAsset()
  const { poolData, poolInfo, poolInfoUser, fetchAllData } = usePool()

  const [amountPercent, setAmountPercent] = useState('0')
  const [amountMaxPercent, setAmountMaxPercent] = useState('100')
  const [amountPoolShares, setAmountPoolShares] = useState('0')
  const [amountOcean, setAmountOcean] = useState('0')
  const [isLoading, setIsLoading] = useState<boolean>()
  const [txId, setTxId] = useState<string>()
  const [slippage, setSlippage] = useState(slippagePresets[0])
  const [minOceanAmount, setMinOceanAmount] = useState<string>('0')
  const [poolInstance, setPoolInstance] = useState<Pool>()

  useEffect(() => {
    if (!web3) return
    setPoolInstance(new Pool(web3))
  }, [web3])

  async function handleRemoveLiquidity() {
    setIsLoading(true)

    try {
      const result = await poolInstance.exitswapPoolAmountIn(
        accountId,
        poolData?.id,
        amountPoolShares,
        minOceanAmount
      )
      setTxId(result?.transactionHash)
      // fetch new data
      fetchAllData()
    } catch (error) {
      LoggerInstance.error(error.message)
      toast.error(error.message)
    } finally {
      // reset slider after transaction
      setAmountPercent('0')
      setAmountOcean('0')
      setMinOceanAmount('0')
      setIsLoading(false)
    }
  }

  //
  // Calculate and set maximum shares user is able to remove
  //
  useEffect(() => {
    if (!accountId || !poolInfoUser || !poolInfo || !poolInstance) return

    getMax(poolInstance, poolInfo, poolInfoUser, poolData).then((max) =>
      setAmountMaxPercent(max)
    )
  }, [accountId, poolInfoUser, poolInfo, poolInstance, poolData])

  const getValues = useRef(
    debounce(async (poolInstance, id, poolInfo, newAmountPoolShares) => {
      if (newAmountPoolShares === '0') {
        setAmountOcean('0')
        return
      }
      const newAmountOcean = await poolInstance.calcSingleOutGivenPoolIn(
        id,
        poolInfo.baseTokenAddress,
        newAmountPoolShares,
        18,
        poolInfo.baseTokenDecimals
      )
      setAmountOcean(newAmountOcean)
    }, 150)
  )

  // Check and set outputs when amountPoolShares changes
  useEffect(() => {
    if (!accountId || !poolInfo || !poolData?.id || !poolInstance) return
    getValues.current(poolInstance, poolData?.id, poolInfo, amountPoolShares)
  }, [amountPoolShares, accountId, poolInfo, poolData?.id, poolInstance])

  useEffect(() => {
    if (!amountOcean || amountPercent === '0') {
      setMinOceanAmount('0')
      return
    }

    const minOceanAmount = new Decimal(amountOcean)
      .mul(new Decimal(100).minus(new Decimal(slippage)))
      .dividedBy(100)
      .toString()

    setMinOceanAmount(minOceanAmount.slice(0, 18))
  }, [slippage, amountOcean, amountPercent])

  // Set amountPoolShares based on set slider value
  function handleAmountPercentChange(e: ChangeEvent<HTMLInputElement>) {
    setAmountPercent(e.target.value)
    if (!poolInfoUser?.poolShares) return

    const amountPoolShares = new Decimal(e.target.value)
      .dividedBy(100)
      .mul(new Decimal(poolInfoUser.poolShares))
      .toString()
    setAmountPoolShares(amountPoolShares)
  }

  function handleMaxButton(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    setAmountPercent(amountMaxPercent)
    const amountPoolShares = new Decimal(amountMaxPercent)
      .dividedBy(100)
      .mul(new Decimal(poolInfoUser?.poolShares))
      .toString()

    setAmountPoolShares(amountPoolShares)
  }

  function handleSlippageChange(e: ChangeEvent<HTMLSelectElement>) {
    setSlippage(e.target.value)
  }

  return (
    <div className={styles.remove}>
      <Header
        title={content.pool.remove.title}
        backAction={() => {
          setShowRemove(false)
          fetchAllData()
        }}
      />

      <form className={styles.removeInput}>
        <UserLiquidity amount={poolInfoUser?.poolShares} symbol="pool shares" />
        <div className={styles.range}>
          <h3>{amountPercent}%</h3>
          <div className={styles.slider}>
            <input
              type="range"
              min="0"
              max={amountMaxPercent}
              disabled={!isAssetNetwork || isLoading}
              value={amountPercent}
              onChange={handleAmountPercentChange}
            />
            <Button
              style="text"
              size="small"
              className={styles.maximum}
              disabled={!isAssetNetwork || isLoading}
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
          <p>{content.pool.remove.output.titleOutExpected}</p>
          <Token
            symbol={poolInfo?.baseTokenSymbol}
            balance={amountOcean}
            noIcon
          />
        </div>
        <div>
          <p>{content.pool.remove.output.titleOutMinimum}</p>
          <Token symbol={poolInfo?.baseTokenSymbol} balance={minOceanAmount} />
        </div>
      </div>
      <div className={styles.slippage}>
        <strong>Slippage Tolerance</strong>
        <InputElement
          name="slippage"
          type="select"
          size="mini"
          postfix="%"
          sortOptions={false}
          options={slippagePresets}
          disabled={!isAssetNetwork || isLoading}
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
        isDisabled={
          !isAssetNetwork ||
          amountPercent === '0' ||
          amountOcean === '0' ||
          poolInfo?.totalPoolTokens === '0'
        }
        txId={txId}
        tokenAddress={poolInfo?.baseTokenAddress}
        tokenSymbol={poolInfo?.baseTokenSymbol}
      />
    </div>
  )
}
