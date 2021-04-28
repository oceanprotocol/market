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
import { Logger } from '@oceanprotocol/lib'
import Token from './Token'
import FormHelp from '../../../atoms/Input/Help'
import Button from '../../../atoms/Button'
import { getMaxPercentRemove } from './utils'
import { graphql, useStaticQuery } from 'gatsby'
import debounce from 'lodash.debounce'
import UserLiquidity from '../../../atoms/UserLiquidity'
import InputElement from '../../../atoms/Input/InputElement'
import { useOcean } from '../../../../providers/Ocean'
import { useWeb3 } from '../../../../providers/Web3'
import BigNumber from 'bignumber.js'

const contentQuery = graphql`
  query PoolRemoveQuery {
    content: allFile(filter: { relativePath: { eq: "price.json" } }) {
      edges {
        node {
          childContentJson {
            pool {
              remove {
                title
                simple
                advanced
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

export default function Remove({
  setShowRemove,
  refreshInfo,
  poolAddress,
  poolTokens,
  totalPoolTokens,
  dtSymbol
}: {
  setShowRemove: (show: boolean) => void
  refreshInfo: () => void
  poolAddress: string
  poolTokens: string
  totalPoolTokens: string
  dtSymbol: string
}): ReactElement {
  const data = useStaticQuery(contentQuery)
  const content = data.content.edges[0].node.childContentJson.pool.remove

  const slippagePresets = ['5', '10', '15', '25', '50']
  const { accountId } = useWeb3()
  const { ocean } = useOcean()
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

  async function handleRemoveLiquidity() {
    setIsLoading(true)
    try {
      const result =
        isAdvanced === true
          ? await ocean.pool.removePoolLiquidity(
              accountId,
              poolAddress,
              amountPoolShares,
              minDatatokenAmount,
              minOceanAmount
            )
          : await ocean.pool.removeOceanLiquidityWithMinimum(
              accountId,
              poolAddress,
              amountPoolShares,
              minOceanAmount
            )

      setTxId(result?.transactionHash)
      refreshInfo()
    } catch (error) {
      Logger.error(error.message)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Get and set max percentage
  useEffect(() => {
    if (!ocean || !poolTokens) return

    async function getMax() {
      const amountMaxPercent =
        isAdvanced === true
          ? '100'
          : await getMaxPercentRemove(ocean, poolAddress, poolTokens)
      setAmountMaxPercent(amountMaxPercent)
    }
    getMax()
  }, [ocean, isAdvanced, poolAddress, poolTokens])

  const getValues = useRef(
    debounce(async (newAmountPoolShares, isAdvanced) => {
      if (isAdvanced === true) {
        const tokens = await ocean.pool.getTokensRemovedforPoolShares(
          poolAddress,
          `${newAmountPoolShares}`
        )
        setAmountOcean(tokens?.oceanAmount)
        setAmountDatatoken(tokens?.dtAmount)
        return
      }

      const amountOcean = await ocean.pool.getOceanRemovedforPoolShares(
        poolAddress,
        newAmountPoolShares
      )
      setAmountOcean(amountOcean)
    }, 150)
  )
  // Check and set outputs when amountPoolShares changes
  useEffect(() => {
    if (!ocean || !poolTokens) return
    getValues.current(amountPoolShares, isAdvanced)
  }, [
    amountPoolShares,
    isAdvanced,
    ocean,
    poolTokens,
    poolAddress,
    totalPoolTokens
  ])

  async function calculateAmountOfOceansRemoved(amountPoolShares: string) {
    const oceanAmount = await ocean.pool.getOceanRemovedforPoolShares(
      poolAddress,
      amountPoolShares
    )
    setAmountOcean(oceanAmount)
  }

  useEffect(() => {
    const minOceanAmount =
      (Number(amountOcean) * (100 - Number(slippage))) / 100
    const minDatatokenAmount =
      (Number(amountDatatoken) * (100 - Number(slippage))) / 100
    setMinOceanAmount(`${minOceanAmount}`)
    setMinDatatokenAmount(`${minDatatokenAmount}`)
  }, [slippage, amountOcean, amountDatatoken, isAdvanced])

  // Set amountPoolShares based on set slider value
  function handleAmountPercentChange(e: ChangeEvent<HTMLInputElement>) {
    setAmountPercent(e.target.value)
    if (!poolTokens) return

    const amountPoolShares = (Number(e.target.value) / 100) * Number(poolTokens)
    setAmountPoolShares(`${amountPoolShares}`)
    calculateAmountOfOceansRemoved(`${amountPoolShares}`)
  }

  function handleMaxButton(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    setAmountPercent(amountMaxPercent)

    const amountPoolShares = new BigNumber(amountMaxPercent)
      .dividedBy(100)
      .multipliedBy(new BigNumber(poolTokens))

    setAmountPoolShares(`${amountPoolShares}`)
    calculateAmountOfOceansRemoved(`${amountPoolShares}`)
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
      <Header title={content.title} backAction={() => setShowRemove(false)} />

      <form className={styles.removeInput}>
        <UserLiquidity amount={poolTokens} symbol="pool shares" />
        <div className={styles.range}>
          <h3>{amountPercent}%</h3>
          <div className={styles.slider}>
            <input
              type="range"
              min="0"
              max={amountMaxPercent}
              value={amountPercent}
              onChange={handleAmountPercentChange}
            />
            <Button
              style="text"
              size="small"
              className={styles.maximum}
              onClick={handleMaxButton}
            >
              {`${amountMaxPercent}% max`}
            </Button>
          </div>

          <FormHelp>
            {isAdvanced === true ? content.advanced : content.simple}
          </FormHelp>
          <Button
            style="text"
            size="small"
            onClick={handleAdvancedButton}
            className={styles.toggle}
          >
            {isAdvanced === true ? 'Simple' : 'Advanced'}
          </Button>
        </div>
      </form>
      <div className={styles.output}>
        <div>
          <p>{content.output.titleIn}</p>
          <Token symbol="pool shares" balance={amountPoolShares} noIcon />
        </div>
        <div>
          <p>{content.output.titleOut} minimum</p>
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
          value={slippage}
          onChange={handleSlippageChange}
        />
      </div>
      <Actions
        isLoading={isLoading}
        loaderMessage="Removing Liquidity..."
        actionName={content.action}
        action={handleRemoveLiquidity}
        successMessage="Successfully removed liquidity."
        txId={txId}
      />
    </div>
  )
}
