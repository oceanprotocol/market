import {
  createClient,
  Provider,
  Client,
  dedupExchange,
  fetchExchange
} from 'urql'
import { refocusExchange } from '@urql/exchange-refocus'
import React, { useState, useEffect, ReactNode, ReactElement } from 'react'
import { LoggerInstance } from '@oceanprotocol/lib'
import { getOceanConfig } from '@utils/ocean'

let urqlClient: Client

function createUrqlClient(subgraphUri: string) {
  const client = createClient({
    url: `${subgraphUri}/subgraphs/name/oceanprotocol/ocean-subgraph`,
    exchanges: [dedupExchange, refocusExchange(), fetchExchange]
  })
  return client
}

export function getUrqlClientInstance(): Client {
  return urqlClient
}

export default function UrqlClientProvider({
  children
}: {
  children: ReactNode
}): ReactElement {
  //
  // Set a default client here based on ETH Mainnet, as that's required for
  // urql to work.
  // Throughout code base this client is then used and altered by passing
  // a new queryContext holding different subgraph URLs.
  //
  const [client, setClient] = useState<Client>()

  useEffect(() => {
    const oceanConfig = getOceanConfig(1)

    if (!oceanConfig?.subgraphUri) {
      LoggerInstance.error(
        'No subgraphUri defined, preventing UrqlProvider from initialization.'
      )
      return
    }

    const newClient = createUrqlClient(oceanConfig.subgraphUri)
    urqlClient = newClient
    setClient(newClient)
    LoggerInstance.log(`[URQL] Client connected to ${oceanConfig.subgraphUri}`)
  }, [])

  return client ? <Provider value={client}>{children}</Provider> : <></>
}

export { UrqlClientProvider }
