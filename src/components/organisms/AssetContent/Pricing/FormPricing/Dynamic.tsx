import { useOcean, usePricing } from '@oceanprotocol/react'
import PriceUnit from '../../../../atoms/Price/PriceUnit'
import React, { ReactElement, useEffect, useState } from 'react'
import Alert from '../../../../atoms/Alert'
import FormHelp from '../../../../atoms/Input/Help'
import Tooltip from '../../../../atoms/Tooltip'
import Wallet from '../../../../molecules/Wallet'
import Coin from './Coin'
import styles from './Dynamic.module.css'
import Fees from './Fees'
import stylesIndex from './index.module.css'
import { useFormikContext } from 'formik'
import { PriceOptionsMarket } from '../../../../../@types/MetaData'
import { DDO } from '@oceanprotocol/lib'
import Fixed from './Fixed'
import Price from './Price'

export default function Dynamic({
  ddo,
  content
}: {
  ddo: DDO
  content: any
}): ReactElement {
  const { account, balance, networkId, refreshBalance } = useOcean()
  const { dtSymbol, dtName } = usePricing(ddo)

  // Connect with form
  const { values } = useFormikContext()
  const { price, weightOnDataToken } = values as PriceOptionsMarket

  const [error, setError] = useState<string>()

  // Check: account, network & insufficient balance
  useEffect(() => {
    if (!account) {
      setError(`No account connected. Please connect your Web3 wallet.`)
    } else if (Number(balance.ocean) < Number(price)) {
      setError(`Insufficient balance. You need at least ${price} OCEAN`)
    } else {
      setError(undefined)
    }
  }, [price, networkId, account, balance])

  // refetch balance periodically
  useEffect(() => {
    if (!account) return

    refreshBalance()
    const balanceInterval = setInterval(() => refreshBalance(), 10000) // 10 sec.

    return () => {
      clearInterval(balanceInterval)
    }
  }, [networkId, account])

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
        Price <Tooltip content={content.tooltips.poolInfo} />
      </h4>

      <Price ddo={ddo} />

      <h4 className={styles.title}>
        Datatoken Liquidity Pool <Tooltip content={content.tooltips.poolInfo} />
      </h4>

      <div className={styles.tokens}>
        <Coin
          name="oceanAmount"
          datatokenOptions={{ symbol: 'OCEAN', name: 'Ocean Token' }}
          weight={`${100 - Number(Number(weightOnDataToken) * 10)}%`}
        />
        <Coin
          name="dtAmount"
          datatokenOptions={{ symbol: dtSymbol, name: dtName }}
          weight={`${Number(weightOnDataToken) * 10}%`}
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
