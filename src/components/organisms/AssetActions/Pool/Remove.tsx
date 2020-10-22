import React, {
  ReactElement,
  useState,
  ChangeEvent,
  useEffect,
  FormEvent
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
import { getMaxValuesRemove } from './utils'
import { graphql, useStaticQuery } from 'gatsby'
import PriceUnit from '../../../atoms/Price/PriceUnit'

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
  poolAddress,
  poolTokens,
  dtSymbol
}: {
  setShowRemove: (show: boolean) => void
  poolAddress: string
  poolTokens: string
  dtSymbol: string
}): ReactElement {
  const data = useStaticQuery(contentQuery)
  const content = data.content.edges[0].node.childContentJson.pool.remove

  const { ocean, accountId } = useOcean()
  const [amountPercent, setAmountPercent] = useState('0')
  const [amountMaxPercent, setAmountMaxPercent] = useState('100')
  const [amountPoolShares, setAmountPoolShares] = useState('0')
  const [amountOcean, setAmountOcean] = useState('0')
  const [amountDatatoken, setAmountDatatoken] = useState('0')
  const [isAdvanced, setIsAdvanced] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>()
  const [txId, setTxId] = useState<string>()

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
              amountDatatoken,
              amountPoolShares
            )

      setTxId(result?.transactionHash)
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

  function handleAdvancedButton(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault()
    setIsAdvanced(!isAdvanced)
  }

  // Check and set outputs when percentage changes
  useEffect(() => {
    if (!ocean || !poolTokens) return

    async function getValues() {
      const amountPoolShares =
        (Number(amountPercent) / 100) * Number(poolTokens)
      setAmountPoolShares(`${amountPoolShares}`)

      if (isAdvanced === true) {
        setAmountMaxPercent('100')

        const tokens = await ocean.pool.getTokensRemovedforPoolShares(
          poolAddress,
          `${amountPoolShares}`
        )
        setAmountOcean(tokens?.oceanAmount)
        setAmountDatatoken(tokens?.dtAmount)
      } else {
        const { amountMaxPercent, amountOcean } = await getMaxValuesRemove(
          ocean,
          poolAddress,
          poolTokens,
          `${amountPoolShares}`
        )
        setAmountMaxPercent(amountMaxPercent)
        setAmountOcean(amountOcean)
      }
    }
    getValues()
  }, [amountPercent, isAdvanced, ocean, poolTokens, poolAddress])

  return (
    <div className={styles.remove}>
      <Header title={content.title} backAction={() => setShowRemove(false)} />

      <form className={styles.removeInput}>
        <div className={styles.userLiquidity}>
          <div>
            <span>Available:</span>
            <PriceUnit price={poolTokens} symbol="pool shares" small />
          </div>
        </div>

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
            {isAdvanced === false && (
              <span
                className={styles.maximum}
              >{`${amountMaxPercent}% max.`}</span>
            )}
          </div>

          <FormHelp>
            {isAdvanced === true ? content.advanced : content.simple}
          </FormHelp>
          <Button style="text" size="small" onClick={handleAdvancedButton}>
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

      <Actions
        isLoading={isLoading}
        loaderMessage="Removing Liquidity..."
        actionName={content.action}
        action={handleRemoveLiquidity}
        txId={txId}
      />
    </div>
  )
}
