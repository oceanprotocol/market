import React, {
  ReactElement,
  useState,
  ChangeEvent,
  useEffect,
  FormEvent,
  useRef
} from 'react'
import styles from './Remove.module.css'
import { useOcean } from '@oceanprotocol/react'
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

  const { ocean, accountId } = useOcean()
  const [amountPercent, setAmountPercent] = useState('0')
  const [amountMaxPercent, setAmountMaxPercent] = useState('100')
  const [amountPoolShares, setAmountPoolShares] = useState('0')
  const [amountOcean, setAmountOcean] = useState('0')
  const [amountDatatoken, setAmountDatatoken] = useState('0')
  const [isAdvanced, setIsAdvanced] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>()
  const [txId, setTxId] = useState<string>()
  const [oceanAmount, setOceanAmount] = useState<string>('0')
  const [slippage, setSlippage] = useState<string>('5')
  const [maxShares, setMaxShares] = useState<string>('0')

  async function handleRemoveLiquidity() {
    setIsLoading(true)

    try {
      const result =
        isAdvanced === true
          ? await ocean.pool.removePoolLiquidity(
              accountId,
              poolAddress,
              amountPoolShares
            )
          : await ocean.pool.removeOceanLiquidity(
              accountId,
              poolAddress,
              amountOcean,
              maxShares
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

  // Set amountPoolShares based on set slider value
  // function handleAmountPercentChange(e: ChangeEvent<HTMLInputElement>) {
  //   setAmountPercent(e.target.value)
  //   if (!poolTokens) return

  //   const amountPoolShares = (Number(e.target.value) / 100) * Number(poolTokens)
  //   setAmountPoolShares(`${amountPoolShares}`)
  // }

  // function handleMaxButton(e: ChangeEvent<HTMLInputElement>) {
  //   e.preventDefault()
  //   setAmountPercent(amountMaxPercent)

  //   const amountPoolShares =
  //     (Number(amountMaxPercent) / 100) * Number(poolTokens)
  //   setAmountPoolShares(`${amountPoolShares}`)
  // }

  function handleAdvancedButton(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault()
    setIsAdvanced(!isAdvanced)

    setAmountPoolShares('0')
    setAmountPercent('0')
    setAmountOcean('0')

    if (isAdvanced === true) {
      setAmountDatatoken('0')
    }
  }

  async function computePoolSharesNeeded() {
    const poolShares = await ocean.pool.getPoolSharesRequiredToRemoveOcean(
      poolAddress,
      oceanAmount
    )
    setAmountPoolShares(poolShares)
  }

  function handleOceanAmountChange(e: ChangeEvent<HTMLSelectElement>) {
    setOceanAmount(e.target.value.toString())
    computePoolSharesNeeded()
  }

  function handleSlippageChange(e: ChangeEvent<HTMLSelectElement>) {
    setSlippage(e.target.value.toString())
    const maximumShares =
      Number(amountPoolShares) * (100 + Number(e.target.value))
    setMaxShares(maximumShares.toString())
  }

  return (
    <div className={styles.remove}>
      <Header title={content.title} backAction={() => setShowRemove(false)} />

      <form className={styles.removeInput}>
        <UserLiquidity amount={poolTokens} symbol="pool shares" />
        <InputElement
          name="oceanAmount"
          type="number"
          placeholder="0"
          value={oceanAmount}
          prefix="OCEAN"
          onChange={handleOceanAmountChange}
        />
        <div className={styles.range}>
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
          <p>{content.output.titleOut}</p>
          <Token symbol="OCEAN" balance={amountOcean} />
          {isAdvanced === true && (
            <Token symbol={dtSymbol} balance={amountDatatoken} />
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
