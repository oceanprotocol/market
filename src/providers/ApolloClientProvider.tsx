import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from '@apollo/client'
import { ConfigHelperConfig } from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'
import { useOcean } from '@oceanprotocol/react'
import React, { useState, useEffect, ReactNode, ReactElement } from 'react'

export default function ApolloClientProvider({
  children
}: {
  children: ReactNode
}): ReactElement {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>()
  const { config } = useOcean()

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

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export { ApolloClientProvider }
