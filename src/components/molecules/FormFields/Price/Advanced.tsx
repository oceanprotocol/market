import React, { ReactElement, useState, ChangeEvent, useEffect } from 'react'
import stylesIndex from './index.module.css'
import styles from './Advanced.module.css'
import FormHelp from '../../../atoms/Input/Help'
import Wallet from '../../Wallet'
import { useOcean } from '@oceanprotocol/react'
import Alert from '../../../atoms/Alert'
import Coin from './Coin'
import { isCorrectNetwork } from '../../../../utils/wallet'
import { useSiteMetadata } from '../../../../hooks/useSiteMetadata'

export default function Advanced({
  ocean,
  tokensToMint,
  weightOnDataToken,
  onChange
}: {
  ocean: string
  tokensToMint: number
  weightOnDataToken: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}): ReactElement {
  const { appConfig } = useSiteMetadata()
  const { account, balance, chainId } = useOcean()

  const [error, setError] = useState<string>()
  const correctNetwork = isCorrectNetwork(chainId)
  const desiredNetworkName = appConfig.network.replace(/^\w/, (c: string) =>
    c.toUpperCase()
  )

  // Check: account, network & insuffciant balance
  useEffect(() => {
    if (!account) {
      setError(`No account connected. Please connect your Web3 wallet.`)
    } else if (!correctNetwork) {
      setError(`Wrong Network. Please connect to ${desiredNetworkName}.`)
    } else if (balance.ocean < ocean) {
      setError(`Insufficiant balance. You need at least ${ocean} OCEAN`)
    } else {
      setError(undefined)
    }
  }, [ocean])

  return (
    <div className={stylesIndex.content}>
      <div className={styles.advanced}>
        <FormHelp className={stylesIndex.help}>
          {`Let's create a decentralized, automated market for your data set. A Data Token contract for this data set worth the entered amount of OCEAN will be created. Additionally, you will provide liquidity into a Data Token/OCEAN
          liquidity pool with Balancer.`}
        </FormHelp>

        <aside className={styles.wallet}>
          {balance && balance.ocean && (
            <div className={styles.balance}>
              OCEAN <strong>{balance.ocean}</strong>
            </div>
          )}
          <Wallet />
        </aside>

        <h4 className={styles.title}>Data Token Liquidity Pool</h4>

        <div className={styles.tokens}>
          <Coin
            name="ocean"
            symbol="OCEAN"
            value={ocean}
            weight={`${100 - Number(weightOnDataToken)}%`}
            onChange={onChange}
          />
          <Coin
            name="price.tokensToMint"
            symbol="OCEAN-CAV"
            value={tokensToMint.toString()}
            weight={`${weightOnDataToken}%`}
            readOnly
          />
        </div>

        {error && (
          <div className={styles.alertArea}>
            <Alert text={error} state="error" />
          </div>
        )}
      </div>
    </div>
  )
}
