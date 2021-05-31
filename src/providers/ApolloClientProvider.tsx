import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from '@apollo/client'
import { Logger } from '@oceanprotocol/lib'
import fetch from 'cross-fetch'
import React, { useState, useEffect, ReactNode, ReactElement } from 'react'
import { useWeb3 } from './Web3'
import { getOceanConfig } from '../utils/ocean'
let apolloClient: ApolloClient<NormalizedCacheObject>

function createClient(subgraphUri: string) {
  const client = new ApolloClient({
    link: new HttpLink({
      uri: `${subgraphUri}/subgraphs/name/oceanprotocol/ocean-subgraph`,
      fetch
    }),
    cache: new InMemoryCache()
  })

  return client
}

export function getApolloClientInstance(): ApolloClient<NormalizedCacheObject> {
  return apolloClient
}

export default function ApolloClientProvider({
  children
}: {
  children: ReactNode
}): ReactElement {
  const { networkId } = useWeb3()
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>()

  useEffect(() => {
    const { subgraphUri } = getOceanConfig(networkId || 1)

    if (!subgraphUri) {
      Logger.error(
        'No subgraphUri defined, preventing ApolloProvider from initialization.'
      )
      return
    }

    const newClient = createClient(subgraphUri)
    apolloClient = newClient
    setClient(newClient)
  }, [networkId])

  return client ? (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  ) : (
    <></>
  )
}

export { ApolloClientProvider }
