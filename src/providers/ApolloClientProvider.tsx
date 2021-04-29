import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from '@apollo/client'
import { Logger, ConfigHelperConfig } from '@oceanprotocol/lib'
import { useOcean } from './Ocean'
import fetch from 'cross-fetch'
import React, { useState, useEffect, ReactNode, ReactElement } from 'react'
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
  const { config } = useOcean()
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>()

  useEffect(() => {
    if (!(config as ConfigHelperConfig)?.subgraphUri) {
      Logger.error(
        'No subgraphUri defined, preventing ApolloProvider from initialization.'
      )
      return
    }

    const newClient = createClient((config as ConfigHelperConfig).subgraphUri)
    apolloClient = newClient
    setClient(newClient)
  }, [config])

  return client ? (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  ) : (
    <></>
  )
}

export { ApolloClientProvider }
