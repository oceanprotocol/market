import React, { ReactElement, useState, useEffect } from 'react'
import styles from './index.module.css'
import Compute from './Compute'
import Consume from './Consume'
import { DDO, Logger } from '@oceanprotocol/lib'
import Tabs from '../../atoms/Tabs'
import { useOcean } from '@oceanprotocol/react'
import compareAsBN from '../../../utils/compareAsBN'
import Pool from './Pool'
import Trade from './Trade'
import { useAsset } from '../../../providers/Asset'
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache
} from '@apollo/client'
import fetch from 'cross-fetch'
const client = new ApolloClient({
  link: new HttpLink({
    uri:
      'http://54.81.231.185:8000/subgraphs/name/oceanprotocol/ocean-subgraph',
    fetch
  }),
  cache: new InMemoryCache()
})
export default function AssetActions({ ddo }: { ddo: DDO }): ReactElement {
  const { ocean, balance, accountId } = useOcean()
  const { price } = useAsset()
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

  const tabs = [
    {
      title: 'Use',
      content: UseContent
    }
  ]

  // Check from metadata, cause that is available earlier
  const hasPool = ddo.price?.type === 'pool'

  hasPool &&
    tabs.push(
      {
        title: 'Pool',
        content: <Pool ddo={ddo} />
      },
      {
        title: 'Trade',
        content: <Trade ddo={ddo} />
      }
    )

  return (
    <ApolloProvider client={client}>
      <Tabs items={tabs} className={styles.actions} />
    </ApolloProvider>
  )
}
