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
import InputElement from '../../../atoms/Input/InputElement'
import Label from '../../../atoms/Input/Label'
import Tooltip from '../../../atoms/Tooltip'

export default function Dynamic({
  ocean,
  priceOptions,
  datatokenOptions,
  onOceanChange,
  onLiquidityProviderFeeChange,
  generateName,
  content
}: {
  ocean: string
  priceOptions: PriceOptions
  datatokenOptions: DataTokenOptions
  onOceanChange: (event: ChangeEvent<HTMLInputElement>) => void
  onLiquidityProviderFeeChange: (event: ChangeEvent<HTMLInputElement>) => void
  generateName: () => void
  content: any
}): ReactElement {
  const { appConfig } = useSiteMetadata()
  const { account, balance, chainId, refreshBalance } = useOcean()
  const { weightOnDataToken, tokensToMint, liquidityProviderFee } = priceOptions

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
    } else if (Number(balance.ocean) < Number(ocean)) {
      setError(`Insufficiant balance. You need at least ${ocean} OCEAN`)
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
        Data Token Liquidity Pool{' '}
        <Tooltip content={content.tooltips.poolInfo} />
      </h4>

      <div className={styles.tokens}>
        <Coin
          name="ocean"
          datatokenOptions={{ symbol: 'OCEAN', name: 'Ocean Token' }}
          value={ocean}
          weight={`${100 - Number(Number(weightOnDataToken) * 10)}%`}
          onOceanChange={onOceanChange}
        />
        <Coin
          name="tokensToMint"
          datatokenOptions={datatokenOptions}
          value={tokensToMint.toString()}
          weight={`${Number(weightOnDataToken) * 10}%`}
          generateName={generateName}
          readOnly
        />
      </div>

      <div className={styles.fees}>
        <div>
          <Label htmlFor="liquidityProviderFee">
            Liquidity Provider Fee{' '}
            <Tooltip content={content.tooltips.liquidityProviderFee} />
          </Label>
          <InputElement
            type="number"
            value={liquidityProviderFee}
            name="liquidityProviderFee"
            postfix="%"
            onChange={onLiquidityProviderFeeChange}
            min="0.1"
            max="0.9"
            step="0.1"
            small
          />
        </div>
        <div>
          <Label htmlFor="communityFee">
            Community Fee <Tooltip content={content.tooltips.communityFee} />
          </Label>
          <InputElement
            value="0.1"
            name="communityFee"
            postfix="%"
            readOnly
            small
          />
        </div>
        <div>
          <Label htmlFor="marketplaceFee">
            Marketplace Fee{' '}
            <Tooltip content={content.tooltips.marketplaceFee} />
          </Label>
          <InputElement
            value={appConfig.marketFeeAmount}
            name="marketplaceFee"
            postfix="%"
            readOnly
            small
          />
        </div>
      </div>

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
