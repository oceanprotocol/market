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
import BaseToken from './BaseToken'
import { transformTokenName } from '../_utils'

export default function Dynamic({
  content,
  defaultBaseToken
}: {
  content: any
  defaultBaseToken: TokenInfo
}): ReactElement {
  const { networkId, accountId, balance } = useWeb3()
  const [firstPrice, setFirstPrice] = useState<string>()

  // Connect with form
  const { values }: FormikContextType<FormPublishData> = useFormikContext()
  const { dataTokenOptions } = values.services[0]

  const {
    weightOnDataToken,
    weightOnBaseToken,
    swapFee,
    amountDataToken,
    amountBaseToken,
    baseToken
  } = values.pricing
  const baseTokenKey = baseToken?.symbol?.toLocaleLowerCase()

  const [error, setError] = useState<string>()

  // Calculate firstPrice whenever user values change
  useEffect(() => {
    if (`${amountBaseToken}` === '') return

    const tokenAmountOut = 1
    const weightRatio = new Decimal(weightOnDataToken).div(
      new Decimal(weightOnBaseToken)
    )
    const diff = new Decimal(amountDataToken).minus(tokenAmountOut)
    const y = new Decimal(amountDataToken).div(diff)
    const foo = y.pow(weightRatio).minus(new Decimal(1))
    const tokenAmountIn = new Decimal(amountBaseToken)
      .times(foo)
      .div(new Decimal(1).minus(new Decimal(swapFee / 100)))
    setFirstPrice(`${tokenAmountIn}`)
  }, [
    swapFee,
    weightOnBaseToken,
    weightOnDataToken,
    amountDataToken,
    amountBaseToken
  ])

  // Check: account, network & insufficient balance
  useEffect(() => {
    if (!accountId) {
      setError(`No account connected. Please connect your Web3 wallet.`)
    } else if (Number(balance[baseTokenKey]) < Number(amountBaseToken)) {
      setError(
        `Insufficient balance. You need at least ${amountBaseToken} ${baseToken.symbol}.`
      )
    } else {
      setError(undefined)
    }
  }, [amountBaseToken, networkId, accountId, balance, baseToken, baseTokenKey])

  return (
    <>
      <FormHelp>{content.info}</FormHelp>

      <h4 className={styles.title}>
        Base Token <Tooltip content={content.tooltips.baseToken} />
      </h4>

      <BaseToken defaultBaseToken={defaultBaseToken} />

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
          name="amountBaseToken"
          datatokenOptions={{
            symbol: baseToken?.symbol,
            name: transformTokenName(baseToken?.name)
          }}
          weight={`${Number(weightOnBaseToken) * 10}%`}
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
