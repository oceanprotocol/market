import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from '@apollo/client'
import { Logger } from '@oceanprotocol/lib'
import { ConfigHelperConfig } from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'
import { useOcean } from '@oceanprotocol/react'
import fetch from 'cross-fetch'
import React, { useState, useEffect, ReactNode, ReactElement } from 'react'

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
    setClient(newClient)
  }, [config])

  return client ? (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  ) : (
    <></>
  )
}

export { ApolloClientProvider }
