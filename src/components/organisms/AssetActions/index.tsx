import React, { ReactElement, useState, useEffect } from 'react'
import styles from './index.module.css'
import Compute from './Compute'
import Consume from './Consume'
import { Logger } from '@oceanprotocol/lib'
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
  InMemoryCache,
  NormalizedCacheObject
} from '@apollo/client'
import fetch from 'cross-fetch'

export default function AssetActions(): ReactElement {
  const { ocean, balance, accountId, config } = useOcean()
  const { price, ddo, metadata } = useAsset()
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>()
  const [isBalanceSufficient, setIsBalanceSufficient] = useState<boolean>()
  const [dtBalance, setDtBalance] = useState<string>()

  const isCompute = Boolean(ddo?.findServiceByType('compute'))

  useEffect(() => {
    console.log('config', config)
    const newClient = new ApolloClient({
      link: new HttpLink({
        uri: `${
          (config as any).subgraphUri
        }/subgraphs/name/oceanprotocol/ocean-subgraph`,
        fetch
      }),
      cache: new InMemoryCache()
    })
    setClient(newClient)
  }, [config])
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
      file={metadata?.main.files[0]}
    />
  )

  const tabs = [
    {
      title: 'Use',
      content: UseContent
    }
  ]

  // Check from metadata, cause that is available earlier
  const hasPool = ddo?.price?.type === 'pool'

  hasPool &&
    tabs.push(
      {
        title: 'Pool',
        content: <Pool />
      },
      {
        title: 'Trade',
        content: <Trade />
      }
    )

  return client ? (
    <ApolloProvider client={client}>
      <Tabs items={tabs} className={styles.actions} />
    </ApolloProvider>
  ) : (
    <></>
  )
}
