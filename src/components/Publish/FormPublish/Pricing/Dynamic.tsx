import PriceUnit from '@shared/Price/PriceUnit'
import React, { ReactElement, useEffect, useState } from 'react'
import Alert from '@shared/atoms/Alert'
import FormHelp from '@shared/Form/Input/Help'
import Tooltip from '@shared/atoms/Tooltip'
import Wallet from '../../../Header/Wallet'
import Coin from './Coin'
import styles from './Dynamic.module.css'
import Fees from './Fees'
import { FormikContextType, useFormikContext } from 'formik'
import Price from './Price'
import Decimal from 'decimal.js'
import { useOcean } from '@context/Ocean'
import { useWeb3 } from '@context/Web3'
import { FormPublishData } from '../../_types'

export default function Dynamic({ content }: { content: any }): ReactElement {
  const { networkId, balance } = useWeb3()
  const { account } = useOcean()
  const [firstPrice, setFirstPrice] = useState<string>()

  // Connect with form
  const { values }: FormikContextType<FormPublishData> = useFormikContext()
  const { dataTokenOptions } = values.services[0]

  const {
    price,
    weightOnDataToken,
    weightOnOcean,
    swapFee,
    dtAmount,
    oceanAmount
  } = values.pricing

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
    <>
      <FormHelp>{content.info}</FormHelp>

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

      <Price firstPrice={firstPrice} />

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
            symbol: dataTokenOptions.symbol,
            name: dataTokenOptions.name
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
    </>
  )
}
