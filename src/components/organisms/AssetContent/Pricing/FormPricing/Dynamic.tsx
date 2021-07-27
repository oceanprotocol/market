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
import { FormikContextType, useFormikContext } from 'formik'
import { PriceOptionsMarket } from '../../../../../@types/MetaData'
import { DDO } from '@oceanprotocol/lib'
import Price from './Price'
import Decimal from 'decimal.js'
import { useOcean } from '../../../../../providers/Ocean'
import { useWeb3 } from '../../../../../providers/Web3'

export default function Dynamic({
  ddo,
  content
}: {
  ddo: DDO
  content: any
}): ReactElement {
  const { networkId } = useWeb3()
  const { account, balance } = useOcean()
  const [firstPrice, setFirstPrice] = useState<string>()

  // Connect with form
  const { values }: FormikContextType<PriceOptionsMarket> = useFormikContext()

  const {
    price,
    weightOnDataToken,
    weightOnOcean,
    swapFee,
    dtAmount,
    oceanAmount
  } = values

  const [error, setError] = useState<string>()

  // Calculate firstPrice whenever user values change
  useEffect(() => {
    if (`${oceanAmount}` === '') return

    const tokenAmountOut = 1
    const weightRatio = new Decimal(weightOnDataToken).div(
      new Decimal(weightOnOcean)
    )
    const diff = new Decimal(dtAmount).minus(tokenAmountOut)
    const y = new Decimal(dtAmount).div(diff)
    const foo = y.pow(weightRatio).minus(new Decimal(1))
    const tokenAmountIn = new Decimal(oceanAmount)
      .times(foo)
      .div(new Decimal(1).minus(new Decimal(swapFee / 100)))
    setFirstPrice(`${tokenAmountIn}`)
  }, [swapFee, weightOnOcean, weightOnDataToken, dtAmount, oceanAmount])

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

      <Price ddo={ddo} firstPrice={firstPrice} />

      <h4 className={styles.title}>
        Datatoken Liquidity Pool <Tooltip content={content.tooltips.poolInfo} />
      </h4>

      <div className={styles.tokens}>
        <Coin
          name="oceanAmount"
          datatokenOptions={{ symbol: 'OCEAN', name: 'Ocean Token' }}
          weight={`${Number(weightOnOcean) * 10}%`}
        />
        <Coin
          name="dtAmount"
          datatokenOptions={{
            symbol: ddo.dataTokenInfo.symbol,
            name: ddo.dataTokenInfo.name
          }}
          weight={`${Number(weightOnDataToken) * 10}%`}
          readOnly
        />
      </div>

      <Fees tooltips={content.tooltips} pricingType="dynamic" />

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
