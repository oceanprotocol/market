import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from '@apollo/client'
import { ConfigHelperConfig } from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'
import { useOcean } from '@oceanprotocol/react'
import fetch from 'cross-fetch'
import React, { useState, useEffect, ReactNode, ReactElement } from 'react'

export default function ApolloClientProvider({
  children
}: {
  children: ReactNode
}): ReactElement {
  const { config } = useOcean()
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>()

  useEffect(() => {
    if (!(config as ConfigHelperConfig)?.subgraphUri) return

    const newClient = new ApolloClient({
      link: new HttpLink({
        uri: `${
          (config as ConfigHelperConfig).subgraphUri
        }/subgraphs/name/oceanprotocol/ocean-subgraph`,
        fetch
      }),
      cache: new InMemoryCache()
    })

    setClient(newClient)
  }, [config])

  return client ? (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  ) : (
    <></>
  )
}

export { ApolloClientProvider }
