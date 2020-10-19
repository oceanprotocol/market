import { DataTokenOptions, useOcean } from '@oceanprotocol/react'
import PriceUnit from '../../../atoms/Price/PriceUnit'
import React, { ReactElement, useEffect, useState } from 'react'
import { PriceOptionsMarket } from '../../../../@types/MetaData'
import { useSiteMetadata } from '../../../../hooks/useSiteMetadata'
import { isCorrectNetwork } from '../../../../utils/wallet'
import Alert from '../../../atoms/Alert'
import FormHelp from '../../../atoms/Input/Help'
import Tooltip from '../../../atoms/Tooltip'
import Wallet from '../../Wallet'
import Coin from './Coin'
import styles from './Dynamic.module.css'
import Fees from './Fees'
import stylesIndex from './index.module.css'

export default function Dynamic({
  ocean,
  priceOptions,
  datatokenOptions,
  generateName,
  content
}: {
  ocean: number
  priceOptions: PriceOptionsMarket
  datatokenOptions: DataTokenOptions
  generateName: () => void
  content: any
}): ReactElement {
  const { appConfig } = useSiteMetadata()
  const { account, balance, networkId, refreshBalance } = useOcean()
  const { weightOnDataToken } = priceOptions

  const [error, setError] = useState<string>()
  const correctNetwork = isCorrectNetwork(networkId)
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
  }, [ocean, networkId, account, balance, correctNetwork, desiredNetworkName])

  // refetch balance periodically
  useEffect(() => {
    if (!account) return

    refreshBalance()
    const balanceInterval = setInterval(() => refreshBalance(), 10000) // 10 sec.

    return () => {
      clearInterval(balanceInterval)
    }
  }, [ocean, networkId, account])

  return (
    <div className={styles.dynamic}>
      <FormHelp className={stylesIndex.help}>{content.info}</FormHelp>

      <aside className={styles.wallet}>
        {balance?.ocean && (
          <PriceUnit
            className={styles.balance}
            price={balance.ocean}
            symbol="OCEAN"
            small
          />
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
