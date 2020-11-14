import React, { ReactElement, useState, useEffect } from 'react'
import styles from './index.module.css'
import Compute from './Compute'
import Consume from './Consume'
import Rate from './Rate'
import { DDO, Logger } from '@oceanprotocol/lib'
import Tabs from '../../atoms/Tabs'
import { useOcean, useMetadata } from '@oceanprotocol/react'
import compareAsBN from '../../../utils/compareAsBN'
import Pool from './Pool'

export default function AssetActions({ ddo }: { ddo: DDO }): ReactElement {
  const { ocean, balance, accountId } = useOcean()
  const { price } = useMetadata(ddo)
  const [isBalanceSufficient, setIsBalanceSufficient] = useState<boolean>()
  const [dtBalance, setDtBalance] = useState<string>()

  const isCompute = Boolean(ddo.findServiceByType('compute'))
  const { attributes } = ddo.findServiceByType('metadata')

  // Get and set user DT balance
  useEffect(() => {
    if (!ocean || !accountId) return

    async function init() {
      try {
        const dtBalance = await ocean.datatokens.balance(
          ddo.dataToken,
          accountId
        )
        setDtBalance(dtBalance)
      } catch (e) {
        Logger.error(e.message)
      }
    }
    init()
  }, [ocean, accountId, ddo.dataToken])

  // Check user balance against price
  useEffect(() => {
    if (!price?.value || !accountId || !balance?.ocean || !dtBalance) return

    setIsBalanceSufficient(
      compareAsBN(balance.ocean, `${price.value}`) || Number(dtBalance) >= 1
    )

    return () => {
      setIsBalanceSufficient(false)
    }
  }, [balance, accountId, price, dtBalance])

  const UseContent = isCompute ? (
    <Compute
      ddo={ddo}
      dtBalance={dtBalance}
      isBalanceSufficient={isBalanceSufficient}
    />
  ) : (
    <Consume
      ddo={ddo}
      dtBalance={dtBalance}
      isBalanceSufficient={isBalanceSufficient}
      file={attributes.main.files[0]}
    />
  )

  const RateContent = (
    <Rate />
  )

  const tabs = [
    {
      title: 'Use',
      content: UseContent
    }
  ]

  // Check from metadata, cause that is available earlier
  const hasPool = ddo.price?.type === 'pool'

  hasPool &&
    tabs.push({
      title: 'Pool',
      content: <Pool ddo={ddo} />
    })
    tabs.push({
      title: 'Rating',
      content: RateContent
    })

  return <Tabs items={tabs} className={styles.actions} />
}
