import React, { ReactElement, useEffect, useState } from 'react'
import Alert from '@shared/atoms/Alert'
import FormHelp from '@shared/FormInput/Help'
import Tooltip from '@shared/atoms/Tooltip'
import Coin from './Coin'
import styles from './Dynamic.module.css'
import Fees from './Fees'
import { FormikContextType, useFormikContext } from 'formik'
import Price from './Price'
import Decimal from 'decimal.js'
import { useWeb3 } from '@context/Web3'
import { FormPublishData } from '../_types'

export default function Dynamic({ content }: { content: any }): ReactElement {
  const { networkId, accountId, balance } = useWeb3()
  const [firstPrice, setFirstPrice] = useState<string>()

  // Connect with form
  const { values }: FormikContextType<FormPublishData> = useFormikContext()
  const { dataTokenOptions } = values.services[0]

  const {
    price,
    weightOnDataToken,
    weightOnOcean,
    swapFee,
    amountDataToken,
    amountOcean
  } = values.pricing

  const [error, setError] = useState<string>()

  // Calculate firstPrice whenever user values change
  useEffect(() => {
    if (`${amountOcean}` === '') return

    const tokenAmountOut = 1
    const weightRatio = new Decimal(weightOnDataToken).div(
      new Decimal(weightOnOcean)
    )
    const diff = new Decimal(amountDataToken).minus(tokenAmountOut)
    const y = new Decimal(amountDataToken).div(diff)
    const foo = y.pow(weightRatio).minus(new Decimal(1))
    const tokenAmountIn = new Decimal(amountOcean)
      .times(foo)
      .div(new Decimal(1).minus(new Decimal(swapFee / 100)))
    setFirstPrice(`${tokenAmountIn}`)
  }, [swapFee, weightOnOcean, weightOnDataToken, amountDataToken, amountOcean])

  // Check: account, network & insufficient balance
  useEffect(() => {
    if (!accountId) {
      setError(`No account connected. Please connect your Web3 wallet.`)
    } else if (Number(balance.ocean) < Number(amountOcean)) {
      setError(`Insufficient balance. You need at least ${amountOcean} OCEAN.`)
    } else {
      setError(undefined)
    }
  }, [amountOcean, networkId, accountId, balance])

  return (
    <>
      <FormHelp>{content.info}</FormHelp>

      <h4 className={styles.title}>
        Price <Tooltip content={content.tooltips.poolInfo} />
      </h4>

      <Price firstPrice={firstPrice} />

      <h4 className={styles.title}>
        Datatoken Liquidity Pool <Tooltip content={content.tooltips.poolInfo} />{' '}
        <span className={styles.subtitle}>100% share of pool</span>
      </h4>

      <div className={styles.tokens}>
        <Coin
          name="amountOcean"
          datatokenOptions={{ symbol: 'OCEAN', name: 'Ocean Token' }}
          weight={`${Number(weightOnOcean) * 10}%`}
        />
        <Coin
          name="amountDataToken"
          datatokenOptions={{
            symbol: dataTokenOptions.symbol,
            name: dataTokenOptions.name
          }}
          weight={`${Number(weightOnDataToken) * 10}%`}
          readOnly
        />
      </div>

      <Fees tooltips={content.tooltips} pricingType="dynamic" />

      {error && (
        <div className={styles.alertArea}>
          <Alert text={error} state="error" />
        </div>
      )}
    </>
  )
}
