import React, { ReactElement, useState, ChangeEvent, useEffect } from 'react'
import stylesIndex from './index.module.css'
import styles from './Dynamic.module.css'
import FormHelp from '../../../atoms/Input/Help'
import Wallet from '../../Wallet'
import { DataTokenOptions, PriceOptions, useOcean } from '@oceanprotocol/react'
import Alert from '../../../atoms/Alert'
import Coin from './Coin'
import { isCorrectNetwork } from '../../../../utils/wallet'
import { useSiteMetadata } from '../../../../hooks/useSiteMetadata'
import Tooltip from '../../../atoms/Tooltip'
import Fees from './Fees'

export default function Dynamic({
  ocean,
  priceOptions,
  datatokenOptions,
  generateName,
  content
}: {
  ocean: number
  priceOptions: PriceOptions
  datatokenOptions: DataTokenOptions
  generateName: () => void
  content: any
}): ReactElement {
  const { appConfig } = useSiteMetadata()
  const { account, balance, chainId, refreshBalance } = useOcean()
  const { weightOnDataToken } = priceOptions

  const [error, setError] = useState<string>()
  const correctNetwork = isCorrectNetwork(chainId)
  const desiredNetworkName = appConfig.network.replace(/^\w/, (c: string) =>
    c.toUpperCase()
  )

  // Check: account, network & insufficient balance
  useEffect(() => {
    if (!account) {
      setError(`No account connected. Please connect your Web3 wallet.`)
    } else if (!correctNetwork) {
      setError(`Wrong Network. Please connect to ${desiredNetworkName}.`)
    } else if (Number(balance.ocean) < Number(ocean)) {
      setError(`Insufficient balance. You need at least ${ocean} OCEAN`)
    } else {
      setError(undefined)
    }
  }, [ocean, chainId, account, balance, correctNetwork, desiredNetworkName])

  // refetch balance periodically
  useEffect(() => {
    if (!account) return

    refreshBalance()
    const balanceInterval = setInterval(() => refreshBalance(), 10000) // 10 sec.

    return () => {
      clearInterval(balanceInterval)
    }
  }, [ocean, chainId, account])

  return (
    <div className={styles.dynamic}>
      <FormHelp className={stylesIndex.help}>{content.info}</FormHelp>

      <aside className={styles.wallet}>
        {balance?.ocean && (
          <div className={styles.balance}>
            OCEAN <strong>{balance.ocean}</strong>
          </div>
        )}
        <Wallet />
      </aside>

      <h4 className={styles.title}>
        Datatoken Liquidity Pool <Tooltip content={content.tooltips.poolInfo} />
      </h4>

      <div className={styles.tokens}>
        <Coin
          name="price.price"
          datatokenOptions={{ symbol: 'OCEAN', name: 'Ocean Token' }}
          weight={`${100 - Number(Number(weightOnDataToken) * 10)}%`}
        />
        <Coin
          name="price.tokensToMint"
          datatokenOptions={datatokenOptions}
          weight={`${Number(weightOnDataToken) * 10}%`}
          generateName={generateName}
          readOnly
        />
      </div>

      <Fees tooltips={content.tooltips} />

      <footer className={styles.summary}>
        You will get: <br />
        100% share of pool
      </footer>

      {error && (
        <div className={styles.alertArea}>
          <Alert text={error} state="error" />
        </div>
      )}
    </div>
  )
}
